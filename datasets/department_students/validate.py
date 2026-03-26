import pandas as pd
import os
from collections import defaultdict

def validate_department_students():
    """Validate all department student files for data integrity issues"""
    
    # Directory containing department files
    dept_dir = 'd:\\NLP\\datasets\\department_students'
    
    # Get all department CSV files
    dept_files = [f for f in os.listdir(dept_dir) if f.endswith('_students.csv')]
    
    print("=" * 80)
    print("DEPARTMENT STUDENTS DATA VALIDATION REPORT")
    print("=" * 80)
    
    # Track all Admission_Numbers and Names across departments for duplicate checking
    all_admission_numbers = defaultdict(list)
    all_student_names = defaultdict(list)
    
    # Issues found
    issues = {
        'duplicate_admission_numbers': [],
        'duplicate_student_names': [],
        'missing_data': [],
        'inconsistent_departments': [],
        'invalid_admission_format': []
    }
    
    for filename in sorted(dept_files):
        filepath = os.path.join(dept_dir, filename)
        dept_name = filename.replace('_students.csv', '').upper()
        
        print(f"\n{'='*60}")
        print(f"VALIDATING: {dept_name.upper()} ({filename})")
        print(f"{'='*60}")
        
        try:
            df = pd.read_csv(filepath)
            
            # Basic info
            print(f"📊 Total students: {len(df)}")
            print(f"📋 Columns: {list(df.columns)}")
            
            # 1. Check for missing data
            missing_counts = df.isnull().sum()
            if missing_counts.any():
                print(f"⚠️  MISSING DATA:")
                for col, count in missing_counts.items():
                    if count > 0:
                        print(f"   - {col}: {count} missing values")
                        issues['missing_data'].append(f"{dept_name}: {col} has {count} missing values")
            else:
                print("✅ No missing data found")
            
            # 2. Check for duplicate Admission_Numbers within department
            duplicate_admissions = df[df.duplicated(subset=['Admission_Number'], keep=False)]
            if not duplicate_admissions.empty:
                print(f"⚠️  DUPLICATE ADMISSION NUMBERS within department:")
                for adm_no in duplicate_admissions['Admission_Number'].unique():
                    dup_rows = df[df['Admission_Number'] == adm_no]
                    print(f"   - {adm_no}: {len(dup_rows)} duplicates")
                    for _, row in dup_rows.iterrows():
                        print(f"     * {row['Name']}")
                    issues['duplicate_admission_numbers'].append(f"{dept_name}: {adm_no} appears {len(dup_rows)} times")
            else:
                print("✅ No duplicate Admission Numbers within department")
            
            # 3. Check for duplicate Names within department
            duplicate_names = df[df.duplicated(subset=['Name'], keep=False)]
            if not duplicate_names.empty:
                print(f"⚠️  DUPLICATE STUDENT NAMES within department:")
                for name in duplicate_names['Name'].unique():
                    dup_rows = df[df['Name'] == name]
                    print(f"   - '{name}': {len(dup_rows)} duplicates")
                    for _, row in dup_rows.iterrows():
                        print(f"     * Admission No: {row['Admission_Number']}")
                    issues['duplicate_student_names'].append(f"{dept_name}: '{name}' appears {len(dup_rows)} times")
            else:
                print("✅ No duplicate student names within department")
            
            # 4. Check admission number format (should be numeric and reasonable)
            invalid_admissions = []
            for _, row in df.iterrows():
                adm_no = str(row['Admission_Number'])
                # Check if admission number is mostly numeric and reasonable length
                if not adm_no.replace('PE', '').replace('CS', '').replace('IT', '').replace('EC', '').replace('ME', '').replace('AU', '').isdigit():
                    invalid_admissions.append(f"{row['Admission_Number']} ({row['Name']})")
                elif len(adm_no) < 8 or len(adm_no) > 15:
                    invalid_admissions.append(f"{row['Admission_Number']} ({row['Name']}) - unusual length")
            
            if invalid_admissions:
                print(f"⚠️  SUSPICIOUS ADMISSION NUMBER FORMATS:")
                for adm in invalid_admissions[:5]:  # Show first 5
                    print(f"   - {adm}")
                if len(invalid_admissions) > 5:
                    print(f"   ... and {len(invalid_admissions) - 5} more")
                issues['invalid_admission_format'].extend([f"{dept_name}: {adm}" for adm in invalid_admissions])
            else:
                print("✅ All admission numbers have valid format")
            
            # 5. Check department consistency
            unique_depts = df['Department'].unique()
            if len(unique_depts) > 1:
                print(f"⚠️  INCONSISTENT DEPARTMENTS:")
                for dept in unique_depts:
                    count = len(df[df['Department'] == dept])
                    print(f"   - {dept}: {count} students")
                issues['inconsistent_departments'].append(f"{dept_name}: Contains multiple departments: {list(unique_depts)}")
            else:
                print(f"✅ Department consistent: {unique_depts[0]}")
            
            # Track Admission_Numbers and Names for cross-department checking
            for _, row in df.iterrows():
                all_admission_numbers[row['Admission_Number']].append(dept_name)
                all_student_names[row['Name']].append(dept_name)
                
        except Exception as e:
            print(f"❌ ERROR reading {filename}: {str(e)}")
    
    # Cross-department duplicate checking
    print(f"\n{'='*80}")
    print("CROSS-DEPARTMENT DUPLICATE CHECKING")
    print(f"{'='*80}")
    
    # Check for Admission_Numbers appearing in multiple departments
    cross_dept_admissions = {adm_no: depts for adm_no, depts in all_admission_numbers.items() if len(set(depts)) > 1}
    if cross_dept_admissions:
        print(f"⚠️  ADMISSION NUMBERS appearing in MULTIPLE DEPARTMENTS:")
        for adm_no, depts in cross_dept_admissions.items():
            print(f"   - {adm_no}: {' , '.join(set(depts))}")
            issues['duplicate_admission_numbers'].extend([f"Cross-dept: {adm_no} in {' , '.join(set(depts))}"])
    else:
        print("✅ No Admission Numbers appear in multiple departments")
    
    # Check for same student names appearing in multiple departments
    cross_dept_names = {name: depts for name, depts in all_student_names.items() if len(set(depts)) > 1}
    if cross_dept_names:
        print(f"⚠️  SAME STUDENT NAMES appearing in MULTIPLE DEPARTMENTS:")
        for name, depts in cross_dept_names.items():
            print(f"   - '{name}': {' , '.join(set(depts))}")
            issues['duplicate_student_names'].extend([f"Cross-dept: '{name}' in {' , '.join(set(depts))}"])
    else:
        print("✅ No student names appear in multiple departments")
    
    # Summary
    print(f"\n{'='*80}")
    print("VALIDATION SUMMARY")
    print(f"{'='*80}")
    
    total_issues = sum(len(issue_list) for issue_list in issues.values())
    
    if total_issues == 0:
        print("🎉 NO ISSUES FOUND! All department student files are clean.")
    else:
        print(f"⚠️  FOUND {total_issues} TOTAL ISSUES:")
        
        for issue_type, issue_list in issues.items():
            if issue_list:
                print(f"\n📌 {issue_type.replace('_', ' ').upper()} ({len(issue_list)}):")
                for issue in issue_list[:5]:  # Show first 5 issues of each type
                    print(f"   • {issue}")
                if len(issue_list) > 5:
                    print(f"   ... and {len(issue_list) - 5} more")
    
    print(f"\n{'='*80}")
    print("VALIDATION COMPLETE")
    print(f"{'='*80}")

if __name__ == "__main__":
    validate_department_students()