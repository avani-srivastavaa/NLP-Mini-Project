import os
import math
import pandas as pd
import kagglehub
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# DOWNLOAD DATASET
print("Downloading dataset from Kaggle...")
DATASET_PATH = kagglehub.dataset_download(
    "rajkumardubey10/amazon-book-dataset30000-books-with-30-category"
)
print("Dataset downloaded at:", DATASET_PATH)


# QUERY EXPANSION (improves search for known frequently used keywords in book titles)
QUERY_EXPANSIONS = {
    "jee": "jee engineering entrance iit entrance exam physics chemistry mathematics",
    "jee mains": "jee mains engineering entrance exam physics chemistry maths",
    "neet": "neet medical entrance biology physics chemistry",
    "upsc": "upsc civil services india history geography politics economics",
    "gate": "gate engineering exam preparation",
}


def expand_query(query):
    q = query.lower()
    for key in QUERY_EXPANSIONS:
        if key in q:
            q += " " + QUERY_EXPANSIONS[key]
    return q


# LOAD DATASET
def get_books():
    files = os.listdir(DATASET_PATH)
    csv_file = [f for f in files if f.endswith(".csv")][0]
    df = pd.read_csv(os.path.join(DATASET_PATH, csv_file))
    print("Total rows in dataset:", len(df))
    books = []

    for _, row in df.iterrows():

        rating_raw = str(row.get("Book_Rating", "0")).replace(",", "")

        try:
            rating_value = int(rating_raw)
        except:
            rating_value = 0

        release_raw = str(row.get("Book_release_date", "0"))

        try:
            year = int(release_raw[:4])
        except:
            year = 0

        title = str(row.get("Book_Name", "Unknown"))
        author = str(row.get("Book_Author", "Unknown"))

        search_blob = f"{title} {author}".lower()

        books.append({
            "title": title,
            "author": author,
            "price": str(row.get("Book_Price", "Unknown")),
            "rating": rating_value,
            "release_year": year,
            "search_blob": search_blob
        })

    return books


# LOAD BOOKS
BOOKS = get_books()
print(f"Dataset loaded successfully: {len(BOOKS)} books available")


# EMBEDDING MODEL (uses semantic embeddings to find relevant books based on user query)
print("Loading embedding model...")
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
print("Generating embeddings...")
book_texts = [b["search_blob"] for b in BOOKS]
book_embeddings = embedding_model.encode(book_texts, show_progress_bar=True)
print("Embeddings generated.")


# NLP FILTER ENGINE (uses cosine similarity and heuristics with the embeddings to find best candidate books for query)
def nlp_filter_books(user_prompt, top_n=60):
    expanded_query = expand_query(user_prompt)
    query_embedding = embedding_model.encode([expanded_query])
    similarities = cosine_similarity(query_embedding, book_embeddings)[0]
    scored_books = []
    query_lower = user_prompt.lower()

    for idx, similarity_score in enumerate(similarities):

        book = BOOKS[idx]

        rating = book["rating"]
        year = book["release_year"]

        popularity_score = math.log1p(rating)

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


# GEMINI CLIENT
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
MODEL_ID = "gemini-2.5-flash"


# MODEL RECOMMENDATION
def model_recommendation(user_prompt, filtered_books):
    book_context = "\n".join([
        f"Title: {b['title']} | Author: {b['author']} | Rating_Count: {b['rating']} | Price: {b['price']}"
        for b in filtered_books
    ])

    config = types.GenerateContentConfig(

        system_instruction="""
You are an AI library assistant working with a limited dataset.

CRITICAL RULES:

1. You MUST only recommend books that appear in the provided dataset.
2. Never invent book titles.
3. If no book matches the request, reply:
   "Suitable book not found in library."

QUERY HANDLING:

• Break the user request into smaller requirements if possible.
• Identify preferences like subject, exam, or skill level.

RECOMMENDATION RULES:

1. First try to find ONE book that satisfies ALL requirements.
2. If different books satisfy different requirements, recommend up to 3 books.
3. Never recommend more than 3 books.

OUTPUT FORMAT:

Title:
Author:
Reason:

The reason should clearly explain which part of the user's query the book satisfies.
""",

        temperature=0.6
    )

    full_prompt = f"""
User Request:
{user_prompt}

Available Books (choose only from these):

{book_context}
"""

    try:

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )

        print("\nRecommended Books:\n")
        print(response.text)

    except Exception as e:
        print("Error:", e)


# CHAT LOOP
print("\nBook Recommendation Chatbot")
print("Type 'exit' to quit\n")

while True:
    user_input = input("\nWhat kind of book are you looking for? ")

    if user_input.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break

    if not user_input.strip():
        continue

    filtered_books = nlp_filter_books(user_input)
    model_recommendation(user_input, filtered_books)
