from sqlalchemy.orm import Session
from app.models.models import Book, Review
from google import genai
from google.genai import types
from dotenv import load_dotenv
import os

load_dotenv()

def generate_review(query_text, author="", db: Session = None, session=None):
    """
    Fetches book reviews from MySQL and summarizes them using Gemini.
    """
    if not query_text or query_text.strip() == "":
        return "Please specify a book title for the review."

    if db is None:
        return "Database session not provided."

    # 1. Find the book
    book = db.query(Book).filter(
        (Book.book_id == query_text) | 
        (Book.title.ilike(f"%{query_text}%"))
    ).first()

    if not book:
        return f"Sorry, I couldn't find any records for '{query_text}'."

    # 2. Fetch reviews from the 'review' table
    db_reviews = db.query(Review).filter(Review.book_id == book.book_id).all()

    if not db_reviews:
        return f"There are currently no student reviews for **{book.title}**."

    # 3. Combine reviews for AI processing
    combined_reviews = "\n\n".join([f"Student Review: {r.review}" for r in db_reviews])

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return f"⭐ **Student Reviews for '{book.title}':**\n\n{combined_reviews}\n\n*(Gemini API key not configured for AI summary)*"

    system_instruction = """You are a helpful library assistant for an engineering college.
Your task is to summarize student reviews of a textbook.

Given multiple raw student reviews, provide a single, cohesive, and professional review summary formatted in Markdown.
Highlight the pros, cons, and the consensus on who would benefit most from the book. Keep it under 150 words."""

    try:
        client = genai.Client(api_key=api_key)
        MODEL_ID = "models/gemini-2.5-flash"

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.4
        )

        prompt = f"Please summarize these student reviews for '{book.title}':\n\n{combined_reviews}"

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config
        )

        summary_text = response.text.strip()

        if not summary_text:
            return f"⭐ **Student Reviews for {book.title}:**\n\n{combined_reviews}"

        return f"⭐ **Student Review Summary: {book.title}**\n\n{summary_text}"

    except Exception as e:
        return f"Error generating AI review summary: {str(e)}\n\n**Raw Reviews:**\n\n{combined_reviews}"


