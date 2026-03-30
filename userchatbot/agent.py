import os
import pandas as pd
from google import genai
from google.genai import types


# GEMINI AI AGENT
def gemini_agent(session, user_message):
    """
    Uses Google Gemini AI as the main agent chatbot.
    """

    # Build chat history context
    chat_context = "\n".join([
        f"User: {msg['content']}" if msg['role'] == 'user' else f"Bot: {msg['content']}"
        for msg in session["chat_history"][:-1]
    ])

    # System instruction (works on intent detection)
    system_instruction = f"""You are a helpful library assistant for an engineering college.
The current user is {session['username']} from {session['department']} department, year {session['year']}.

Your ONLY job is to:
1. Understand what the user wants
2. Extract relevant details
3. Respond in EXACT format

Supported intents:

For RECOMMENDATIONS:
INTENT:RECOMMEND
TOPIC:[what book/topic they want]

For SUMMARIES:
INTENT:SUMMARY
BOOK:[book name]

For REVIEWS:
INTENT:REVIEW
BOOK:[book name]

For BORROWING:
INTENT:BORROW
BOOK:[book name]

For RETURNING:
INTENT:RETURN
BOOK:[book name]

If unclear:
INTENT:UNCLEAR
MESSAGE:[ask for clarification]

Do NOT answer the query. Only detect intent and extract details."""
    
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured."

    try:
        client = genai.Client(api_key=api_key)
        MODEL_ID = "gemini-2.5-flash"

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.3
        )

        full_prompt = f"""{chat_context}

User: {user_message}
Bot:"""

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )

        gemini_intent = response.text.strip()

        return process_intent(gemini_intent, session, user_message)

    except Exception as e:
        return f"Error communicating with Gemini: {str(e)}"


# INTENT ROUTER
def process_intent(intent_response, session, user_message):
    try:
        lines = intent_response.strip().split('\n')
        intent_info = {}

        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                intent_info[key.strip()] = value.strip()

        intent = intent_info.get('INTENT', 'UNCLEAR')

        if intent == 'RECOMMEND':
            topic = intent_info.get('TOPIC', '')
            return call_recommend_function(session, topic)

        elif intent == 'SUMMARY':
            book = intent_info.get('BOOK', '')
            return call_summary_function(session, book)

        elif intent == 'REVIEW':
            book = intent_info.get('BOOK', '')
            return call_review_function(session, book)

        elif intent == 'BORROW':
            return call_borrow_return_function(session, user_message)

        elif intent == 'RETURN':
            return call_borrow_return_function(session, user_message)

        elif intent == 'UNCLEAR':
            return intent_info.get(
                'MESSAGE',
                'Please specify your request clearly.'
            )

        else:
            return "Invalid intent response."

    except Exception as e:
        return f"Error processing intent: {str(e)}"


# RECOMMEND FUNCTION
def call_recommend_function(session, topic):
    pass  # Placeholder for recommendation logic based on session files and topic


# SUMMARY FUNCTION
def call_summary_function(session, book_name):
    try:
        from summary import generate_summary
        return generate_summary(book_name)

    except ImportError:
        return "Summary module not found."
    except Exception as e:
        return f"Error generating summary: {str(e)}"


# REVIEW FUNCTION 
def call_review_function(session, book_name):
    try:
        from review import generate_review
        return generate_review(book_name)

    except ImportError:
        return "Review module not found."
    except Exception as e:
        return f"Error generating review: {str(e)}"


# BORROW / RETURN FUNCTION CALLER
def call_borrow_return_function(session, user_message):
    """
    Calls borrow/return logic from borrow_or_return.py.
    This will handle issuing and returning books using CSV data.
    """
    try:
        from borrow_or_return import handle_borrow_return

        return handle_borrow_return(session, user_message)

    except ImportError:
        return "Borrow/Return module not found. Please ensure borrow_or_return.py exists."
    except Exception as e:
        return f"Error handling borrow/return: {str(e)}"
