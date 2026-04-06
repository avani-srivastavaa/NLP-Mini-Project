# 📚 Library Management System with Advanced Analytics

A comprehensive library management system built with FastAPI (backend) and React + Vite (frontend), featuring real-time analytics dashboard with AI-powered search and intelligent recommendations.

## 🎓 Academic Project Details

**Course:** Natural Language Processing (NLP)
**Class:** Semester VI (Third Year Engineering)
**College:** Pillai College of Engineering
**Official Website:** [https://www.pce.ac.in/](https://www.pce.ac.in/)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)
```bash
# Double-click the start_servers.bat file in the project root
start_servers.bat
```

### Option 2: Manual Setup
```bash
# Terminal 1: Start Backend
cd backend_new
pip install -r requirements.txt
python -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Terminal 2: Start Frontend
cd frontend
npm install
npm run dev
```

## 📊 Advanced Analytics Dashboard

### 🎯 Key Metrics Displayed
- **Active Users**: Total registered students (300+)
- **Total Books**: Complete library collection (310 books)
- **Currently Borrowed**: Active book loans
- **Overdue Books**: Books needing attention
- **Return Rate**: On-time return percentage
- **Total Borrows**: All-time transactions (200+)
- **Daily Average**: Average borrows per day

### 📈 Interactive Charts & Visualizations
1. **Borrowing Trends**: Area chart showing daily borrowing patterns (last 7 days)
2. **Popular Subjects**: Pie chart of department-wise book popularity
3. **Most Borrowed Books**: Horizontal bar chart of top borrowed titles
4. **Most Searched Books**: AI semantic search analytics with rankings
5. **Student Distribution**: Department-wise student enrollment statistics
6. **Recent Activity**: Real-time borrow/return activity feed

## 🧠 AI-Powered Features

### Semantic Search Engine
- **NLP Integration**: Uses sentence embeddings for intelligent book matching
- **Fuzzy Matching**: Supports approximate and relevance-based search
- **Search Analytics**: Logs and analyzes search patterns for insights
- **Smart Recommendations**: Context-aware book suggestions

### Intelligent Analytics
- **Real-time Processing**: Live data aggregation and visualization
- **Trend Detection**: Automated pattern recognition in borrowing behavior
- **Department Insights**: Subject-wise popularity analysis
- **Usage Pattern Analysis**: Student behavior and preferences tracking

## 🔧 API Endpoints

### Core Library Operations
- `GET /` - System health check
- `POST /student-register` - Register new students
- `POST /student-login` - Student authentication
- `GET /books` - Retrieve complete book catalog
- `PUT /borrow/{book_id}` - Process book borrowing
- `PUT /return/{book_id}` - Handle book returns
- `GET /search?q=query` - AI-powered semantic search

### Analytics & Insights
- `GET /analytics` - Comprehensive analytics data (enhanced)
- `GET /borrow-history` - Individual student transaction history

## 🎨 Frontend Features

### Admin Dashboard
- **📊 Analytics Tab**: Real-time insights with interactive charts
- **📚 Books Management**: Complete CRUD operations for library catalog
- **📋 Borrow Records**: Transaction tracking and management
- **👥 Student Directory**: User account administration
- **🎯 Overview**: System statistics and quick actions

### Student Interface
- **🔍 Smart Search**: AI-powered book discovery
- **📖 Book Browsing**: Intuitive catalog navigation
- **📚 Personal History**: Individual borrow records
- **👤 Account Management**: Profile and preferences

## 📊 Data Architecture

### SQL Data Sources (datasets) — Includes Books, Users, Borrowed_books, and Review tables with catalog, user data, borrowing history, and feedback records.
- `books-final.csv` - Complete book catalog with metadata (310 books)
- `students-final.csv` - Student registration data (300+ students)
- `borrowing_history-final.csv` - Historical transaction records
- review-final.csv – User reviews and ratings for books


### SQLite Database Schema
- **Students Table**: User accounts and departmental information
- **Books Table**: Digital catalog with embeddings
- **Borrow Records**: Complete transaction history with timestamps
- **Search Logs**: AI search analytics and query tracking

## 🛠️ Technology Stack

### Backend (FastAPI)
- **FastAPI**: High-performance async web framework
- **SQLAlchemy**: Advanced ORM for database operations
- **SQLite**: Lightweight, file-based database
- **Pandas**: Data processing and CSV manipulation
- **Sentence Transformers**: AI-powered text embeddings for NLP

### Frontend (React + Vite)
- **React 18**: Modern component-based UI framework
- **Vite**: Lightning-fast build tool and development server
- **TypeScript**: Type-safe JavaScript for robust development
- **Tailwind CSS**: Utility-first styling system
- **Recharts**: Interactive data visualization library
- **Lucide Icons**: Beautiful and consistent iconography

## 📈 Analytics Data Pipeline

1. **Data Ingestion**: Real-time user interactions and system events
2. **Processing Layer**: SQL aggregation and metric calculations
3. **Visualization Layer**: React components with interactive charts
4. **Refresh Mechanism**: Automatic data updates on dashboard access

## 🎯 Usage Examples

### Access Analytics Dashboard
```javascript
// Automatic data fetching in React component
useEffect(() => {
  fetch("http://localhost:8000/analytics")
    .then(res => res.json())
    .then(data => setAnalyticsData(data))
    .catch(error => console.error("Analytics error:", error));
}, []);
```

### Student Registration
```javascript
const newStudent = {
  name: "Arjun Gupta",
  admission_no: "2025CS1000",
  department: "Computer Science",
  password: "secure_password_123"
};

fetch("http://localhost:8000/student-register", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(newStudent)
});
```

### AI-Powered Book Search
```javascript
// Semantic search with NLP
const searchQuery = "machine learning algorithms";
fetch(`http://localhost:8000/search?q=${encodeURIComponent(searchQuery)}`)
  .then(res => res.json())
  .then(results => {
    // Results ranked by semantic similarity
    console.log("AI Search Results:", results);
  });
```

## 🚨 Troubleshooting Guide

### Backend Server Issues
```bash
# Check port availability
netstat -ano | findstr :8000

# Terminate conflicting processes
taskkill /PID <PROCESS_ID> /F

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall
```

### Frontend Development Issues
```bash
# Clear cache and node modules
cd frontend
rm -rf node_modules package-lock.json .vite

# Fresh installation
npm install
npm run dev
```

### Database Reset
```bash
# Remove and recreate database
cd backend_new
del library.db
python -c "from database import engine; from models import Base; Base.metadata.create_all(bind=engine)"

# Repopulate sample data
python populate_data.py
```

## 📊 Performance Metrics

✅ **300+ Active Students** registered
✅ **310 Books** in digital catalog
✅ **200+ Transactions** processed
✅ **Real-time Analytics** with live updates
✅ **AI-Powered Search** with semantic matching
✅ **Interactive Charts** using Recharts
✅ **Responsive Design** for all devices
✅ **RESTful API** with comprehensive endpoints

## 🎉 Key Achievements

- **🤖 AI Integration**: NLP-based semantic search and recommendations
- **📊 Advanced Analytics**: Real-time dashboard with multiple chart types
- **🎨 Modern UI/UX**: Responsive design with dark mode support
- **⚡ High Performance**: FastAPI backend with async operations
- **🔒 Secure Authentication**: Student registration and login system
- **📱 Cross-Platform**: Works on desktop and mobile devices

---

**🚀 Ready to explore your intelligent library system?**

**Access URLs:**
- **Frontend:** `http://localhost:5176`
- **Backend API:** `http://localhost:8000`
- **API Documentation:** `http://localhost:8000/docs`
- **Analytics Data:** `http://localhost:8000/analytics`

**Navigation:** Frontend → Admin Login → Dashboard → Analytics Tab

**🎯 Experience AI-powered library management with comprehensive analytics!**
* Description
* Category
* Author

This data is processed using NLP techniques to recommend similar books.



## ⚙️ Installation

Steps to run the project:

```bash
git clone https://github.com/tejashree-pawar/nlp-mini-project.git
cd nlp-mini-project
```

### Install Backend Dependencies

```bash
cd backend
pip install -r requirements.txt
```

### Install Frontend Dependencies

```bash
cd ../frontend
npm install
```



## ▶️ Usage

How to run the project:

### Start Backend

```bash
cd backend
uvicorn app.main:app --reload
```

### Start Frontend

```bash
cd frontend
npm run dev
```

### Access the Application

Open in browser:
http://localhost:5173



## 📈 Results

* Users can log in and access the system
* Books can be viewed and borrowed easily
* NLP-based recommendation system suggests similar books
* Improved search and discovery experience



## 🎥 Demo Video

[Add your YouTube link here]



## 👥 Team Members

* Sumit Roy
* Avani Shrivastava
* Parth Patil
* Sarth Patil
* Veena Patil
* Abinraj Punnakkaparambil
* Tejashree Pawar
* Vedant Salve
* Keerthana Sambhu
* Aditya Shinde
* Jayesh Sonar
* Nihar Sudheer
* Vishal Singh

## 📚 References

* Scikit-learn Documentation
* FastAPI Documentation
* React Documentation
* Firebase Documentation
* NLP Tutorials
* HyDE: Hypothetical Document Embedding




