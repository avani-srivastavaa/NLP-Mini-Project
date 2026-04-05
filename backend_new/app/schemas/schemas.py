from pydantic import BaseModel
from typing import Optional
from datetime import date, time

# User Schemas
class UserProfileUpdate(BaseModel):
    name: Optional[str] = None
    department: Optional[str] = None
    class_name: Optional[str] = None
    contact_no: Optional[str] = None
    # email is NOT editable

class UserLogin(BaseModel):
    admission_number: str
    password: str

class UserCreate(BaseModel):
    admission_number: str
    name: str
    department: str
    password: str

class GoogleUserCompleteProfile(BaseModel):
    admission_number: str
    name: str
    department: str
    class_name: Optional[str] = None
    contact_no: Optional[str] = None
    email: str # Provided by google

class GoogleUserCreateCredentials(BaseModel):
    email: str
    name: str
    admission_number: str
    password: str

# Borrowed Books Schema
class BorrowRequest(BaseModel):
    admission_number: str
    book_id: str
