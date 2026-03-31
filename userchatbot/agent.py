# GEMINI AI AGENT

import os
import math
import pandas as pd
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity

    # Build chat history context
chat_context = "\n".join([
        f"{ctx['user']}: {ctx['user_message']}"
        for ctx in chat_history
    ]

# ===================== BOOKS & EMBEDDINGS LOADING (ONCE PER DEPARTMENT) =====================
BOOKS_CACHE = {}
EMBEDDINGS_CACHE = {}
EMBEDDING_MODEL = None

def get_books_for_department(department):
    """
    Loads books from the department-specific CSV file.
    """
    base_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "datasets",
        "department_books"
    )
    csv_path = os.path.join(base_path, f"{department}_books.csv")
    if not os.path.exists(csv_path):
        return []
    df = pd.read_csv(csv_path)
    books = []
    for _, row in df.iterrows():
        title = str(row.get("Title", "Unknown"))
        author = str(row.get("Author", "Unknown"))
        available_copies = int(row.get("Available_Copies", 0))
        total_copies = int(row.get("Total_Copies", 0))
        rating_value = available_copies if available_copies > 0 else total_copies
        year = 2026
        search_blob = f"{title} {author}".lower()
        books.append({
            "title": title,
            "author": author,
            "price": "N/A",
            "rating": rating_value,
            "release_year": year,
            "search_blob": search_blob
        })
    return books

def initialize_embeddings(books):
    global EMBEDDING_MODEL
    if EMBEDDING_MODEL is None:
        EMBEDDING_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    book_texts = [b["search_blob"] for b in books]
    book_embeddings = EMBEDDING_MODEL.encode(book_texts, show_progress_bar=False)
    return EMBEDDING_MODEL, book_embeddings

def ensure_books_and_embeddings(session):
    dept = session["department"]
    if dept not in BOOKS_CACHE:
        BOOKS_CACHE[dept] = get_books_for_department(dept)
    if dept not in EMBEDDINGS_CACHE:
        EMBEDDINGS_CACHE[dept] = initialize_embeddings(BOOKS_CACHE[dept])
    return BOOKS_CACHE[dept], EMBEDDINGS_CACHE[dept]

# ===================== NLP FILTER ENGINE =====================
def expand_query(query):
    QUERY_EXPANSIONS = {
        "jee": "jee engineering entrance iit entrance exam physics chemistry mathematics",
        "jee mains": "jee mains engineering entrance exam physics chemistry maths",
        "neet": "neet medical entrance biology physics chemistry",
        "upsc": "upsc civil services india history geography politics economics",
        "gate": "gate engineering exam preparation",
    }
    q = query.lower()
    for key in QUERY_EXPANSIONS:
        if key in q:
            q += " " + QUERY_EXPANSIONS[key]
    return q

def nlp_filter_books(user_prompt, books, embedding_model, book_embeddings, top_n=60):
    import math
    expanded_query = expand_query(user_prompt)
    query_embedding = embedding_model.encode([expanded_query])
    similarities = cosine_similarity(query_embedding, book_embeddings)[0]
    scored_books = []
    query_lower = user_prompt.lower()
    for idx, similarity_score in enumerate(similarities):
        book = books[idx]
        rating = book["rating"]
        popularity_score = math.log1p(rating)
        year = book["release_year"]
        recency_score = year / 2025 if year else 0
        keyword_bonus = 0
        if query_lower in book["search_blob"]:
            keyword_bonus += 0.25
        final_score = (
            0.85 * similarity_score +
            0.10 * popularity_score +
            0.05 * recency_score +
            keyword_bonus
        )
        scored_books.append((final_score, book))
    scored_books.sort(reverse=True, key=lambda x: x[0])
    top_books = [book for _, book in scored_books[:top_n]]
    return top_books

# ===================== AI-POWERED RECOMMENDATION =====================
def model_recommendation(user_prompt, filtered_books):
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            return "Error: GEMINI_API_KEY environment variable not found."
        client = genai.Client(api_key=api_key)
        MODEL_ID = "gemini-2.5-flash"
    except Exception as e:
        return f"Error initializing Gemini client: {e}"
    book_context = "\n".join([
        f"Title: {b['title']} | Author: {b['author']} | Rating_Count: {b['rating']} | Price: {b['price']}"
        for b in filtered_books
    ])
    config = types.GenerateContentConfig(
        system_instruction="""You are an AI library assistant for an engineering college.
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
        temperature=0.6
    )
    full_prompt = f"""

        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                intent_info[key.strip()] = value.strip()

    try:
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )
        return response.text
    except Exception as e:
        return f"Error calling Gemini API: {e}"

# GEMINI AI AGENT
def gemini_agent(session, user_message):
    """
    Uses Google Gemini AI as the main agent chatbot.
    """
    # Ensure books and embeddings are loaded for this department
    books, (embedding_model, book_embeddings) = ensure_books_and_embeddings(session)

        def build_chat_context(chat_history=None):
            """
            Builds a chat context string from the chat history.
            chat_history: list of dicts with keys 'user' and 'user_message'.
            Returns a string suitable for passing as context to the AI model.
            """
            if chat_history is None:
                chat_history = []
            return "\n".join([
                f"{ctx['user']}: {ctx['user_message']}"
                for ctx in chat_history
            ])

        chat_context = build_chat_context(session.get("chat_history", []))

    # System instruction (works on intent detection)
    system_instruction = f"""You are a helpful library assistant for an engineering college.
The current user is {session['username']} from {session['department']} department, year {session['year']}.
        intent = intent_info.get('INTENT', 'UNCLEAR')
You have access to the official library information page: https://www.pce.ac.in/library/library-information/
If the user asks any general or basic questions about the library (such as timings, rules, facilities, or general information), use this page as your reference to answer accurately.

Your main jobs are:
1. Understand what the user wants
2. Extract relevant details
3. Respond in EXACT format for intents below, OR answer basic library questions using the reference link above.
        if intent == 'RECOMMEND':
Supported intents:
            topic = intent_info.get('TOPIC', '')
For RECOMMENDATIONS:
INTENT:RECOMMEND
TOPIC:[what book/topic they want]
            return call_recommend_function(session, topic)
For SUMMARIES:
INTENT:SUMMARY
BOOK:[book name]

For REVIEWS:
INTENT:REVIEW
BOOK:[book name]
        elif intent == 'SUMMARY':
For BORROWING:
INTENT:BORROW
BOOK:[book name]
            book = intent_info.get('BOOK', '')
For RETURNING:
INTENT:RETURN
BOOK:[book name]
            return call_summary_function(session, book)
If unclear:
INTENT:UNCLEAR
MESSAGE:[ask for clarification]

If the user asks about the library itself, answer using the information from the reference link above.
Do NOT answer book/borrow/recommendation queries directly—only detect intent and extract details for those."""
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
        elif intent == 'REVIEW':
            book = intent_info.get('BOOK', '')
            return call_review_function(session, book)
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )
        return response.text
    except Exception as e:
        return f"Error: {e}"

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