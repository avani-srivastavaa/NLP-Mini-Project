import json
import asyncio
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from app.core.database import SessionLocal
from app.models.models import User, Book, BorrowedBook

router = APIRouter(tags=["WebSockets"])

class ConnectionManager:
    def __init__(self):
        # Maps student_id to their active websocket
        self.active_students: dict[str, WebSocket] = {}
        # List of all connected admin websockets
        self.active_admins: list[WebSocket] = []

    async def connect(self, websocket: WebSocket, role: str, user_id: str):
        await websocket.accept()
        if role == "student":
            self.active_students[user_id] = websocket
        elif role == "admin":
            self.active_admins.append(websocket)

    def disconnect(self, websocket: WebSocket, role: str, user_id: str):
        if role == "student" and user_id in self.active_students:
            if self.active_students[user_id] == websocket:
                del self.active_students[user_id]
        elif role == "admin" and websocket in self.active_admins:
            self.active_admins.remove(websocket)

    async def send_personal_message(self, message: str, websocket: WebSocket):
        await websocket.send_text(message)

    async def broadcast_to_admins(self, data: dict):
        # Remove closed/disconnected websockets dynamically while broadcasting
        disconnected = []
        for admin_ws in self.active_admins:
            try:
                await admin_ws.send_json(data)
            except Exception:
                disconnected.append(admin_ws)
        
        for ws in disconnected:
            self.active_admins.remove(ws)

    async def send_to_student(self, student_id: str, data: dict):
        if student_id in self.active_students:
            try:
                await self.active_students[student_id].send_json(data)
                print(f"✅ Successfully sent to student {student_id}: {data['type']}")
            except Exception as e:
                print(f"❌ Failed to send to {student_id}: {e}")
        else:
            print(f"⚠️ Student {student_id} not found in active_students! Connected: {list(self.active_students.keys())}")

manager = ConnectionManager()

# Background task to timeout requests if no admin replies
pending_requests = {}

async def request_timeout_cycle(request_id: str, student_id: str, book_id: str, req_type: str = "borrow"):
    await asyncio.sleep(60) # 60 second timeout
    if pending_requests.get(request_id) == "pending":
        print(f"Request timeout for {request_id}")
        # Send failure to student
        del pending_requests[request_id]
        
        resp_type = "return_response" if req_type == "return" else "borrow_response"
        await manager.send_to_student(student_id, {
            "type": resp_type,
            "status": "rejected",
            "reason": "Admin did not respond in time (Timeout)."
        })

@router.websocket("/ws/borrow/{role}/{user_id}")
async def websocket_borrow_endpoint(websocket: WebSocket, role: str, user_id: str):
    await manager.connect(websocket, role, user_id)
    try:
        while True:
            # We expect JSON messages
            data = await websocket.receive_json()
            
            if data.get("type") == "borrow_request" and role == "student":
                book_id = data.get("book_id")
                # Generate unique request id
                request_id = f"REQ_{user_id}_{book_id}_{int(datetime.now().timestamp())}"
                
                # Verify logic with DB (check if book has copies, etc.)
                db = SessionLocal()
                try:
                    book = db.query(Book).filter(Book.book_id == book_id).first()
                    user = db.query(User).filter(User.admission_number == user_id).first()
                    
                    if not book or not user:
                        await manager.send_to_student(user_id, {
                            "type": "borrow_response", "status": "error", "reason": "User or Book not found"
                        })
                        continue
                        
                    if book.available_copies <= 0:
                        await manager.send_to_student(user_id, {
                            "type": "borrow_response", "status": "error", "reason": "Book is out of stock"
                        })
                        continue
                        
                    existing = db.query(BorrowedBook).filter(
                        BorrowedBook.user_id == user.user_id,
                        BorrowedBook.Book_ID == book_id,
                        BorrowedBook.status == "issued"
                    ).first()
                    if existing:
                        await manager.send_to_student(user_id, {
                            "type": "borrow_response", "status": "error", "reason": "You already borrowed this book"
                        })
                        continue

                    # Queue it up for timeout checking
                    pending_requests[request_id] = "pending"
                    
                    # Alert Admins
                    await manager.broadcast_to_admins({
                        "type": "borrow_request_admin",
                        "request_id": request_id,
                        "student_id": user_id,
                        "student_name": user.name,
                        "book_id": book_id,
                        "book_title": book.title,
                        "timestamp": str(datetime.now().time())
                    })

                    # Start the timeout task safely asynchronously
                    asyncio.create_task(request_timeout_cycle(request_id, user_id, book_id))
                    
                finally:
                    db.close()

            elif data.get("type") == "borrow_response" and role == "admin":
                request_id = data.get("request_id")
                student_id = data.get("student_id")
                book_id = data.get("book_id")
                approved = data.get("approved")
                
                # Check if it was already processed or timed out
                if pending_requests.get(request_id) != "pending":
                    continue # Skip
                    
                # Mark as processed
                pending_requests[request_id] = "processed"

                if approved:
                    # Update Database
                    try:
                        db = SessionLocal()
                        try:
                            book = db.query(Book).filter(Book.book_id == book_id).first()
                            user = db.query(User).filter(User.admission_number == student_id).first()
                            
                            if book and book.available_copies > 0:
                                book.available_copies -= 1
                                now = datetime.now()
                                new_record = BorrowedBook(
                                    user_id=user.user_id,
                                    Book_ID=book_id,
                                    b_date=now.date(),
                                    b_time=now.time(),
                                    r_date=(now + timedelta(days=15)).date(),
                                    r_time=now.time(),
                                    status="issued"
                                )
                                db.add(new_record)
                                db.commit()
                                
                                # Inform the student explicitly that it was successful
                                await manager.send_to_student(student_id, {
                                    "type": "borrow_response",
                                    "status": "approved",
                                    "book_title": book.title
                                })
                            else:
                                await manager.send_to_student(student_id, {
                                    "type": "borrow_response",
                                    "status": "rejected",
                                    "reason": "Failed during approval (Out of stock manually)."
                                })
                        finally:
                            db.close()
                    except Exception as e:
                        import traceback
                        traceback.print_exc()
                        await manager.send_to_student(student_id, {
                            "type": "borrow_response",
                            "status": "error",
                            "reason": f"Database Error: {str(e)}"
                        })
                else:
                    # Rejected by Admin
                    await manager.send_to_student(student_id, {
                        "type": "borrow_response",
                        "status": "rejected",
                        "reason": "Admin rejected the borrowing request."
                    })

            elif data.get("type") == "return_request" and role == "student":
                issue_id = data.get("issue_id")
                request_id = f"RET_{user_id}_{issue_id}_{int(datetime.now().timestamp())}"
                
                db = SessionLocal()
                try:
                    record = db.query(BorrowedBook).filter(BorrowedBook.issue_id == issue_id).first()
                    user = db.query(User).filter(User.admission_number == user_id).first()
                    
                    if not record or not user:
                        await manager.send_to_student(user_id, {
                            "type": "return_response", "status": "error", "reason": "Issue record not found"
                        })
                        continue

                    if record.status != "issued":
                        await manager.send_to_student(user_id, {
                            "type": "return_response", "status": "error", "reason": "Book is not currently issued"
                        })
                        continue

                    book = db.query(Book).filter(Book.book_id == record.Book_ID).first()
                    book_title = book.title if book else "Unknown Book"

                    pending_requests[request_id] = "pending"
                    
                    await manager.broadcast_to_admins({
                        "type": "return_request_admin",
                        "request_id": request_id,
                        "issue_id": issue_id,
                        "student_id": user_id,
                        "student_name": user.name,
                        "book_id": record.Book_ID,
                        "book_title": book_title,
                        "timestamp": str(datetime.now().time())
                    })

                    asyncio.create_task(request_timeout_cycle(request_id, user_id, record.Book_ID, "return"))
                    
                finally:
                    db.close()

            elif data.get("type") == "return_response" and role == "admin":
                request_id = data.get("request_id")
                student_id = data.get("student_id")
                issue_id = data.get("issue_id")
                approved = data.get("approved")
                
                print(f"🔄 Return response received: req={request_id}, student={student_id}, issue={issue_id}, approved={approved}")
                print(f"🔄 Pending requests: {pending_requests}")
                
                if pending_requests.get(request_id) != "pending":
                    print(f"❌ Request {request_id} not found in pending_requests or already processed!")
                    continue

                pending_requests[request_id] = "processed"
                print(f"✅ Request marked as processed, proceeding...")

                if approved:
                    try:
                        db = SessionLocal()
                        try:
                            record = db.query(BorrowedBook).filter(BorrowedBook.issue_id == issue_id).first()
                            if record and record.status == "issued":
                                book = db.query(Book).filter(Book.book_id == record.Book_ID).first()
                                
                                now = datetime.now()
                                original_due_date = record.r_date  # Capture due date before overwriting
                                print(f"📅 Before update: r_date={record.r_date}, or_date={record.or_date}")
                                record.or_date = original_due_date  # Save original due date
                                record.r_date = now.date()          # Actual return date
                                record.r_time = now.time()
                                record.status = "returned"
                                print(f"📅 After update: r_date={record.r_date}, or_date={record.or_date}")
                                
                                if book:
                                    book.available_copies += 1
                                
                                print(f"💾 About to commit return for issue {issue_id}...")
                                db.commit()
                                print(f"💾 Commit successful! Sending response to student {student_id}...")
                                
                                await manager.send_to_student(student_id, {
                                    "type": "return_response",
                                    "status": "approved",
                                    "book_title": book.title if book else "The book"
                                })
                                print(f"📤 Response sent to student!")
                            else:
                                await manager.send_to_student(student_id, {
                                    "type": "return_response", "status": "error", "reason": "Record not found or not active"
                                })
                        finally:
                            db.close()
                    except Exception as e:
                        import traceback
                        traceback.print_exc()
                        await manager.send_to_student(student_id, {
                            "type": "return_response", "status": "error", "reason": f"Database Error: {str(e)}"
                        })
                else:
                    await manager.send_to_student(student_id, {
                        "type": "return_response",
                        "status": "rejected",
                        "reason": "Admin rejected the return request."
                    })

    except WebSocketDisconnect:
        manager.disconnect(websocket, role, user_id)

