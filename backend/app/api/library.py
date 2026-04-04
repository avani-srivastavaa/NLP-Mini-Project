from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from backend.app.models.models import User, Book, BorrowedBook
from backend.app.core.database import get_db

router = APIRouter(tags=["Library"])

@router.get("/user-borrow-history/{admission_number}")
def get_user_borrow_history(admission_number: str, db: Session = Depends(get_db)):
    """
    Fetches the complete borrowing history for a student from MySQL.
    """
    user = db.query(User).filter(User.admission_number == admission_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    history = db.query(BorrowedBook).filter(BorrowedBook.user_id == user.user_id).all()
    
    if not history:
        return {"message": "No borrowing history found", "history": []}

    return history

@router.get("/user-active-borrows/{admission_number}")
def get_user_active_borrows(admission_number: str, db: Session = Depends(get_db)):
    """
    Fetches currently issued books for the dashboard.
    """
    user = db.query(User).filter(User.admission_number == admission_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    active = db.query(BorrowedBook).filter(
        BorrowedBook.user_id == user.user_id,
        BorrowedBook.status == "issued"
    ).all()

    if not active:
        return {"message": "No books borrowed yet", "active_borrows": []}

    # Enrich with book titles for the dashboard cards
    results = []
    for record in active:
        book = db.query(Book).filter(Book.book_id == record.Book_ID).first()
        results.append({
            "issue_id": record.issue_id,
            "book_id": record.Book_ID,
            "title": book.title if book else "Unknown",
            "author": book.author if book else "Unknown",
            "issue_date": record.b_date,
            "status": record.status
        })

    return results

@router.post("/borrow")
def borrow_book(admission_number: str, book_id: str, db: Session = Depends(get_db)):
    """
    API endpoint for borrowing a book (Syncs with the chatbot logic).
    """
    user = db.query(User).filter(User.admission_number == admission_number).first()
    book = db.query(Book).filter(Book.book_id == book_id).first()

    if not user or not book:
        raise HTTPException(status_code=404, detail="User or Book not found")

    if book.available_copies <= 0:
        raise HTTPException(status_code=400, detail="Book out of stock")

    # Check if already issued
    existing = db.query(BorrowedBook).filter(
        BorrowedBook.user_id == user.user_id,
        BorrowedBook.Book_ID == book_id,
        BorrowedBook.status == "issued"
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Book already issued to this user")

    # Transaction
    book.available_copies -= 1
    new_record = BorrowedBook(
        user_id=user.user_id,
        Book_ID=book_id,
        b_date=datetime.now().date(),
        b_time=datetime.now().time(),
        status="issued"
    )
    db.add(new_record)
    db.commit()
    return {"message": "Book issued successfully", "book": book.title}

