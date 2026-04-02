
# GEMINI AI AGENT — DATA MANAGER & FORMATTER
# ===========================================
# This file is the "brain" of the library chatbot.
# Responsibilities:
#   1. Load book data from CSV files
#   2. Create and cache AI embeddings (persistent .npy files)
#   3. Detect user intent using Gemini AI
#   4. Route intents to specialized modules (recommend, summary, review, borrow)
#   5. Format recommendation results into premium responses

import os
import numpy as np
import pandas as pd
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer


# ============================================================================
# GLOBAL CACHES (In-Memory)
# ============================================================================
BOOKS_CACHE = {}          # { "CS": [book_dict, ...] }
EMBEDDINGS_CACHE = {}     # { "CS": numpy_array }
EMBEDDING_MODEL = None    # SentenceTransformer instance (loaded once)

# Paths
CACHE_DIR = os.path.join(os.path.dirname(__file__), "cache")
DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets", "dept_books")

# Department code → CSV filename mapping
DEPARTMENT_FILE_MAP = {
    "CS": "computer_science_books.csv",
    "IT": "information_technology_books.csv",
    "MECH": "mechanical_books.csv",
    "AUTO": "automobile_books.csv",
    "ECS": "ecs_books.csv",
    "EXTC": "extc_books.csv",
    "FY": "first_year_core_books.csv",
}


# ============================================================================
# 1. BOOK DATA LOADING
# ============================================================================
def get_books_for_department(department):
    """
    Reads the department-specific CSV file and returns a list of book
    dictionaries with standardized fields.
    """
    filename = DEPARTMENT_FILE_MAP.get(department.upper(), f"{department}_books.csv")
    csv_path = os.path.join(DATASETS_DIR, filename)
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


# ============================================================================
# 2. EMBEDDING MANAGEMENT (Persistent Cache + Stale Check)
# ============================================================================
def _get_csv_path(department):
    """Returns the absolute path to the department's book CSV."""
    filename = DEPARTMENT_FILE_MAP.get(department.upper(), f"{department}_books.csv")
    return os.path.join(DATASETS_DIR, filename)


def _get_cache_path(department):
    """Returns the absolute path to the department's cached embeddings."""
    return os.path.join(CACHE_DIR, f"{department}_embeddings.npy")


def _is_cache_stale(department):
    """
    Checks if the cached embeddings are older than the source CSV.
    Returns True if cache is missing or stale (CSV was updated after cache).
    """
    cache_path = _get_cache_path(department)
    csv_path = _get_csv_path(department)

    if not os.path.exists(cache_path):
        return True  # No cache exists, must generate

    if not os.path.exists(csv_path):
        return False  # No CSV either, nothing to do

    # Compare last-modified timestamps
    cache_mtime = os.path.getmtime(cache_path)
    csv_mtime = os.path.getmtime(csv_path)

    return csv_mtime > cache_mtime  # Stale if CSV is newer


def _load_embedding_model():
    """Loads the SentenceTransformer model once and caches it globally."""
    global EMBEDDING_MODEL
    if EMBEDDING_MODEL is None:
        EMBEDDING_MODEL = SentenceTransformer("all-MiniLM-L6-v2")
    return EMBEDDING_MODEL


def _generate_and_save_embeddings(department, books):
    """
    Generates embeddings for all books and saves them to disk as .npy.
    Returns the numpy array of embeddings.
    """
    model = _load_embedding_model()
    book_texts = [b["search_blob"] for b in books]
    embeddings = model.encode(book_texts, show_progress_bar=False)

    # Save to disk for persistence
    os.makedirs(CACHE_DIR, exist_ok=True)
    cache_path = _get_cache_path(department)
    np.save(cache_path, embeddings)
    print(f"[Cache] Saved embeddings for '{department}' → {cache_path}")

    return embeddings


def ensure_books_and_embeddings(session):
    """
    The main "manager" function. Ensures books and embeddings are ready.
    - Loads books from CSV (cached in memory).
    - Loads embeddings from .npy cache if fresh, or regenerates if stale.

    Returns:
        tuple: (books_list, (embedding_model, book_embeddings_array))
    """
    dept = session["department"]

    # Load books into memory cache
    if dept not in BOOKS_CACHE:
        BOOKS_CACHE[dept] = get_books_for_department(dept)

    books = BOOKS_CACHE[dept]

    # Check if we need to generate or can load from disk
    if dept not in EMBEDDINGS_CACHE or _is_cache_stale(dept):
        cache_path = _get_cache_path(dept)

        if not _is_cache_stale(dept) and os.path.exists(cache_path):
            # Load from disk (fast path)
            embeddings = np.load(cache_path)
            model = _load_embedding_model()
            print(f"[Cache] Loaded embeddings for '{dept}' from disk")
        else:
            # Generate fresh embeddings and save to disk
            print(f"[Cache] Generating fresh embeddings for '{dept}'...")
            embeddings = _generate_and_save_embeddings(dept, books)
            model = _load_embedding_model()

        EMBEDDINGS_CACHE[dept] = (model, embeddings)

    return books, EMBEDDINGS_CACHE[dept]


# ============================================================================
# 3. GEMINI INTENT DETECTION (with Context Awareness)
# ============================================================================
def gemini_agent(session, user_message):
    """
    Uses Google Gemini AI as the main agent chatbot.
    Detects the user's intent and routes to the correct handler.
    """
    # Ensure books and embeddings are loaded for this department
    books, (embedding_model, book_embeddings) = ensure_books_and_embeddings(session)

    def build_chat_context(chat_history=None):
        if chat_history is None:
            chat_history = []
        return "\n".join([
            f"{ctx['user']}: {ctx['user_message']}"
            for ctx in chat_history
        ])

    chat_context = build_chat_context(session.get("chat_history", []))

    system_instruction = f"""You are a helpful library assistant for an engineering college.
The current user is {session['username']} from {session['department']} department, year {session['year']}.
You have access to the official library information page: https://www.pce.ac.in/library/library-information/
If the user asks any general or basic questions about the library (such as timings, rules, facilities, or general information), use this page as your reference to answer accurately.
Your main jobs are:
1. Understand what the user wants
2. Extract relevant details
3. Respond in EXACT format for intents below, OR answer basic library questions using the reference link above.

CRITICAL - CONTEXT AWARENESS:
The conversation history is provided below. When the user uses pronouns or vague references like "it", "that", "this book", "the first one", "that one", or "give me summary of it", you MUST resolve these references by looking at the conversation history to identify the actual book title being referred to.
For example:
- If the bot previously recommended "Introduction to Algorithms" and the user says "give me a summary of it", you must output BOOK:Introduction to Algorithms.
- If the bot recommended multiple books and the user says "the second one", resolve it to the actual book title from the list.
NEVER output vague references like BOOK:it or BOOK:that. Always resolve to the real book title.

Supported intents:
- RECOMMEND
- SUMMARY
- REVIEW
- BORROW
- RETURN
- UNCLEAR
For RECOMMENDATIONS:
INTENT:RECOMMEND
TOPIC:[what book/topic they want]
For SUMMARIES:
INTENT:SUMMARY
BOOK:[resolved book name - NEVER use pronouns here]
For REVIEWS:
INTENT:REVIEW
BOOK:[resolved book name - NEVER use pronouns here]
For BORROWING:
INTENT:BORROW
BOOK:[resolved book name - NEVER use pronouns here]
For RETURNING:
INTENT:RETURN
BOOK:[resolved book name - NEVER use pronouns here]
If unclear:
INTENT:UNCLEAR
MESSAGE:[ask for clarification]
If the user asks about the library itself, answer using the information from the reference link above.
Do NOT answer book/borrow/recommendation queries directly - only detect intent and extract details for those."""

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
        full_prompt = f"{chat_context}\nUser: {user_message}"
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )
        gemini_intent = response.text.strip()
        return process_intent(gemini_intent, session, user_message, books, embedding_model, book_embeddings)
    except Exception as e:
        return f"Error: {e}"


# ============================================================================
# 4. INTENT ROUTING
# ============================================================================
def process_intent(intent_response, session, user_message, books, embedding_model, book_embeddings):
    """
    Parses the structured intent from Gemini and routes to the correct handler.
    For RECOMMEND: calls recommend.py's search engine, then formats with Gemini.
    """
    try:
        lines = intent_response.strip().split('\n')
        intent_info = {}
        for line in lines:
            if ':' in line:
                key, value = line.split(':', 1)
                intent_info[key.strip().upper()] = value.strip()

        intent = intent_info.get('INTENT', 'UNCLEAR').upper()

        if intent == 'RECOMMEND':
            topic = intent_info.get('TOPIC', '')
            return handle_recommendation(topic, session, books, embedding_model, book_embeddings)

        elif intent == 'SUMMARY':
            book = intent_info.get('BOOK', '')
            return call_summary_function(session, book)

        elif intent == 'REVIEW':
            book = intent_info.get('BOOK', '')
            return call_review_function(session, book)

        elif intent == 'BORROW' or intent == 'RETURN':
            return call_borrow_return_function(session, user_message)

        elif intent == 'UNCLEAR':
            return intent_info.get('MESSAGE', 'Please specify your request clearly.')

        else:
            # For library-related or general responses from Gemini
            return intent_response

    except Exception as e:
        return f"Error processing intent: {str(e)}"


# ============================================================================
# 5. RECOMMENDATION HANDLER (Calls recommend.py + Premium Formatting)
# ============================================================================
def handle_recommendation(topic, session, books, embedding_model, book_embeddings):
    """
    1. Calls recommend.py's search engine to get top books.
    2. Uses Gemini to format the raw results into a premium, conversational response.
    """
    try:
        from recommend import get_recommendations
        top_books = get_recommendations(topic, books, embedding_model, book_embeddings, top_n=5)
    except ImportError:
        return "Recommendation engine not found. Please ensure recommend.py exists."
    except Exception as e:
        return f"Error getting recommendations: {str(e)}"

    if not top_books:
        return "Sorry, I couldn't find any recommendations for that topic in your department's library."

    # Format with Gemini for a premium response
    return format_recommendations_with_gemini(topic, top_books, session)


def format_recommendations_with_gemini(topic, top_books, session):
    """
    Takes raw book results and uses Gemini to present them in a
    friendly, conversational format for the website.
    """
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        # Fallback: return a simple formatted list
        return _simple_format(top_books)

    book_list = "\n".join([
        f"- {b['title']} by {b['author']} (Copies available: {b['rating']})"
        for b in top_books
    ])

    system_instruction = f"""You are a friendly library assistant for {session['department']} department students (Year {session['year']}).
Format the following book recommendations into a helpful, conversational response.

RULES:
- Include ALL the books from the list below. Do not skip any.
- For each book, briefly mention why it might be useful for the topic.
- Keep it concise but warm and helpful.
- Do NOT add any books that are not in the list.
- Use bullet points or numbered list for clarity."""

    prompt = f"""The student asked about: "{topic}"

Here are the top recommendations from our library:
{book_list}

Please present these to the student in a friendly way."""

    try:
        client = genai.Client(api_key=api_key)
        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.5
        )
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt,
            config=config
        )
        return response.text.strip()
    except Exception:
        # Fallback to simple format if Gemini fails
        return _simple_format(top_books)


def _simple_format(top_books):
    """Fallback formatting when Gemini is unavailable."""
    return "📚 Recommended books:\n" + "\n".join([
        f"  • {b['title']} by {b['author']}"
        for b in top_books
    ])


# ============================================================================
# 6. MODULE CALLERS (Summary, Review, Borrow/Return)
# ============================================================================
def call_summary_function(session, book_name):
    try:
        from summary import generate_summary
        return generate_summary(book_name, session=session)
    except ImportError:
        return "Summary module not found."
    except Exception as e:
        return f"Error generating summary: {str(e)}"


def call_review_function(session, book_name):
    try:
        from review import generate_review
        return generate_review(book_name)
    except ImportError:
        return "Review module not found."
    except Exception as e:
        return f"Error generating review: {str(e)}"


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