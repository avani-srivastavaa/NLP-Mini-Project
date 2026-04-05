
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from uuid import uuid4
import agent
from agent import gemini_agent
import sys


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# DEPARTMENT → DATA FILE MAPPING (Centralized config)
DEPARTMENT_FILES = {
    "CS": {
        "books": "cs_books.csv",
        "students": "cs_students.csv"
    },
    # ...other departments omitted for brevity...
}


# Shared borrowing history file
BORROW_HISTORY_FILE = "borrowing_history.csv"


# In-memory session store (replace with DB/Redis in production)
user_sessions = {}



# REQUEST MODELS (Commented out for direct testing)
# class LoginRequest(BaseModel):
#     username: str
#     department: str
#     year: int
class ChatRequest(BaseModel):
    session_id: str
    message: str



# LOGIN ENDPOINT (Commented out for direct testing)
# @app.post("/login")
# def login(data: LoginRequest):
#     ...existing code...



# HELPER FUNCTION (Modified for direct testing)
def get_user_session(session_id: str):
    session = user_sessions.get(session_id)
    if not session:
        print("Session not found")
        sys.exit(1)
    return session



# CHAT ENDPOINT (Commented out for direct testing)

@app.post("/chat")
def chat(request: ChatRequest):
    session_id = request.session_id
    message = request.message
    # Create session if not exists (for demo)
    if session_id not in user_sessions:
        user_sessions[session_id] = {
            "username": "webuser",
            "department": "CS",
            "year": 2,
            "chat_history": [],
            "files": DEPARTMENT_FILES["CS"],
            "borrow_file": BORROW_HISTORY_FILE
        }
    session = user_sessions[session_id]
    session["chat_history"].append({
        "user": "user",
        "user_message": message
    })
    response = gemini_agent(session, message)
    session["chat_history"].append({
        "user": "bot",
        "user_message": response
    })
    return {"response": response}



# SESSION RETRIEVAL ENDPOINT (Commented out for direct testing)
# @app.get("/session/{session_id}")
# def get_session(session_id: str):
#     ...existing code...

# MAIN BLOCK FOR DIRECT TESTING
if __name__ == "__main__":
    # Hardcoded user and department details
    session_id = "test-session"
    user_sessions[session_id] = {
        "username": "testuser",
        "department": "CS",
        "year": 2,
        "chat_history": [],
        "files": DEPARTMENT_FILES["CS"],
        "borrow_file": BORROW_HISTORY_FILE
    }

    print("Welcome to the test chatbot!")
    print("Type 'exit' to quit.\n")
    while True:
        user_message = input("You: ")
        if user_message.lower() == "exit":
            print("Exiting chat.")
            break
        session = get_user_session(session_id)
        session["chat_history"].append({
            "role": "user",
            "content": user_message
        })
        response = gemini_agent(session, user_message)
        session["chat_history"].append({
            "role": "bot",
            "content": response
        })
        print(f"Bot: {response}\n")

