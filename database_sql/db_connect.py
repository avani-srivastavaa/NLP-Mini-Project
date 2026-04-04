import mysql.connector
from mysql.connector import Error

conn = None

try:
    conn = mysql.connector.connect(
        host="localhost",
        user="root",
        password="root123",
        database="library_db"
    )
    
    if conn.is_connected():
        cursor = conn.cursor()
        cursor.execute("SHOW TABLES")
        
        for table in cursor: #type: ignore
            print(table)
        
        cursor.close()
        print("Database connection successful!")
    
except Error as e:
    print(f"Error while connecting to MySQL: {e}")

finally:
    if conn is not None and conn.is_connected():
        conn.close()
        print("MySQL connection closed")
