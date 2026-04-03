from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
import pandas as pd
from datetime import datetime, timedelta
import random

# Create tables
models.Base.metadata.create_all(bind=engine)

# Load CSV data
books_df = pd.read_csv("../datasets/books-final.csv")
students_df = pd.read_csv("../datasets/students-final.csv")
borrowing_df = pd.read_csv("../datasets/borrowing_history-final.csv")

def populate_sample_data():
    db = SessionLocal()
    try:
        print("🌱 Populating sample data for analytics...")

        # Clear existing data
        db.query(models.BorrowRecord).delete()
        db.query(models.SearchLog).delete()
        db.query(models.Student).delete()
        db.commit()

        # Add students from CSV
        students_added = 0
        for _, row in students_df.iterrows():
            # Hash a default password
            hashed_pw = "$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewfLkIwXHPLtFcS"  # "password123"

            student = models.Student(
                name=row['Name'],
                admission_no=str(row['Admission_Number']),
                department=row['Department'],
                password=hashed_pw
            )
            db.add(student)
            students_added += 1

        db.commit()
        print(f"✅ Added {students_added} students")

        # Add borrow records from CSV (last 30 days)
        borrows_added = 0
        base_date = datetime.utcnow() - timedelta(days=30)

        for _, row in borrowing_df.iterrows():
            # Find student by admission number
            student = db.query(models.Student).filter(
                models.Student.admission_no == str(row['Admission_Number'])
            ).first()

            if student:
                # Random date within last 30 days
                days_offset = random.randint(0, 29)
                borrow_date = base_date + timedelta(days=days_offset)

                # Parse return date if exists
                return_date = None
                if pd.notna(row.get('Return_Date')) and row['Return_Date']:
                    try:
                        return_date = datetime.strptime(row['Return_Date'], '%Y-%m-%d')
                        # Adjust return date to be relative to borrow date
                        return_date = borrow_date + timedelta(days=random.randint(7, 21))
                    except:
                        return_date = None

                borrow_record = models.BorrowRecord(
                    book_id=str(row['Book_ID']),
                    book_title=row['Book_Title'],
                    student_id=student.id,
                    borrow_date=borrow_date,
                    return_date=return_date
                )
                db.add(borrow_record)
                borrows_added += 1

        db.commit()
        print(f"✅ Added {borrows_added} borrow records")

        # Add sample search logs
        searches_added = 0
        search_terms = [
            "algorithms", "machine learning", "data structures", "database", "networks",
            "operating systems", "artificial intelligence", "web development", "mobile computing",
            "computer graphics", "software engineering", "cybersecurity", "cloud computing"
        ]

        # Get some book titles for search results
        book_titles = books_df['Title'].head(20).tolist()

        for _ in range(200):  # Add 200 search records
            search_date = base_date + timedelta(days=random.randint(0, 29))

            search_log = models.SearchLog(
                query=random.choice(search_terms),
                top_result_title=random.choice(book_titles),
                timestamp=search_date
            )
            db.add(search_log)
            searches_added += 1

        db.commit()
        print(f"✅ Added {searches_added} search records")

        print("🎉 Sample data population complete!")
        print("\n📊 Analytics should now show:")
        print("- Active users from student registrations")
        print("- Borrow trends over the last 30 days")
        print("- Popular subjects by department")
        print("- Most borrowed books")
        print("- Most searched terms")
        print("- Return rates and overdue statistics")

    except Exception as e:
        print(f"❌ Error populating data: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    populate_sample_data()