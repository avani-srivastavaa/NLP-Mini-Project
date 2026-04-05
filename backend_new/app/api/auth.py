from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.models.models import User
from app.schemas.schemas import UserLogin, UserProfileUpdate
from app.core.database import get_db

router = APIRouter(prefix="/auth", tags=["Auth"])

@router.post("/login")
def login(data: UserLogin, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.admission_number == data.admission_number).first()
    
    # We use plain text check because the DB currently has dummy plain text passwords
    if not user or user.password != data.password:
        raise HTTPException(status_code=400, detail="Invalid admission number or password")
    
    return {
        "message": "Login successful", 
        "user_id": user.user_id,
        "admission_number": user.admission_number,
        "name": user.name,
        "department": user.department,
        "email": user.email,
        "class_name": user.class_name,
        "contact_no": user.contact_no
    }


@router.put("/profile/{admission_number}")
def update_profile(admission_number: str, profile_data: UserProfileUpdate, db: Session = Depends(get_db)):
    user = db.query(User).filter(User.admission_number == admission_number).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Update only fields that are provided
    if profile_data.name is not None:
        user.name = profile_data.name
    if profile_data.department is not None:
        user.department = profile_data.department
    if profile_data.class_name is not None:
        user.class_name = profile_data.class_name
    if profile_data.contact_no is not None:
        user.contact_no = profile_data.contact_no

    # db.commit() will save the changes directly to MySQL
    db.commit()
    db.refresh(user)

    return {"message": "Profile updated successfully", "user": {"name": user.name, "department": user.department, "class": user.class_name, "contact_no": user.contact_no}}

