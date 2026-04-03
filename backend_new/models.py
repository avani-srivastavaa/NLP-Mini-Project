from sqlalchemy import Column, Integer, String, Text, DateTime
from datetime import datetime
from database import Base


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), nullable=False)
    admission_no = Column(String(50), unique=True, nullable=False)
    department = Column(String(100))
    password = Column(String(255), nullable=False)


class Book(Base):
    __tablename__ = "books"

    id = Column(String(50), primary_key=True, index=True)   # ✅ VARCHAR ID
    title = Column(String(255), nullable=False)
    author = Column(String(255), nullable=False)
    isbn = Column(String(50))
    status = Column(String(50), default="available")
    embedding = Column(Text)


class BorrowRecord(Base):
    __tablename__ = "borrow_records"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(String(50), nullable=False)   # ✅ VARCHAR
    book_title = Column(String(255))
    student_id = Column(Integer, nullable=False)
    borrow_date = Column(DateTime, default=datetime.utcnow)
    return_date = Column(DateTime, nullable=True)

class SearchLog(Base):
    __tablename__ = "search_logs"
    id = Column(Integer, primary_key=True, index=True)
    query = Column(String(255))
    top_result_title = Column(String(255)) # Store what the AI found
    timestamp = Column(DateTime, default=datetime.utcnow)