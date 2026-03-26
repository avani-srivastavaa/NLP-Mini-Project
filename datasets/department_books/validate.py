import pandas as pd
import os
from collections import defaultdict

def validate_department_books():
    """Validate all department book files for data integrity issues"""
    
    # Directory containing department files
    dept_dir = 'd:\\NLP\\datasets\\department_books'
    
    # Get all department CSV files
    dept_files = [f for f in os.listdir(dept_dir) if f.endswith('_books.csv')]
    
    print("=" * 80)
    print("DEPARTMENT BOOKS DATA VALIDATION REPORT")
    print("=" * 80)
    
    # Track all Book_IDs across departments for duplicate checking
    all_book_ids = defaultdict(list)
    all_titles_authors = defaultdict(list)
    
    # Issues found
    issues = {
        'duplicate_book_ids': [],
        'duplicate_titles_authors': [],
        'invalid_copies': [],
        'missing_data': [],
        'inconsistent_departments': []
    }
    
    for filename in sorted(dept_files):
        filepath = os.path.join(dept_dir, filename)
        dept_name = filename.replace('_books.csv', '').upper()
        
        print(f"\n{'='*60}")
        print(f"VALIDATING: {dept_name.upper()} ({filename})")
        print(f"{'='*60}")
        
        try:
            df = pd.read_csv(filepath)
            
            # Basic info
            print(f"📊 Total books: {len(df)}")
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
            
            # 2. Check for duplicate Book_IDs within department
            duplicate_ids = df[df.duplicated(subset=['Book_ID'], keep=False)]
            if not duplicate_ids.empty:
                print(f"⚠️  DUPLICATE BOOK_IDs within department:")
                for book_id in duplicate_ids['Book_ID'].unique():
                    dup_rows = df[df['Book_ID'] == book_id]
                    print(f"   - {book_id}: {len(dup_rows)} duplicates")
                    issues['duplicate_book_ids'].append(f"{dept_name}: {book_id} appears {len(dup_rows)} times")
            else:
                print("✅ No duplicate Book_IDs within department")
            
            # 3. Check for duplicate Title+Author combinations within department
            duplicate_titles = df[df.duplicated(subset=['Title', 'Author'], keep=False)]
            if not duplicate_titles.empty:
                print(f"⚠️  DUPLICATE Title+Author combinations:")
                for _, row in duplicate_titles.iterrows():
                    print(f"   - '{row['Title']}' by {row['Author']} (ID: {row['Book_ID']})")
                    issues['duplicate_titles_authors'].append(f"{dept_name}: '{row['Title']}' by {row['Author']}")
            else:
                print("✅ No duplicate Title+Author combinations")
            
            # 4. Check for invalid copy numbers
            invalid_copies = df[(df['Total_Copies'] < 0) | (df['Available_Copies'] < 0) | 
                               (df['Available_Copies'] > df['Total_Copies'])]
            if not invalid_copies.empty:
                print(f"⚠️  INVALID COPY NUMBERS:")
                for _, row in invalid_copies.iterrows():
                    if row['Available_Copies'] > row['Total_Copies']:
                        print(f"   - {row['Book_ID']}: Available ({row['Available_Copies']}) > Total ({row['Total_Copies']})")
                    else:
                        print(f"   - {row['Book_ID']}: Negative copies - Total: {row['Total_Copies']}, Available: {row['Available_Copies']}")
                    issues['invalid_copies'].append(f"{dept_name}: {row['Book_ID']} has invalid copy numbers")
            else:
                print("✅ All copy numbers are valid")
            
            # 5. Check department consistency
            unique_depts = df['Department'].unique()
            if len(unique_depts) > 1:
                print(f"⚠️  INCONSISTENT DEPARTMENTS:")
                for dept in unique_depts:
                    count = len(df[df['Department'] == dept])
                    print(f"   - {dept}: {count} books")
                issues['inconsistent_departments'].append(f"{dept_name}: Contains multiple departments: {list(unique_depts)}")
            else:
                print(f"✅ Department consistent: {unique_depts[0]}")
            
            # Track Book_IDs and Title+Author for cross-department checking
            for _, row in df.iterrows():
                all_book_ids[row['Book_ID']].append(dept_name)
                title_author_key = f"{row['Title']}|{row['Author']}"
                all_titles_authors[title_author_key].append(dept_name)
                
        except Exception as e:
            print(f"❌ ERROR reading {filename}: {str(e)}")
    
    # Cross-department duplicate checking
    print(f"\n{'='*80}")
    print("CROSS-DEPARTMENT DUPLICATE CHECKING")
    print(f"{'='*80}")
    
    # Check for Book_IDs appearing in multiple departments
    cross_dept_book_ids = {book_id: depts for book_id, depts in all_book_ids.items() if len(set(depts)) > 1}
    if cross_dept_book_ids:
        print(f"⚠️  BOOK_IDs appearing in MULTIPLE DEPARTMENTS:")
        for book_id, depts in cross_dept_book_ids.items():
            print(f"   - {book_id}: {' , '.join(set(depts))}")
            issues['duplicate_book_ids'].extend([f"Cross-dept: {book_id} in {' , '.join(set(depts))}"])
    else:
        print("✅ No Book_IDs appear in multiple departments")
    
    # Check for same Title+Author appearing in multiple departments
    cross_dept_titles = {title_auth: depts for title_auth, depts in all_titles_authors.items() if len(set(depts)) > 1}
    if cross_dept_titles:
        print(f"⚠️  SAME Title+Author appearing in MULTIPLE DEPARTMENTS:")
        for title_auth, depts in cross_dept_titles.items():
            title, author = title_auth.split('|', 1)
            print(f"   - '{title}' by {author}: {' , '.join(set(depts))}")
            issues['duplicate_titles_authors'].extend([f"Cross-dept: '{title}' by {author} in {' , '.join(set(depts))}"])
    else:
        print("✅ No Title+Author combinations appear in multiple departments")
    
    # Summary
    print(f"\n{'='*80}")
    print("VALIDATION SUMMARY")
    print(f"{'='*80}")
    
    total_issues = sum(len(issue_list) for issue_list in issues.values())
    
    if total_issues == 0:
        print("🎉 NO ISSUES FOUND! All department files are clean.")
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
    validate_department_books()