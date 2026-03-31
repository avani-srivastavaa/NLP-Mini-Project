from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import pandas as pd

import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password
from ai_embeddings import get_embedding, cosine_similarity

models.Base.metadata.create_all(bind=engine)

app = FastAPI()

# =========================
# LOAD CSV
# =========================
books_csv = pd.read_csv("/Users/sarthsanjaypatil/finallibrary_backend/books-final2.csv")
students_csv = pd.read_csv("/Users/sarthsanjaypatil/finallibrary_backend/students-final.csv")

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