import uuid
from fastapi import APIRouter, HTTPException, Depends
from firebase_admin import auth as firebase_auth
from pydantic import BaseModel
from sqlalchemy.orm import Session
from backend.app.core.database import get_db
from backend.app.models.models import User
from backend.app.schemas.schemas import GoogleUserCompleteProfile

router = APIRouter(prefix="/auth/google", tags=["Google Authentication"])

class TokenRequest(BaseModel):
    id_token: str

@router.post("/login")
def google_login(token: TokenRequest, db: Session = Depends(get_db)):
    try:
        decoded_token = firebase_auth.verify_id_token(token.id_token)
        email = decoded_token.get("email")
        name = decoded_token.get("name")

        if not email or not email.endswith(".mes.ac.in"):
            raise HTTPException(
                status_code=403,
                detail="Only MES accounts allowed"
            )

        # Check if the user already exists in MySQL
        existing_user = db.query(User).filter(User.email == email).first()

        if existing_user:
            return {
                "message": "login successful",
                "new_user": False,
                "user_id": existing_user.user_id,
                "admission_number": existing_user.admission_number,
                "name": existing_user.name,
                "department": existing_user.departement,
                "email": existing_user.email
            }
        else:
            # User is not in DB. Send flag 'new_user: true' so UI can prompt for admission_number, department, etc.
            return {
                "message": "User not found. Please complete profile.",
                "new_user": True,
                "email": email,
                "name": name
            }

    except Exception as e:
        raise HTTPException(status_code=401, detail=f"Invalid authentication token: {str(e)}")

@router.post("/complete-profile")
def complete_profile(data: GoogleUserCompleteProfile, db: Session = Depends(get_db)):
    """ Endpoint to hit after the user fills the new user popup with their details. """
    existing_user_adm = db.query(User).filter(User.admission_number == data.admission_number).first()
    if existing_user_adm:
        raise HTTPException(status_code=400, detail="Admission number already in use.")
        
    existing_user_email = db.query(User).filter(User.email == data.email).first()
    if existing_user_email:
        raise HTTPException(status_code=400, detail="Email already registered.")

    new_user = User(
        user_id=str(uuid.uuid4()), # Generate a unique user_id
        admission_number=data.admission_number,
        password="google_oauth", # Placeholder password since they login via google
        name=data.name,
        departement=data.departement,
        email=data.email,
        class_name=data.class_name,
        contact_no=data.contact_no
    )
    
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {
        "message": "Registration successful",
        "user_id": new_user.user_id,
        "admission_number": new_user.admission_number
    }