from sqlalchemy.orm import Session
from backend.app.models.models import Book
import re

def find_book(db: Session, query: str):
    """
    Robustly finds a book in the database using a variety of matching strategies.
    Designed to handle natural language queries like "Machine Learning by Tom Mitchell".
    """
    if not query:
        return None

    query = query.strip()
    
    # 1. Exact Book ID Match (e.g. B-1021)
    book = db.query(Book).filter(Book.book_id == query).first()
    if book:
        return book

    # 2. Numeric shorthand for ID (e.g. "1021" -> "B-1021")
    # Clean "book id" or "id" prefix
    clean_query = re.sub(r'^(book\s+id|id)\s+', '', query, flags=re.IGNORECASE).strip()
    if clean_query.isdigit():
        book = db.query(Book).filter(Book.book_id == f"B-{clean_query}").first()
        if book:
            return book

    # 3. Substring match (Query is inside DB Title)
    # e.g. Query "Machine Learning" matching "Introduction to Machine Learning"
    book = db.query(Book).filter(Book.title.ilike(f"%{clean_query}%")).first()
    if book:
        return book

    # 4. Containment Matching (DB Title is inside User Query)
    # e.g. DB Title "Machine Learning" found inside User Query "Machine Learning by Tom Mitchell"
    # This is the "Focus Here" requirement.
    
    # We fetch all books from the database for the search... 
    # (In a huge DB we'd use Full Text Search, but for this library size, fetching titles is fast)
    all_books = db.query(Book).with_entities(Book.book_id, Book.title).all()
    
    best_match = None
    max_length = 0
    
    query_lower = clean_query.lower()
    
    for b_id, b_title in all_books:
        title_lower = b_title.lower()
        # If the DB title is contained within the user's query
        if title_lower in query_lower:
            # We prefer the longest title match to avoid matching "AI" in "Artificial Intelligence"
            if len(b_title) > max_length:
                max_length = len(b_title)
                best_match = b_id

    if best_match:
        return db.query(Book).filter(Book.book_id == best_match).first()

    # 5. Keyword-based fallback (if query is long)
    if len(query_lower.split()) > 1:
        # Take the first two substantive words
        words = [w for w in query_lower.split() if w not in ['the', 'a', 'an', 'by', 'of', 'for', 'to', 'in', 'and']]
        if len(words) >= 1:
            first_keyword = words[0]
            # Try to match a book starting with the first keyword
            book = db.query(Book).filter(Book.title.ilike(f"{first_keyword}%")).first()
            if book:
                return book

    return None
