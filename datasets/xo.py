import pandas as pd
import random
from datetime import datetime, timedelta

# --- 1. DATA SEEDING ---
today = datetime(2026, 3, 26)

# Realistic Name Components
first_names = ["Aarav", "Ananya", "Vihaan", "Isha", "Rohan", "Sanya", "Arjun", "Kiara", "Aditya", "Tanvi", 
               "Ishaan", "Diya", "Kabir", "Myra", "Aryan", "Anika", "Rahul", "Priya", "Yash", "Sneha"]
last_names = ["Sharma", "Patil", "Deshmukh", "Iyer", "Verma", "Joshi", "Nair", "Kulkarni", "Gupta", "Mehta",
              "Reddy", "Chauhan", "Pandey", "Malhotra", "Bose", "Das", "Mishra", "Singh", "Yadav", "Kaur"]

# --- 2. GENERATE 300 UNIQUE STUDENTS ---
students_list = []
used_ids = set()

depts_students = ["CS", "IT", "ECS", "EXTC", "MECH", "AUTO"]

for dept in depts_students:
    for _ in range(50): # 50 students per dept = 300 total
        full_name = f"{random.choice(first_names)} {random.choice(last_names)}"
        
        # Ensure unique Admission No
        while True:
            adm_no = f"{random.choice(['2022', '2023', '2024'])}PE{random.randint(1000, 9999)}"
            if adm_no not in used_ids:
                used_ids.add(adm_no)
                break
        
        students_list.append({"Name": full_name, "Admission_No": adm_no, "Department": dept})

df_students = pd.DataFrame(students_list)

# --- 3. GENERATE 600 REAL BOOKS (From previous logic) ---
# (Abbreviated for brevity, using same logic as before)
books_data = []
book_titles = ["Engineering Math", "Data Structures", "Operating Systems", "Thermodynamics", "Microprocessors"]
for i in range(600):
    title = f"{random.choice(book_titles)} - Vol {random.randint(1, 10)}"
    qty = random.randint(5, 15)
    books_data.append({"Book_ID": f"BK{i+1:03d}", "Title": title, "Total_Copies": qty, "Available_Copies": qty})
df_books = pd.DataFrame(books_data)

# --- 4. GENERATE 800 BORROWING RECORDS ---
history_data = []
all_students = df_students.to_dict('records')
all_books = df_books.to_dict('records')

for _ in range(800):
    # Pick a random student from our real 300 students
    student = random.choice(all_students)
    book = random.choice(all_books)
    
    issue_date = today - timedelta(days=random.randint(5, 90))
    return_date = issue_date + timedelta(days=random.randint(5, 25))
    
    history_data.append({
        "Student Name": student['Name'],        # Matches students_dataset
        "Admission No": student['Admission_No'], # Matches students_dataset
        "Book Name": book['Title'],
        "Issue Date": issue_date.strftime('%Y-%m-%d'),
        "Return Date": return_date.strftime('%Y-%m-%d'),
        "Days Due": max(0, (return_date - issue_date).days - 14)
    })

df_history = pd.DataFrame(history_data)

# --- 5. FINAL SYNC ---
# Update available copies based on future return dates
active_loans = df_history[pd.to_datetime(df_history['Return Date']) > today]
loan_counts = active_loans['Book Name'].value_counts().to_dict()
df_books['Available_Copies'] = df_books.apply(lambda x: max(0, x['Total_Copies'] - loan_counts.get(x['Title'], 0)), axis=1)

# --- 6. SAVE ---
df_students.to_csv("students_dataset.csv", index=False)
df_books.to_csv("books_dataset.csv", index=False)
df_history.to_csv("borrowing_history.csv", index=False)

print("✅ Success: Names and Admission Numbers are perfectly matched in all files.")