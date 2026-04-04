from pydantic import BaseModel


class StudentCreate(BaseModel):
    name: str
    admission_no: str
    department: str
    password: str


class StudentLogin(BaseModel):
    admission_no: str
    password: str


class BookCreate(BaseModel):
    id: str   # 🔥 ADD THIS
    title: str
    author: str
    isbn: str