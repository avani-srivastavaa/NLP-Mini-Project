from fastapi.testclient import TestClient
from main import app

client = TestClient(app)
resp = client.get('/analytics')
print('status', resp.status_code)
j = resp.json()
print('active_users', j.get('active_users'))
print('books_borrowed_by_dept', j.get('books_borrowed_by_dept'))
print('students_borrowing_by_dept', j.get('students_borrowing_by_dept'))
print('timeline_last', j.get('timeline')[-3:])
