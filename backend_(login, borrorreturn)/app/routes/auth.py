from fastapi import APIRouter,HTTPException
from firebase_admin import auth
from pydantic import BaseModel
from app.core.firebase import test_db

router = APIRouter(prefix="/auth",tags=["Authentication"])

class TokenRequest(BaseModel):
    id_token: str

@router.post("/login")
def user_login(token: TokenRequest):
    try:
        decoded_token = auth.verify_id_token(token.id_token)
        email = decoded_token.get("email")
        name = decoded_token.get("name")
        uid = decoded_token.get("uid")

        if email.endswith("@student.mes.ac.in"):
            role = "student"

        elif email.endswith("@mes.ac.in") or email == "parthpatil5012@gmail.com":
            role = "librarian"

        else:
            raise HTTPException(
                status_code=403,
                detail="Only MES accounts allowed"
            )
        db = test_db()
        user_ref = db.collection("users").document(uid)
        user = user_ref.get()
        if not user.exists:
            user_ref.set({
                "email": email,
                "name": name,
                "role": role
            })
        return {
            "message": "login successful",
            "email": email,
            "name": name,
            "role": role
        }
    except Exception as e:
        raise HTTPException(status_code=401,detail=f"Invalid authentication token:{str(e)}")