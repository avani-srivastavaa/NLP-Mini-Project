from fastapi import FastAPI
from app.core.firebase import test_db
from fastapi.responses import HTMLResponse
from app.routes import auth,borrow
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

firebase = test_db()
app.include_router(auth.router)
app.include_router(borrow.router)

@app.get("/",response_class=HTMLResponse)
def chalu_hogaya():
    if firebase:
        return "<h1>Backend running with firebase database things</h1>"
    return "<h1>Firebase me problem hai Backend chalu hai bhai</h1>"