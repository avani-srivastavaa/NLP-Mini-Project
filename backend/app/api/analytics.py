from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime, timedelta
import pandas as pd
from backend.app.models.models import Student, BorrowRecord, SearchLog
from backend.app.core.database import get_db

router = APIRouter(tags=["Analytics"])

books_csv = pd.read_csv("backend/data/books-final2.csv")

@router.get("/debug")
def debug():
    return {"books_count": len(books_csv), "first_book": books_csv.iloc[0].to_dict() if len(books_csv) > 0 else "No books"}

@router.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    try:
        active_users = db.query(Student).count()
        total_books = len(books_csv)
        currently_borrowed = db.query(BorrowRecord).filter(BorrowRecord.return_date == None).count()
        total_borrows = db.query(BorrowRecord).count()

        fourteen_days_ago = datetime.utcnow() - timedelta(days=14)
        overdue_books = db.query(BorrowRecord).filter(
            BorrowRecord.return_date == None,
            BorrowRecord.borrow_date < fourteen_days_ago
        ).count()

        returned_books = db.query(BorrowRecord).filter(BorrowRecord.return_date != None).count()
        return_rate = round((returned_books / total_borrows * 100), 1) if total_borrows > 0 else 0

        most_borrowed = db.query(
            BorrowRecord.book_title,
            func.count(BorrowRecord.id).label('total')
        ).group_by(BorrowRecord.book_title).order_by(desc('total')).limit(10).all()

        most_searched = db.query(
            SearchLog.top_result_title,
            func.count(SearchLog.id).label('total')
        ).group_by(SearchLog.top_result_title).order_by(desc('total')).limit(10).all()

        return {
            'active_users': active_users,
            'total_books': total_books,
            'currently_borrowed': currently_borrowed,
            'total_borrows': total_borrows,
            'overdue_books': overdue_books,
            'return_rate': return_rate,
            'most_borrowed': [{'name': m[0], 'value': m[1]} for m in most_borrowed],
            'most_searched': [{'name': s[0], 'value': s[1]} for s in most_searched]
        }
    except Exception as e:
        return {'error': str(e)}
