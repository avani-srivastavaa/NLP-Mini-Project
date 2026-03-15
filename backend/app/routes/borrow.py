from fastapi import APIRouter, HTTPException
from firebase_admin import auth
from pydantic import BaseModel
from datetime import datetime, timedelta
from app.core.firebase import test_db
from google.cloud.firestore import Query

router = APIRouter(prefix="/borrow", tags=["Borrow"])

class BorrowRequest(BaseModel):
    id_token: str
    book_id: str


class ReturnRequest(BaseModel):
    id_token: str
    book_id: str


class TokenRequest(BaseModel):
    id_token: str

@router.post("/")
def borrow_book(data: BorrowRequest):

    try:
        decoded = auth.verify_id_token(data.id_token)
        uid = decoded.get("uid")
        db = test_db()
        book_ref = db.collection("books").document(data.book_id)
        book = book_ref.get()

        if not book.exists:
            raise HTTPException(status_code=404, detail="Book not found")
        borrow_ref = db.collection("borrow_books").document(data.book_id)
        borrow_doc = borrow_ref.get()

        if borrow_doc.exists:
            raise HTTPException(status_code=400, detail="Book already borrowed")
        user_borrows = db.collection("borrow_books") \
            .where("user_id", "==", uid).stream()

        count = sum(1 for _ in user_borrows)

        if count >= 3:
            raise HTTPException(
                status_code=400,
                detail="Maximum 3 books allowed"
            )

        now = datetime.utcnow()
        due_date = now + timedelta(days=14)
        borrow_ref.set({
            "user_id": uid,
            "borrowed_at": now,
            "due_date": due_date
        })
        db.collection("borrow_books_log").add({
            "book_id": data.book_id,
            "user_id": uid,
            "borrowed_at": now,
            "returned_at": None,
            "status": "borrowed"
        })
        return {
            "message": "Book borrowed successfully",
            "due_date": due_date
        }
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))
    
@router.post("/return")
def return_book(data: ReturnRequest):
    try:
        decoded = auth.verify_id_token(data.id_token)
        uid = decoded.get("uid")
        db = test_db()
        borrow_ref = db.collection("borrow_books").document(data.book_id)
        borrow_doc = borrow_ref.get()
        if not borrow_doc.exists:
            raise HTTPException(status_code=404, detail="Book not borrowed")

        borrow_data = borrow_doc.to_dict()
        if borrow_data["user_id"] != uid:
            raise HTTPException(
                status_code=403,
                detail="You did not borrow this book"
            )
        borrow_ref.delete()
        logs = db.collection("borrow_books_log") \
            .where("book_id", "==", data.book_id) \
            .where("user_id", "==", uid) \
            .where("status", "==", "borrowed") \
            .stream()

        for log in logs:
            db.collection("borrow_books_log").document(log.id).update({
                "status": "returned",
                "returned_at": datetime.utcnow()
            })
        return {"message": "Book returned successfully"}
    except Exception as e:
        raise HTTPException(status_code=401, detail=str(e))

@router.post("/my-books")
def my_books(token: TokenRequest):
    decoded = auth.verify_id_token(token.id_token)
    uid = decoded.get("uid")
    db = test_db()
    records = db.collection("borrow_books_log") \
        .where("user_id", "==", uid) \
        .order_by("borrowed_at", direction=Query.DESCENDING) \
        .stream()
    result = []
    for r in records:
        data = r.to_dict()
        data["book_id"] = r.id
        result.append(data)
    return result

'''
@router.post("/current-borrowed")
def all_borrowed_books(token: TokenRequest):
    decoded = auth.verify_id_token(token.id_token)
    uid = decoded.get("uid")
    db = test_db()
    user = db.collection("users").document(uid).get().to_dict()
    if user["role"] != "librarian":
        raise HTTPException(
            status_code=403,
            detail="Only librarian allowed"
        )
    records = db.collection("borrow_books") \
        .order_by("borrowed_at", direction=Query.ASCENDING) \
        .stream()
    result = []
    for r in records:
        data = r.to_dict()
        data["book_id"] = r.id
        result.append(data)
    return result
'''

@router.post("/history")
def all_borrowed_books(token: TokenRequest):
    decoded = auth.verify_id_token(token.id_token)
    uid = decoded.get("uid")
    db = test_db()
    user = db.collection("users").document(uid).get().to_dict()
    if user["role"] != "librarian":
        raise HTTPException(
            status_code=403,
            detail="Only librarian allowed"
        )
    records = db.collection("borrow_books_log") \
        .order_by("borrowed_at", direction=Query.DESCENDING) \
        .stream()
    result = []
    for r in records:
        data = r.to_dict()
        data["log_id"] = r.id
        result.append(data)

    return result