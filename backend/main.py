from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.app.core.database import engine, Base

# Import Routers
from backend.app.api.auth import router as auth_router
from backend.app.api.auth_firebase import router as auth_firebase_router
from backend.app.api.library import router as library_router
from backend.app.api.analytics import router as analytics_router
from backend.app.api.chatbot import router as chatbot_router
from backend.app.services.prediction import router as prediction_router
from backend.app.api.sockets import router as sockets_router

# Create Database tables
Base.metadata.create_all(bind=engine)

# Initialize Firebase
from backend.app.core.firebase import test_db
test_db()

app = FastAPI(title="Library Management System & AI Chatbot", version="1.0")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def home():
    return {"message": "Consolidated Library Backend Running"}

# Include Routers
app.include_router(auth_router)
app.include_router(auth_firebase_router)
app.include_router(library_router)
app.include_router(analytics_router)
app.include_router(chatbot_router)
app.include_router(prediction_router)
app.include_router(sockets_router)
