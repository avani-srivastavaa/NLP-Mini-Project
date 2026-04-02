import os
from google import genai
from google.genai import types
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()


def generate_summary(book_name, session=None):
    """
    Generates a concise, academic summary of a book using Google Gemini AI.

    Args:
        book_name (str): The title of the book to summarize.
        session (dict, optional): The user session containing department, year,
                                  and chat_history for contextual summaries.

    Returns:
        str: A formatted book summary or an error message.
    """
    if not book_name or book_name.strip() == "":
        return "Please specify a book name for the summary."

    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return "Error: Gemini API key not configured."

    # Build context from session if available
    department = session.get("department", "Engineering") if session else "Engineering"
    year = session.get("year", "") if session else ""

    system_instruction = f"""You are a knowledgeable library assistant for an engineering college.
The user is from the {department} department{f', year {year}' if year else ''}.

Your task is to provide a helpful summary of the requested book.

SUMMARY FORMAT:
1. **Overview**: A 2-3 sentence description of what the book is about.
2. **Key Topics Covered**: A bullet list of the major topics/chapters (5-8 items).
3. **Who Should Read This**: One sentence on the target audience and prerequisites.
4. **Why It Matters**: One sentence on why this book is important for {department} students.

RULES:
- Keep the summary concise (under 200 words).
- Focus on practical value for engineering students.
- If you are not confident about the book, say so honestly rather than making things up.
- Do NOT include purchase links or pricing information."""

    try:
        client = genai.Client(api_key=api_key)
        MODEL_ID = "models/gemini-2.5-flash"

        config = types.GenerateContentConfig(
            system_instruction=system_instruction,
            temperature=0.4
        )

        prompt = f"Provide a summary of the book: \"{book_name}\""

        response = client.models.generate_content(
            model=MODEL_ID,
            contents=prompt,
            config=config
        )

        summary_text = response.text.strip()

        if not summary_text:
            return f"Sorry, I couldn't generate a summary for '{book_name}'."

        return f"📖 Summary of '{book_name}':\n\n{summary_text}"

    except Exception as e:
        return f"Error generating summary: {str(e)}"
