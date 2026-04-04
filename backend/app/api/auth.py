from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.models.models import Student
from backend.app.schemas.schemas import StudentCreate, StudentLogin
from backend.app.core.database import get_db
from backend.app.core.security import hash_password, verify_password

router = APIRouter(tags=["Auth"])

@router.post("/student-register")
def student_register(student: StudentCreate, db: Session = Depends(get_db)):
    existing = db.query(Student).filter(Student.admission_no == student.admission_no).first()
    if existing:
        raise HTTPException(status_code=400, detail="Student exists")

    new_student = Student(
        name=student.name,
        admission_no=student.admission_no,
        department=student.department,
        password=hash_password(student.password)
    )
    db.add(new_student)
    db.commit()
    return {"message": "Registered"}

@router.post("/student-login")
def student_login(data: StudentLogin, db: Session = Depends(get_db)):
    student = db.query(Student).filter(Student.admission_no == data.admission_no).first()
    if not student or not verify_password(data.password, student.password):
        raise HTTPException(status_code=400, detail="Invalid credentials")
    return {"message": "Login successful"}
