from fastapi import FastAPI
from app.core.database import supabase

app = FastAPI()

@app.post("/add-test-book")
def add_book():
    data = {
        "title": "Atomic Habits",
        "author": "James Clear",
        "genre": "Self Help",
        "mood": "motivational"
    }
    result = supabase.table("books").insert(data).execute()
    return result.data


@app.get("/")
def test_db():
    try:
        response = supabase.table("books").select("*").limit(1).execute()
        return {
            "status": "success",
            "message": "Database connected successfully",
            "data": response.data
        }
    except Exception as e:
        return {
            "status": "error",
            "message": str(e)
        }