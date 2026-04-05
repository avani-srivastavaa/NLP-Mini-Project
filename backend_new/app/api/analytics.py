from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
from app.models.models import User, BorrowedBook, Book
from app.core.database import get_db

router = APIRouter(tags=["Analytics"])

@router.get("/debug")
def debug(db: Session = Depends(get_db)):
    books_count = db.query(Book).count()
    first_book = db.query(Book).first()
    return {
        "books_count": books_count, 
        "first_book": {
            "title": first_book.title,
            "author": first_book.author
        } if first_book else "No books"
    }

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    try:
        active_users = db.query(User).count()
        total_books = db.query(Book).count()
        currently_borrowed = db.query(BorrowedBook).filter(BorrowedBook.status == "issued").count()
        total_borrows = db.query(BorrowedBook).count()

        # Assuming 'b_date' is the issue date
        fourteen_days_ago = datetime.now().date() - timedelta(days=14)
        overdue_books = db.query(BorrowedBook).filter(
            BorrowedBook.status == "issued",
            BorrowedBook.b_date < fourteen_days_ago
        ).count()

        returned_books = db.query(BorrowedBook).filter(BorrowedBook.status == "returned").count()
        return_rate = round((returned_books / total_borrows * 100), 1) if total_borrows > 0 else 0

        # Note: BorrowedBook doesn't have 'book_title' in schema, so we join with Book if needed, 
        # or use what's available. The schema I mapped has Book_ID.
        most_borrowed = db.query(
            BorrowedBook.Book_ID,
            func.count(BorrowedBook.issue_id).label('total')
        ).group_by(BorrowedBook.Book_ID).order_by(desc('total')).limit(10).all()

        return {
            'active_users': active_users,
            'total_books': total_books,
            'currently_borrowed': currently_borrowed,
            'total_borrows': total_borrows,
            'overdue_books': overdue_books,
            'return_rate': return_rate,
            'most_borrowed': [{'id': m[0], 'value': m[1]} for m in most_borrowed],
        }
    except Exception as e:
        return {'error': str(e)}

