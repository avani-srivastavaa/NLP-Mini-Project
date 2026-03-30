from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from uuid import uuid4
from userchatbot.agent import gemini_agent

# FASTAPI APP SETUP
app = FastAPI()

# Allow CORS for frontend development
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
    "AUTO": {
        "books": "auto_books.csv",
        "students": "auto_students.csv"
    },
    "ECS": {
        "books": "ecs_books.csv",
        "students": "ecs_students.csv"
    },
    "EXTC": {
        "books": "extc_books.csv",
        "students": "extc_students.csv"
    },
    "IT": {
        "books": "it_books.csv",
        "students": "it_students.csv"
    },
    "MECH": {
        "books": "mech_books.csv",
        "students": "mech_students.csv"
    },
    "FIRST_YEAR": {
        "books": "first_year_books.csv",
        "students": None  # No student file
    }
}

# Shared borrowing history file
BORROW_HISTORY_FILE = "borrowing_history.csv"

# In-memory session store (replace with DB/Redis in production)
user_sessions: Dict[str, Dict[str, Any]] = {}


# REQUEST MODELS
class LoginRequest(BaseModel):
    username: str
    department: str
    year: int

class ChatRequest(BaseModel):
    session_id: str
    message: str


# LOGIN ENDPOINT
@app.post("/login")
def login(data: LoginRequest):
    """
    User logs in, provide username, department, and year.
    Returns a session_id for future chat requests.
    """
    session_id = str(uuid4())
    dept = data.department.upper()

    if dept not in DEPARTMENT_FILES:
        raise HTTPException(status_code=400, detail="Invalid department")

    user_sessions[session_id] = {
        "username": data.username,
        "department": dept,
        "year": data.year,
        "chat_history": [],
        "files": DEPARTMENT_FILES[dept],     # mapped files
        "borrow_file": BORROW_HISTORY_FILE   # shared history
    }

    return {"session_id": session_id}


# HELPER FUNCTION
def get_user_session(session_id: str):
    """
    Retrieve user session by ID.
    """
    session = user_sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session


# CHAT ENDPOINT
@app.post("/chat")
def chat(request: ChatRequest):
    """
    Main chat endpoint with Gemini AI agent.
    """
    session = get_user_session(request.session_id)
    user_message = request.message

    # Store user message
    session["chat_history"].append({
        "role": "user",
        "content": user_message
    })

    # Call Gemini agent
    response = gemini_agent(session, user_message)

    # Store bot response
    session["chat_history"].append({
        "role": "bot",
        "content": response
    })

    return {
        "response": response,
        "chat_history": session["chat_history"]
    }


# SESSION RETRIEVAL ENDPOINT
@app.get("/session/{session_id}")
def get_session(session_id: str):
    """
    Fetch session info and chat history.
    """
    return get_user_session(session_id)
