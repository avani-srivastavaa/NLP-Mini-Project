from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, Any
from uuid import uuid4
from userchatbot.agent import gemini_agent

# ============================================================================
# FASTAPI APP SETUP
# ============================================================================
app = FastAPI()

# Allow CORS for frontend development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust for production!
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory session and chat memory store (replace with DB/Redis for production)
user_sessions: Dict[str, Dict[str, Any]] = {}

# ============================================================================
# REQUEST MODELS
# ============================================================================
class LoginRequest(BaseModel):
    username: str
    department: str
    year: int

class ChatRequest(BaseModel):
    session_id: str
    message: str

# ============================================================================
# LOGIN ENDPOINT
# ============================================================================
@app.post("/login")
def login(data: LoginRequest):
    """
    User logs in, provide username, department, and year.
    Returns a session_id for future chat requests.
    """
    session_id = str(uuid4())
    user_sessions[session_id] = {
        "username": data.username,
        "department": data.department,
        "year": data.year,
        "chat_history": []
    }
    return {"session_id": session_id}

def get_user_session(session_id: str):
    """
    Helper function to retrieve user session by ID.
    Raises 404 if session not found.
    """
    session = user_sessions.get(session_id)
    if not session:
        raise HTTPException(status_code=404, detail="Session not found")
    return session

# ============================================================================
# CHAT ENDPOINT (Routes to fetchdetails.py)
# ============================================================================
@app.post("/chat")
def chat(request: ChatRequest):
    """
    Main chat endpoint with Gemini AI agent.
    Uses session_id to access user context and chat memory.
    Calls gemini_agent() from fetchdetails.py for intent detection and routing.
    """
    session = get_user_session(request.session_id)
    user_message = request.message
    
    # Append user message to chat history
    session["chat_history"].append({"role": "user", "content": user_message})
    
    # Call Gemini agent from fetchdetails module
    response = gemini_agent(session, user_message)
    
    # Append bot response to chat history
    session["chat_history"].append({"role": "bot", "content": response})
    return {"response": response, "chat_history": session["chat_history"]}

# ============================================================================
# SESSION RETRIEVAL ENDPOINT
# ============================================================================
@app.get("/session/{session_id}")
def get_session(session_id: str):
    """
    Fetch session info and chat history.
    """
    session = get_user_session(session_id)
    return session