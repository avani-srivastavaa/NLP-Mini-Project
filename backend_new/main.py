from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func, desc
from datetime import datetime
import pandas as pd
from fastapi.middleware.cors import CORSMiddleware

import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password
from ai_embeddings import get_embedding, cosine_similarity

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# =================== CORS ===================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# =========================
# LOAD CSV
# =========================
books_csv = pd.read_csv("books-final2.csv")
students_csv = pd.read_csv("students-final.csv")

# 🔥 CLEAN CSV (IMPORTANT FIX)
books_csv["Book_ID"] = books_csv["Book_ID"].astype(str).str.strip()


# =========================
# HOME
# =========================
@app.get("/")
def home():
    return {"message": "Library backend running"}


# =========================
# CSV APIs
# =========================
@app.get("/csv-books")
def get_csv_books():
    return books_csv.to_dict(orient="records")


@app.get("/csv-students")
def get_csv_students():
    return students_csv.to_dict(orient="records")


# =========================
# STUDENT REGISTER
# =========================
@app.post("/student-register")
def student_register(student: schemas.StudentCreate, db: Session = Depends(get_db)):

    existing = db.query(models.Student).filter(
        models.Student.admission_no == student.admission_no
    ).first()

    if existing:
        raise HTTPException(status_code=400, detail="Student exists")

    new_student = models.Student(
        name=student.name,
        admission_no=student.admission_no,
        department=student.department,
        password=hash_password(student.password)
    )

    db.add(new_student)
    db.commit()

    return {"message": "Registered"}


# =========================
# STUDENT LOGIN
# =========================
@app.post("/student-login")
def student_login(data: schemas.StudentLogin, db: Session = Depends(get_db)):

    student = db.query(models.Student).filter(
        models.Student.admission_no == data.admission_no
    ).first()

    if not student or not verify_password(data.password, student.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    return {"message": "Login successful"}


# =========================
# BORROW BOOK (FIXED)
# =========================
@app.put("/borrow/{book_id}")
def borrow(book_id: str, admission_no: str, db: Session = Depends(get_db)):
    try:
        student_db = db.query(models.Student).filter(
            models.Student.admission_no == admission_no
        ).first()

        if not student_db:
            raise HTTPException(status_code=404, detail="Student not found")

        # 🔥 SAFE MATCH
        book_row = books_csv[books_csv["Book_ID"] == book_id.strip()]

        if book_row.empty:
            raise HTTPException(status_code=404, detail="Book not found")

        book_title = book_row.iloc[0]["Title"]

        # 🔥 SAFE INT CONVERSION
        total = int(str(book_row.iloc[0]["Total_Copies"]).strip())

        borrowed_count = db.query(models.BorrowRecord).filter(
            models.BorrowRecord.book_id == book_id,
            models.BorrowRecord.return_date == None
        ).count()

        available = total - borrowed_count

        if available <= 0:
            raise HTTPException(status_code=400, detail="No copies available")

        db.add(models.BorrowRecord(
            book_id=book_id,
            book_title=book_title,
            student_id=student_db.id
        ))

        db.commit()

        return {
            "message": f"{student_db.name} borrowed {book_title}",
            "remaining": available - 1
        }

    except Exception as e:
        return {"error": str(e)}


# =========================
# RETURN BOOK
# =========================
@app.put("/return/{book_id}")
def return_book(book_id: str, admission_no: str, db: Session = Depends(get_db)):

    student_db = db.query(models.Student).filter(
        models.Student.admission_no == admission_no
    ).first()

    if not student_db:
        raise HTTPException(status_code=404, detail="Student not found")

    record = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.book_id == book_id,
        models.BorrowRecord.student_id == student_db.id,
        models.BorrowRecord.return_date == None
    ).first()

    if not record:
        raise HTTPException(status_code=400, detail="No active borrow record")

    record.return_date = datetime.utcnow()

    db.commit()

    return {"message": f"{student_db.name} returned the book"}


# =========================
# BORROW HISTORY
# =========================
@app.get("/borrow-history")
def borrow_history(admission_no: str, db: Session = Depends(get_db)):

    student_db = db.query(models.Student).filter(
        models.Student.admission_no == admission_no
    ).first()

    return db.query(models.BorrowRecord).filter(
        models.BorrowRecord.student_id == student_db.id
    ).all()


# =========================
# SEARCH
# =========================
@app.get("/search")
def search(query: str):

    results = []

    for _, row in books_csv.iterrows():

        text = str(row["Title"]) + " " + str(row["Author"])
        score = cosine_similarity(get_embedding(query), get_embedding(text))

        results.append({
            "Book_ID": row["Book_ID"],
            "Title": row["Title"],
            "score": score
        })

    return sorted(results, key=lambda x: x["score"], reverse=True)[:5]

@app.get("/search")
def search(query: str, db: Session = Depends(get_db)):
    results = []
    for _, row in books_csv.iterrows():
        text = str(row["Title"]) + " " + str(row["Author"])
        score = cosine_similarity(get_embedding(query), get_embedding(text))
        results.append({
            "Book_ID": row["Book_ID"],
            "Title": row["Title"],
            "score": score
        })
    
    top_five = sorted(results, key=lambda x: x["score"], reverse=True)[:5]
    
    # LOG THE SEARCH (New logic)
    if top_five:
        new_log = models.SearchLog(query=query, top_result_title=top_five[0]["Title"])
        db.add(new_log)
        db.commit()

    return top_five

# =========================
# ANALYTICS API (ENHANCED)
# =========================
@app.get("/analytics")
def get_analytics(db: Session = Depends(get_db)):
    from datetime import datetime, timedelta

    # 1. Active Users (Total registered students)
    active_users = db.query(models.Student).count()

    # 2. Total Books Available
    total_books = len(books_csv)

    # 3. Currently Borrowed Books
    currently_borrowed = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.return_date == None
    ).count()

    # 4. Total Borrow Transactions (All time)
    total_borrows = db.query(models.BorrowRecord).count()

    # 5. Overdue Books (More than 14 days)
    overdue_books = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.return_date == None,
        models.BorrowRecord.borrow_date < datetime.utcnow() - timedelta(days=14)
    ).count()

    # 6. Most Borrowed Books (Top 10)
    most_borrowed = db.query(
        models.BorrowRecord.book_title,
        func.count(models.BorrowRecord.id).label('total')
    ).group_by(models.BorrowRecord.book_title).order_by(desc('total')).limit(10).all()

    # 7. Most Searched Books (Top 10)
    most_searched = db.query(
        models.SearchLog.top_result_title,
        func.count(models.SearchLog.id).label('total')
    ).group_by(models.SearchLog.top_result_title).order_by(desc('total')).limit(10).all()

    # 8. Popular Subjects (Department-wise borrows)
    all_borrows = db.query(models.BorrowRecord.book_id).all()
    borrowed_ids = [b[0] for b in all_borrows]
    dept_counts = {}
    if borrowed_ids:
        borrowed_books = books_csv[books_csv["Book_ID"].isin(borrowed_ids)]
        dept_counts = borrowed_books["Department"].value_counts().to_dict()

    # 9. Borrow Timeline (Last 30 days with proper date formatting)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    timeline_data = db.query(
        func.date(models.BorrowRecord.borrow_date).label('date'),
        func.count(models.BorrowRecord.id).label('borrows')
    ).filter(models.BorrowRecord.borrow_date >= thirty_days_ago).group_by(
        func.date(models.BorrowRecord.borrow_date)
    ).order_by(func.date(models.BorrowRecord.borrow_date)).all()

    # Fill missing dates with 0 borrows
    timeline = []
    current_date = thirty_days_ago.date()
    end_date = datetime.utcnow().date()

    timeline_dict = {str(t[0]): t[1] for t in timeline_data}

    while current_date <= end_date:
        date_str = current_date.strftime('%Y-%m-%d')
        borrows = timeline_dict.get(date_str, 0)
        timeline.append({"date": date_str, "borrows": borrows})
        current_date += timedelta(days=1)

    # Keep only last 7 days for the chart
    timeline = timeline[-7:] if len(timeline) > 7 else timeline

    # 10. Return Rate (Books returned on time vs total)
    returned_books = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.return_date != None
    ).count()

    on_time_returns = db.query(models.BorrowRecord).filter(
        models.BorrowRecord.return_date != None,
        models.BorrowRecord.return_date <= models.BorrowRecord.borrow_date + timedelta(days=14)
    ).count()

    return_rate = (on_time_returns / returned_books * 100) if returned_books > 0 else 0

    # 11. Department-wise Student Distribution
    dept_students = db.query(
        models.Student.department,
        func.count(models.Student.id).label('count')
    ).group_by(models.Student.department).all()

    # 12. Recent Activity (Last 10 borrows)
    recent_activity = db.query(models.BorrowRecord).order_by(
        desc(models.BorrowRecord.borrow_date)
    ).limit(10).all()

    return {
        "active_users": active_users,
        "total_books": total_books,
        "currently_borrowed": currently_borrowed,
        "total_borrows": total_borrows,
        "overdue_books": overdue_books,
        "return_rate": round(return_rate, 1),
        "most_borrowed": [{"name": b[0], "value": b[1]} for b in most_borrowed],
        "most_searched": [{"name": s[0], "value": s[1]} for s in most_searched],
        "popular_subjects": [{"name": k, "value": v} for k, v in dept_counts.items()],
        "student_departments": [{"name": d[0], "value": d[1]} for d in dept_students],
        "timeline": timeline,
        "recent_activity": [
            {
                "book_title": r.book_title,
                "student_id": r.student_id,
                "borrow_date": r.borrow_date.strftime('%Y-%m-%d'),
                "return_date": r.return_date.strftime('%Y-%m-%d') if r.return_date else None,
                "status": "Returned" if r.return_date else "Borrowed"
            } for r in recent_activity
        ]
    }