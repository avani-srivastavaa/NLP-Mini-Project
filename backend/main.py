from fastapi import FastAPI, Depends, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
import models
import schemas
from database import engine, get_db
from auth import hash_password, verify_password, create_access_token, verify_token
from ai_embeddings import get_embedding, cosine_similarity, serialize_embedding, deserialize_embedding

models.Base.metadata.create_all(bind=engine)

app = FastAPI()


@app.get("/")
def home():
    return {"message": "Library backend running"}


# REGISTER
@app.post("/register")
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):

    existing = db.query(models.User).filter(models.User.username == user.username).first()

    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")

    new_user = models.User(
        username=user.username,
        password=hash_password(user.password)
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {"message": "User registered"}


# LOGIN
@app.post("/login")
def login(user: schemas.UserLogin, db: Session = Depends(get_db)):

    db_user = db.query(models.User).filter(models.User.username == user.username).first()

    if not db_user:
        raise HTTPException(status_code=400, detail="Invalid username")

    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=400, detail="Invalid password")

    token = create_access_token({"sub": db_user.username})

    return {"access_token": token}


# ADD BOOK (JWT Protected)
@app.post("/books")
def add_book(
    book: schemas.BookCreate,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    text = book.title + " " + book.author

    embedding = get_embedding(text)

    new_book = models.Book(
        title=book.title,
        author=book.author,
        isbn=book.isbn,
        embedding=serialize_embedding(embedding)
    )

    db.add(new_book)
    db.commit()

    return {"message": "Book added"}


# VIEW BOOKS (JWT Protected)
@app.get("/books")
def get_books(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    return db.query(models.Book).all()


# BORROW BOOK (JWT Protected)
@app.put("/borrow/{book_id}")
def borrow_book(
    book_id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.status == "borrowed":
        return {"message": "Book already borrowed"}

    book.status = "borrowed"

    record = models.BorrowRecord(
        book_id=book.id,
        book_title=book.title
    )

    db.add(record)
    db.commit()

    return {"message": "Book borrowed successfully"}


# RETURN BOOK (JWT Protected)
@app.put("/return/{book_id}")
def return_book(
    book_id: int,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    book = db.query(models.Book).filter(models.Book.id == book_id).first()

    if not book:
        raise HTTPException(status_code=404, detail="Book not found")

    if book.status != "borrowed":
        return {"message": "This book was not borrowed"}

    record = db.query(models.BorrowRecord)\
        .filter(models.BorrowRecord.book_id == book_id)\
        .filter(models.BorrowRecord.return_date == None)\
        .first()

    if not record:
        return {"message": "No active borrow record found"}

    record.return_date = datetime.utcnow()
    book.status = "available"

    db.commit()

    return {"message": "Book returned successfully"}


# BORROW HISTORY (JWT Protected)
@app.get("/borrow-history")
def borrow_history(
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):
    return db.query(models.BorrowRecord).all()


# AI SEARCH (JWT Protected)
@app.get("/search")
def search_books(
    query: str,
    user=Depends(verify_token),
    db: Session = Depends(get_db)
):

    query_embedding = get_embedding(query)

    books = db.query(models.Book).all()

    results = []

    for book in books:

        book_embedding = deserialize_embedding(book.embedding)

        score = cosine_similarity(query_embedding, book_embedding)

        results.append({
            "title": book.title,
            "author": book.author,
            "score": score
        })

    results.sort(key=lambda x: x["score"], reverse=True)

    return results[:5]