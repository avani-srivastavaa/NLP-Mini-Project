from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from typing import Dict, Any

# We need to make sure the sys.path allows importing the chatbot package things correctly, 
# but as long as we use relative imports or have backend as the root, it's fine.
from backend.app.chatbot.agent import gemini_agent

router = APIRouter(tags=["Chatbot"])

user_sessions: Dict[str, Any] = {}

class ChatRequest(BaseModel):
    session_id: str
    message: str

class InitRequest(BaseModel):
    session_id: str
    user_id: str
    department: str
    
# Mock Department Files Mapping for the agent
DEPARTMENT_FILES = {
    "CS": {
        "books": "computer_science_books.csv",
        "students": "cs_students.csv"
    }
}
BORROW_HISTORY_FILE = "borrowing_history.csv"


from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User

@router.post("/chat")
def chat(request: ChatRequest, db: Session = Depends(get_db)):
    session_id = request.session_id
    message = request.message
    
    # Try to resolve session based on session_id (which could be the admission_number for now)
    user = db.query(User).filter(User.admission_number == session_id).first()
    
    # Create or update session in memory
    if session_id not in user_sessions:
        if user:
            user_sessions[session_id] = {
                "user_id": user.user_id,
                "username": user.name,
                "department": user.department or "CS",
                "year": user.class_name or "Unknown",
                "chat_history": []
            }
        else:
            # Fallback for demo/testing
            user_sessions[session_id] = {
                "user_id": "guest_id",
                "username": "Guest",
                "department": "CS",
                "year": "Unknown",
                "chat_history": []
            }
    
    session = user_sessions[session_id]
    session["chat_history"].append({
        "user": "user",
        "user_message": message
    })
    
    # Pass the database session to the agent for book fetching
    response = gemini_agent(session, message, db=db)
    
    session["chat_history"].append({
        "user": "bot",
        "user_message": response
    })
    
    return {"response": response}

@router.post("/chat/init")
def init_chatbot(request: InitRequest, db: Session = Depends(get_db)):
    session_id = request.session_id
    
    # Try to resolve session based on session_id
    user = db.query(User).filter(User.admission_number == session_id).first()
    
    if session_id not in user_sessions:
        if user:
            user_sessions[session_id] = {
                "user_id": user.user_id,
                "username": user.name,
                "department": user.department or "CS",
                "year": user.class_name or "Unknown",
                "chat_history": []
            }
        else:
            user_sessions[session_id] = {
                "user_id": request.user_id,
                "username": "User",
                "department": request.department or "CS",
                "year": "Unknown",
                "chat_history": []
            }

    session = user_sessions[session_id]
    
    # Eagerly call gemini_agent with an empty message to trigger embedding generation
    # But we modify gemini_agent or ensure_books_and_embeddings to handle this.
    # For now, we just ensure the session is ready. 
    # The actual embedding generation happens inside gemini_agent.
    # To truly pre-generate, we'll call a dedicated helper if needed.
    from backend.app.chatbot.agent import ensure_books_and_embeddings
    ensure_books_and_embeddings(session, db)
    
    return {"status": "initialized", "session_id": session_id}

