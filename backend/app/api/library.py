from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import pandas as pd
from backend.app.models.models import Student, BorrowRecord, SearchLog
from backend.app.core.database import get_db

router = APIRouter(tags=["Library"])

# Load CSV
books_csv = pd.read_csv("backend/data/books-final2.csv")
books_csv["Book_ID"] = books_csv["Book_ID"].astype(str).str.strip()


@router.get("/csv-books")
def get_csv_books():
    return books_csv.to_dict(orient="records")

@router.put("/borrow/{book_id}")
def borrow(book_id: str, admission_no: str, db: Session = Depends(get_db)):
    try:
        student_db = db.query(Student).filter(Student.admission_no == admission_no).first()
        if not student_db:
            raise HTTPException(status_code=404, detail="Student not found")

        book_row = books_csv[books_csv["Book_ID"] == book_id.strip()]
        if book_row.empty:
            raise HTTPException(status_code=404, detail="Book not found")

        book_title = book_row.iloc[0]["Title"]
        total = int(str(book_row.iloc[0]["Total_Copies"]).strip())

        borrowed_count = db.query(BorrowRecord).filter(
            BorrowRecord.book_id == book_id,
            BorrowRecord.return_date == None
        ).count()

        available = total - borrowed_count
        if available <= 0:
            raise HTTPException(status_code=400, detail="No copies available")

        db.add(BorrowRecord(book_id=book_id, book_title=book_title, student_id=student_db.id))
        db.commit()
        return {"message": f"{student_db.name} borrowed {book_title}", "remaining": available - 1}
    except Exception as e:
        return {"error": str(e)}

@router.put("/return/{book_id}")
def return_book(book_id: str, admission_no: str, db: Session = Depends(get_db)):
    student_db = db.query(Student).filter(Student.admission_no == admission_no).first()
    if not student_db:
        raise HTTPException(status_code=404, detail="Student not found")

    record = db.query(BorrowRecord).filter(
        BorrowRecord.book_id == book_id,
        BorrowRecord.student_id == student_db.id,
        BorrowRecord.return_date == None
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="No active borrow record")

    record.return_date = datetime.utcnow()
    db.commit()
    return {"message": f"{student_db.name} returned the book"}

@router.get("/borrow-history")
def borrow_history(admission_no: str, db: Session = Depends(get_db)):
    student_db = db.query(Student).filter(Student.admission_no == admission_no).first()
    if not student_db:
        return []
    return db.query(BorrowRecord).filter(BorrowRecord.student_id == student_db.id).all()
