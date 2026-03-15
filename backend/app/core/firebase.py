import firebase_admin
from firebase_admin import credentials, firestore, auth

db = None
def test_db():
    global db
    try:
        if not firebase_admin._apps:
            cred = credentials.Certificate("app/credentials/firebase_key.json")
            firebase_admin.initialize_app(cred)
        if db is None:
            db = firestore.client()
        return db

    except Exception as e:
        print(f"Firebase connection error: {e}")
        return None

def verify_firebase_token(token: str):
    return auth.verify_id_token(token)