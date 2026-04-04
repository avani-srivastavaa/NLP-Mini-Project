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


@router.post("/chat")
def chat(request: ChatRequest):
    session_id = request.session_id
    message = request.message
    
    # Create mock session for demo if not exists
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
