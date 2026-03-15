
import os
import pandas as pd
import kagglehub
from google import genai
from google.genai import types


# DOWNLOAD DATASET FROM KAGGLE


print("Downloading dataset from Kaggle...")

DATASET_PATH = kagglehub.dataset_download(
    "rajkumardubey10/amazon-book-dataset30000-books-with-30-category"
)

print("Dataset downloaded at:", DATASET_PATH)



def get_books():

    files = os.listdir(DATASET_PATH)

    # Find CSV file
    csv_file = [f for f in files if f.endswith(".csv")][0]

    df = pd.read_csv(os.path.join(DATASET_PATH, csv_file))

    books = []

    for _, row in df.iterrows():

        books.append({
            "title": str(row.get("Book_Name", "Unknown")),
            "author": str(row.get("Book_Author", "Unknown")),
            "price": str(row.get("Book_Price", "Unknown")),
            "rating": str(row.get("Book_Rating", "Unknown")),
            "release_date": str(row.get("Book_release_date", "Unknown"))
        })

    return books


# LOAD DATASET INTO MEMORY


BOOKS = get_books()

print(f"Dataset loaded successfully: {len(BOOKS)} books available")


client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

MODEL_ID = "gemini-2.5-flash-lite"


# BOOK RECOMMENDATION FUNCTION


def recommend_books(user_prompt):

    books = BOOKS[:500]   # limit context to avoid token overload

    book_context = "\n".join([
        f"Title: {b['title']} | Author: {b['author']} | Rating: {b['rating']} | Price: {b['price']}"
        for b in books
    ])

    config = types.GenerateContentConfig(

        system_instruction="""
You are a professional library assistant.

Recommend 3 books from the provided dataset
based on the user's request.

Response format:
Title
Author
Reason for recommendation
""",

        temperature=0.7
    )

    full_prompt = f"""
User Request:
{user_prompt}

Book Database:
{book_context}
"""

    try:

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )

        print("\n📚 Recommended Books:\n")
        print(response.text)

    except Exception as e:

        print("Error:", e)

print("\n📚 Book Recommendation Chatbot")
print("Type 'exit' to quit\n")

while True:

    user_input = input("What kind of book are you looking for? ")

    if user_input.lower() in ["exit", "quit"]:
        print("Goodbye!")
        break

    if not user_input.strip():
        continue

    recommend_books(user_input)
