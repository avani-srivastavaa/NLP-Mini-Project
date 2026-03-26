// Mock data for the Library Management System

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  coverUrl: string;
  available: boolean;
}

export interface BorrowRecord {
  id: string;
  studentName: string;
  studentId: string;
  bookId: string;
  bookName: string;
  issueDate: string;
  returnDate: string;
  status: 'returned' | 'pending' | 'overdue';
}

export interface Student {
  id: string;
  name: string;
  email: string;
  booksBorrowed: number;
}

export const mockBooks: Book[] = [
  {
    id: 'B001',
    title: 'To Kill a Mockingbird',
    author: 'Harper Lee',
    category: 'Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1543002588-bfa74002ed7e?w=300&h=400&fit=crop',
    available: true,
  },
  {
    id: 'B002',
    title: '1984',
    author: 'George Orwell',
    category: 'Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300&h=400&fit=crop',
    available: false,
  },
  {
    id: 'B003',
    title: 'The Great Gatsby',
    author: 'F. Scott Fitzgerald',
    category: 'Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?w=300&h=400&fit=crop',
    available: true,
  },
  {
    id: 'B004',
    title: 'Clean Code',
    author: 'Robert C. Martin',
    category: 'Technology',
    coverUrl: 'https://images.unsplash.com/photo-1516116216624-53e697fedbea?w=300&h=400&fit=crop',
    available: true,
  },
  {
    id: 'B005',
    title: 'The Alchemist',
    author: 'Paulo Coelho',
    category: 'Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?w=300&h=400&fit=crop',
    available: true,
  },
  {
    id: 'B006',
    title: 'Sapiens',
    author: 'Yuval Noah Harari',
    category: 'Non-Fiction',
    coverUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?w=300&h=400&fit=crop',
    available: false,
  },
  {
    id: 'B007',
    title: 'Atomic Habits',
    author: 'James Clear',
    category: 'Self-Help',
    coverUrl: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?w=300&h=400&fit=crop',
    available: true,
  },
  {
    id: 'B008',
    title: 'The Hobbit',
    author: 'J.R.R. Tolkien',
    category: 'Fantasy',
    coverUrl: 'https://images.unsplash.com/photo-1506880018603-83d5b814b5a6?w=300&h=400&fit=crop',
    available: true,
  },
];

export const mockBorrowRecords: BorrowRecord[] = [
  {
    id: 'BR001',
    studentName: 'John Doe',
    studentId: 'S001',
    bookId: 'B002',
    bookName: '1984',
    issueDate: '2026-03-10',
    returnDate: '2026-03-24',
    status: 'pending',
  },
  {
    id: 'BR002',
    studentName: 'Jane Smith',
    studentId: 'S002',
    bookId: 'B006',
    bookName: 'Sapiens',
    issueDate: '2026-03-01',
    returnDate: '2026-03-15',
    status: 'overdue',
  },
  {
    id: 'BR003',
    studentName: 'John Doe',
    studentId: 'S001',
    bookId: 'B001',
    bookName: 'To Kill a Mockingbird',
    issueDate: '2026-02-20',
    returnDate: '2026-03-06',
    status: 'returned',
  },
  {
    id: 'BR004',
    studentName: 'Alice Johnson',
    studentId: 'S003',
    bookId: 'B004',
    bookName: 'Clean Code',
    issueDate: '2026-03-15',
    returnDate: '2026-03-29',
    status: 'pending',
  },
];

export const mockStudents: Student[] = [
  {
    id: 'S001',
    name: 'John Doe',
    email: 'john.doe@university.edu',
    booksBorrowed: 2,
  },
  {
    id: 'S002',
    name: 'Jane Smith',
    email: 'jane.smith@university.edu',
    booksBorrowed: 1,
  },
  {
    id: 'S003',
    name: 'Alice Johnson',
    email: 'alice.johnson@university.edu',
    booksBorrowed: 1,
  },
  {
    id: 'S004',
    name: 'Bob Williams',
    email: 'bob.williams@university.edu',
    booksBorrowed: 0,
  },
  {
    id: 'S005',
    name: 'Emma Davis',
    email: 'emma.davis@university.edu',
    booksBorrowed: 0,
  },
];
