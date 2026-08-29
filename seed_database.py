"""Load the repository's supplied CSV catalog and student records into the local database.

This script is idempotent: it adds rows that do not already exist and preserves
any books, users, and transactions created during a demo.
"""

from __future__ import annotations

import csv
from pathlib import Path

from backend.app.core.database import Base, SessionLocal, engine
from backend.app.models.models import Book, User


ROOT = Path(__file__).resolve().parent
DEFAULT_PASSWORD = "demo123"


def value(row: dict[str, str], key: str) -> str:
    return (row.get(key) or "").strip()


def seed_books(session) -> int:
    added = 0
    for path in (ROOT / "datasets" / "dept_books").glob("*.csv"):
        with path.open(encoding="utf-8-sig", newline="") as source:
            for row in csv.DictReader(source):
                book_id = value(row, "Book_ID")
                if not book_id or session.get(Book, book_id):
                    continue
                total = int(value(row, "Total_Copies") or 1)
                available = int(value(row, "Available_Copies") or total)
                session.add(Book(
                    book_id=book_id,
                    title=value(row, "Title"),
                    author=value(row, "Author"),
                    department=value(row, "Department"),
                    total_copies=total,
                    available_copies=available,
                    column_dept=value(row, "Department"),
                ))
                added += 1
    return added


def seed_users(session) -> int:
    added = 0
    for path in (ROOT / "datasets" / "dept_students").glob("*.csv"):
        with path.open(encoding="utf-8-sig", newline="") as source:
            for row in csv.DictReader(source):
                admission_number = value(row, "Admission_Number")
                if not admission_number or session.query(User).filter_by(admission_number=admission_number).first():
                    continue
                session.add(User(
                    user_id=f"U-{admission_number}",
                    name=value(row, "Name") or admission_number,
                    admission_number=admission_number,
                    department=value(row, "Department"),
                    password=DEFAULT_PASSWORD,
                    email=f"{admission_number.lower()}@demo.local",
                    class_name="Demo",
                ))
                added += 1
    return added


def main() -> None:
    Base.metadata.create_all(bind=engine)
    with SessionLocal() as session:
        books = seed_books(session)
        users = seed_users(session)
        session.commit()
    print(f"Database ready: added {books} books and {users} users.")
    print(f"Demo student password: {DEFAULT_PASSWORD}")


if __name__ == "__main__":
    main()
