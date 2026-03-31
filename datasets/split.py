import pandas as pd
import os

# 1. Read the students dataset
file_path = 'students-final.csv'
df_students = pd.read_csv(file_path)

# 2. Create the 'dept_students' folder if it doesn't exist
folder_name = 'dept_students'
if not os.path.exists(folder_name):
    os.makedirs(folder_name)

# 3. Split the data by Department and save
for department, group in df_students.groupby('Department'):
    # Create a safe filename (lowercase, underscores instead of spaces)
    safe_dept_name = department.lower().replace(' ', '_').replace('/', '_')
    file_name = f"{safe_dept_name}_students.csv"
    full_path = os.path.join(folder_name, file_name)
    
    # Save the split dataframe to the folder
    group.to_csv(full_path, index=False)
    print(f"Saved: {full_path} (Contains {len(group)} students)")

print("\nProcess Complete. Student files are ready in the 'dept_students' folder.")