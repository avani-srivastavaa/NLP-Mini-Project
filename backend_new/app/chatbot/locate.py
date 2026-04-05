from sqlalchemy.orm import Session
from app.models.models import Book

def handle_locate(book_query, db: Session, session=None):
    """
    Locates a book's physical position (Shelf, Rack, Column) using MySQL metadata.
    """
    if not book_query or book_query.strip() == "":
        return "Which book would you like to locate?"

    # Find the book by ID or Title
    book = db.query(Book).filter(
        (Book.book_id == book_query) | 
        (Book.title.ilike(f"%{book_query}%"))
    ).first()

    if not book:
        return f"I couldn't find any information on where **{book_query}** is located. Are you sure it's in our catalog?"

    # Format the location response
    location_msg = f"📍 **Location found for '{book.title}':**\n\n"
    location_msg += f"- **Department Section**: {book.column_dept or 'General'}\n"
    location_msg += f"- **Rack Number**: {book.rack_no or 'Not Assigned'}\n"
    location_msg += f"- **Shelf Number**: {book.shelf_no or 'Not Assigned'}\n\n"
    
    if book.available_copies and book.available_copies > 0:
        location_msg += f"✅ Currently available: **{book.available_copies}** copies."
    else:
        location_msg += "⚠️ Note: This book is currently out of stock, but you can still find its dedicated spot on the shelf."

    return location_msg

