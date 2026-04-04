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
                "username": user.name,
                "department": user.departement or "CS",
                "year": user.class_name or "Unknown",
                "chat_history": []
            }
        else:
            # Fallback for demo/testing
            user_sessions[session_id] = {
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

