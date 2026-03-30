import os
from google import genai
from google.genai import types


# ============================================================================
# GEMINI AI AGENT (Main chatbot intelligence)
# ============================================================================
def gemini_agent(session, user_message):
    """
    Uses Google Gemini AI as the main agent chatbot.
    The agent understands user context (department, year) and recommends,
    summarizes, or reviews books based on user intent.
    
    Parameters:
        session: User session dict with username, department, year, chat_history
        user_message: Current user message
    
    Returns:
        str: AI-generated response from Gemini
    """
    # Build chat history context for Gemini
    chat_context = "\n".join([
        f"User: {msg['content']}" if msg['role'] == 'user' else f"Bot: {msg['content']}"
        for msg in session["chat_history"][:-1]  # Exclude the latest user message (we'll add it to prompt)
    ])
    
    # Create system instruction to detect user intent
    system_instruction = f"""You are a helpful library assistant for an engineering college.
The current user is {session['username']} from {session['department']} department, year {session['year']}.

Your ONLY job is to:
1. Understand what the user wants (RECOMMEND, SUMMARIZE, or REVIEW a book)
2. Extract the book name or topic they're asking about
3. Respond with ONLY the intent and details in this exact format:

For RECOMMENDATIONS:
INTENT:RECOMMEND
TOPIC:[what book/topic they want]

For SUMMARIES:
INTENT:SUMMARY
BOOK:[book name]

For REVIEWS:
INTENT:REVIEW
BOOK:[book name]

If unclear what they want, respond:
INTENT:UNCLEAR
MESSAGE:[ask for clarification]

Do NOT provide the actual recommendation/summary/review yourself. 
Just detect intent and extract details."""
    
    # Initialize Gemini client
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured on server. Please contact the administrator."
    
    try:
        client = genai.Client(api_key=api_key)
        MODEL_ID = "gemini-2.5-flash"
        
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.7  # Slightly creative but still informative
        )
        
        # Prepare full prompt with chat context
        full_prompt = f"""{chat_context}

User: {user_message}
Bot:"""
        
        # Call Gemini API to detect intent
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )
        
        gemini_intent = response.text.strip()
        
        # Parse Gemini's intent detection
        return process_intent(gemini_intent, session, user_message)
    
    except Exception as e:
        return f"Error communicating with Gemini: {str(e)}"


# ============================================================================
# INTENT ROUTER (Routes to appropriate function based on Gemini's detection)
# ============================================================================
def process_intent(intent_response, session, user_message):
    """
    Parses Gemini's intent detection and routes to appropriate function.
    
    Parameters:
        intent_response: Gemini's structured response with intent
        session: User session with department, year, etc.
        user_message: Original user message
    
    Returns:
        str: Response from the called function or clarification message
    """
    try:
        # Parse intent response
        lines = intent_response.strip().split('\n')
        intent_info = {}
        
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                intent_info[key.strip()] = value.strip()
        
        intent = intent_info.get('INTENT', 'UNCLEAR')
        
        # Route to appropriate function
        if intent == 'RECOMMEND':
            topic = intent_info.get('TOPIC', '')
            return call_recommend_function(session, topic)
        
        elif intent == 'SUMMARY':
            book = intent_info.get('BOOK', '')
            return call_summary_function(session, book)
        
        elif intent == 'REVIEW':
            book = intent_info.get('BOOK', '')
            return call_review_function(session, book)
        
        elif intent == 'UNCLEAR':
            message = intent_info.get('MESSAGE', 'I did not understand. Can you specify if you want to: recommend a book, get a summary, or read a review?')
            return message
        
        else:
            return "I did not understand your request."
    
    except Exception as e:
        return f"Error processing intent: {str(e)}"


# ============================================================================
# FUNCTION CALLERS (Calls appropriate module functions)
# ============================================================================
def call_recommend_function(session, topic):
    """
    Calls the book recommendation function from recommend.py.
    Passes user context (department, year) and search topic.
    """
    try:
        from book_recommendation.recommend import nlp_filter_books, initialize_embeddings, get_books_for_department, model_recommendation
        
        # Load books for the user's department
        books = get_books_for_department(session['department'])
        if not books:
            return f"No books found for {session['department']} department."
        
        # Initialize embeddings
        embedding_model, book_embeddings = initialize_embeddings(books)
        
        # Filter books based on user's query
        filtered_books = nlp_filter_books(topic, books, embedding_model, book_embeddings)
        
        # Get Gemini recommendations
        model_recommendation(topic, filtered_books)
        return "Recommendations generated. Check output for details."
    
    except Exception as e:
        return f"Error generating recommendations: {str(e)}"


def call_summary_function(session, book_name):
    """
    Calls the book summary function from summary.py.
    Generates a summarized version of the requested book.
    """
    try:
        from summary import generate_summary
        
        summary = generate_summary(book_name)
        return summary
    
    except ImportError:
        return f"Summary module not found. Please ensure summary.py is in the correct location."
    except Exception as e:
        return f"Error generating summary for '{book_name}': {str(e)}"


def call_review_function(session, book_name):
    """
    Calls the book review function from review.py.
    Generates a summarized review of the requested book.
    """
    try:
        from review import generate_review
        
        review = generate_review(book_name)
        return review
    
    except ImportError:
        return f"Review module not found. Please ensure review.py is in the correct location."
    except Exception as e:
        return f"Error generating review for '{book_name}': {str(e)}"
