// Mock data for the Library Management System

export interface Book {
  id: string;
  title: string;
  author: string;
  department: string;
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

const coverAoa = new URL('../assets/images/Books/SY COMP/AOA.jpg', import.meta.url).href;
const coverCgvr = new URL('../assets/images/Books/SY COMP/CGVR (2).jpg', import.meta.url).href;
const coverCoa = new URL('../assets/images/Books/SY COMP/COA.jpg', import.meta.url).href;
const coverDlca = new URL('../assets/images/Books/SY COMP/DLCA.jpg', import.meta.url).href;
const coverMaths3 = new URL('../assets/images/Books/SY COMP/Maths 3.jpg', import.meta.url).href;
const coverMaths4 = new URL('../assets/images/Books/SY COMP/Maths 4.jpg', import.meta.url).href;
const coverDbms = new URL('../assets/images/Books/SY IT/DBMS.jpg', import.meta.url).href;
const coverDsa = new URL('../assets/images/Books/SY IT/DSA.jpg', import.meta.url).href;
const coverDspEcs = new URL('../assets/images/Books/SY ECS/DSP ECS.jpg', import.meta.url).href;
const coverVlsiEcs = new URL('../assets/images/Books/SY ECS/VLSI ECS.jpg', import.meta.url).href;
const coverCtnExtc = new URL('../assets/images/Books/SY EXTC/CTN EXTC.jpg', import.meta.url).href;
const coverDsdExtc = new URL('../assets/images/Books/SY EXTC/DSD EXTC.jpg', import.meta.url).href;
const coverEdacExtc = new URL('../assets/images/Books/SY EXTC/EDAC EXTC.jpg', import.meta.url).href;

export const mockBooks: Book[] = [
  {
    id: 'B001',
    title: 'Analysis and Design of Algorithms',
    author: 'Shefali Singhal, Neha Garg',
    department: 'COMP',
    coverUrl: coverAoa,
    available: true,
  },
  {
    id: 'B002',
    title: 'Computer Graphics',
    author: 'Sanjesh S. Pawale',
    department: 'COMP',
    coverUrl: coverCgvr,
    available: false,
  },
  {
    id: 'B003',
    title: 'Computer Architecture',
    author: 'A. P. Godse, Dr. Deepali A. Godse',
    department: 'COMP',
    coverUrl: coverCoa,
    available: true,
  },
  {
    id: 'B004',
    title: 'Digital Logic & Computer Organization & Architecture',
    author: 'Bharat Acharya, Shrikant Velankar, U. S. Shah',
    department: 'COMP',
    coverUrl: coverDlca,
    available: true,
  },
  {
    id: 'B005',
    title: 'Pure Mathematics 3 (Student Book)',
    author: 'Pearson Edexcel',
    department: 'COMP',
    coverUrl: coverMaths3,
    available: true,
  },
  {
    id: 'B006',
    title: 'Engineering Mathematics-IV',
    author: 'Dr. K.S.C.',
    department: 'COMP',
    coverUrl: coverMaths4,
    available: false,
  },
  {
    id: 'B007',
    title: 'Database Management Systems (DBMS): A Practical Approach',
    author: 'Dr. Rajiv Chopra',
    department: 'IT',
    coverUrl: coverDbms,
    available: true,
  },
  {
    id: 'B008',
    title: 'Data Structures and Algorithms',
    author: 'Alfred V. Aho, John E. Hopcroft, Jeffrey D. Ullman',
    department: 'IT',
    coverUrl: coverDsa,
    available: true,
  },
  {
    id: 'B009',
    title: 'Digital Signal Processing',
    author: 'Simon Haykin',
    department: 'ECS',
    coverUrl: coverDspEcs,
    available: true,
  },
  {
    id: 'B010',
    title: 'VLSI Design',
    author: 'Debapriya Choudhury',
    department: 'ECS',
    coverUrl: coverVlsiEcs,
    available: false,
  },
  {
    id: 'B011',
    title: 'Communication Theory and Networks',
    author: 'John G. Proakis',
    department: 'EXTC',
    coverUrl: coverCtnExtc,
    available: true,
  },
  {
    id: 'B012',
    title: 'Digital System Design',
    author: 'M. Morris Mano',
    department: 'EXTC',
    coverUrl: coverDsdExtc,
    available: true,
  },
  {
    id: 'B013',
    title: 'Electronic Devices and Circuits',
    author: 'Donald A. Neamen',
    department: 'EXTC',
    coverUrl: coverEdacExtc,
    available: false,
  },
];

export const mockBorrowRecords: BorrowRecord[] = [
  {
    id: 'BR001',
    studentName: 'John Doe',
    studentId: 'S001',
    bookId: 'B002',
    bookName: 'Computer Graphics',
    issueDate: '2026-03-10',
    returnDate: '2026-03-24',
    status: 'pending',
  },
  {
    id: 'BR002',
    studentName: 'Jane Smith',
    studentId: 'S002',
    bookId: 'B006',
    bookName: 'Engineering Mathematics-IV',
    issueDate: '2026-03-01',
    returnDate: '2026-03-15',
    status: 'overdue',
  },
  {
    id: 'BR003',
    studentName: 'John Doe',
    studentId: 'S001',
    bookId: 'B001',
    bookName: 'Analysis and Design of Algorithms',
    issueDate: '2026-02-20',
    returnDate: '2026-03-06',
    status: 'returned',
  },
  {
    id: 'BR004',
    studentName: 'Alice Johnson',
    studentId: 'S003',
    bookId: 'B004',
    bookName: 'Digital Logic & Computer Organization & Architecture',
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
