from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base


from sqlalchemy import Column, Integer, String, Text, DateTime, Float, ForeignKey, Time, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from backend.app.core.database import Base

class User(Base):
    __tablename__ = "users"

    user_id = Column(String(100), primary_key=True, index=True)
    password = Column(String(255), nullable=False)
    name = Column(String(255), nullable=False)
    admission_number = Column(String(50), unique=True, nullable=False)
    departement = Column(String(100))
    email = Column(String(100), unique=True)
    class_name = Column("class", String(50)) # 'class' is a reserved keyword in python
    contact_no = Column(String(20))


class Book(Base):
    __tablename__ = "books"

    book_id = Column(String(50), primary_key=True, index=True)
    title = Column(String(255))
    author = Column(String(255))
    department = Column(String(100))
    total_copies = Column(Integer)
    available_copies = Column(Integer)
    column_dept = Column(String(100))
    shelf_no = Column(String(50))
    rack_no = Column(String(50))


class BorrowedBook(Base):
    __tablename__ = "borrowed_books"

    issue_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    user_id = Column(String(100))
    Book_ID = Column(String(50))
    b_date = Column(Date)
    b_time = Column(Time)
    r_date = Column(Date, nullable=True)
    r_time = Column(Time, nullable=True)
    status = Column(String(10))

class Review(Base):
    __tablename__ = "review"

    review_id = Column(Integer, primary_key=True, autoincrement=True, index=True)
    book_id = Column(String(50))
    user_id = Column(String(100))
    review = Column(Text)