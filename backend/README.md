## Backend Structure

```
.
├── app
│   ├── core
│   │   └── database.py
│   └── main.py
├── .env
├── .gitignore
├── README.md
└── requirements.txt
```

## Setup

### 1. Clone the repository

```
git clone https://github.com/avani-srivastavaa/NLP-Mini-Project
cd NLP-Mini-Project/backend
```

### 2. Create a virtual environment

```
python -m venv venv
```

Activate it:

**Mac / Linux**

```
source venv/bin/activate
```

**Windows**

```
venv\Scripts\activate
```

---

### 3. Install dependencies

```
pip install -r requirements.txt
```

---

### 4. Create `.env`

Add your Supabase credentials if needed msg up

```
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

---

## Running the Server Locally

Start the server with:

```
uvicorn app.main:app --reload
```

The application should now be running locally.

---

## Notes

* Make sure `.env` is **not committed** to version control.
* The `.gitignore` already excludes sensitive files like `.env`.
