import os
import pandas as pd
from google import genai
from google.genai import types
from dotenv import load_dotenv

load_dotenv()

DATASETS_DIR = os.path.join(os.path.dirname(__file__), "..", "datasets", "reviews")

def generate_review(title, author="", session=None):
    if not title or title.strip() == "":
        return "Please specify a book title for the review."

    dept = session.get("department", "CS").lower() if session else "cs"
    csv_file = f"{dept}_reviews.csv"
    csv_path = os.path.join(DATASETS_DIR, csv_file)

    if not os.path.exists(csv_path):
         return f"No review data found for department: {dept.upper()}"

    try:
        df = pd.read_csv(csv_path)
    except Exception as e:
        return f"Error reading review data: {str(e)}"

    # Case-insensitive match on title, and match author if provided
    matched_book = None
    for _, row in df.iterrows():
        book_name_csv = str(row.get("Book Name", "")).strip().lower()
        author_csv = str(row.get("Author", "")).strip().lower()

        if title.lower() in book_name_csv or book_name_csv in title.lower():
            if author:
                if author.lower() in author_csv or author_csv in author.lower():
                    matched_book = row
                    break
            else:
                matched_book = row
                break
    
    if matched_book is None:
        return f"Sorry, I couldn't find any reviews for '{title}'{f' by {author}' if author else ''} in our records."

    review1 = str(matched_book.get("Review1", ""))
    review2 = str(matched_book.get("Review2", ""))

    combined_reviews = f"Review 1: {review1}\n\nReview 2: {review2}"

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return f"**Raw Reviews for '{matched_book['Book Name']}':**\n\n{combined_reviews}\n\n*(Gemini API key not configured for summary)*"

    system_instruction = """You are a helpful library assistant for an engineering college.
Your task is to summarize student reviews of a textbook.

Given two raw reviews, provide a single, cohesive, and professional review summary formatted in Markdown.
Highlight the pros, cons, and who would benefit most from the book. Keep it under 150 words."""

    try:
        client = genai.Client(api_key=api_key)
        MODEL_ID = "models/gemini-2.5-flash"

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.4
        )

        prompt = f"Please summarize these reviews for the book '{matched_book['Book Name']}':\n\n{combined_reviews}"

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config
        )

        summary_text = response.text.strip()

        if not summary_text:
            return f"**Raw Reviews:**\n\n{combined_reviews}"

        return f"⭐ **Student Review Summary: {matched_book['Book Name']}**\n\n{summary_text}"

    except Exception as e:
        return f"Error generating AI review summary: {str(e)}\n\n**Raw Reviews:**\n\n{combined_reviews}"
