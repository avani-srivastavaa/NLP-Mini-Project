import joblib
import pandas as pd
from fastapi import APIRouter

# Load model once
router = APIRouter(prefix="/predict", tags=["Predict"])
model = joblib.load("app/routes/overdue_model.pkl")


df = pd.read_csv("../datasets/borrowing_history_fixed.csv")
df["Issue_Date"] = pd.to_datetime(df["Issue_Date"])
df["Return_Date"] = pd.to_datetime(df["Return_Date"])
df["Due_Date"] = df["Issue_Date"] + pd.to_timedelta(df["Days_Due"], unit="D")
df["Overdue"] = (df["Return_Date"] > df["Due_Date"]).astype(int)
df = df.sort_values(by=["Admission_Number", "Issue_Date"])
df["Borrow_Duration"] = (df["Return_Date"] - df["Issue_Date"]).dt.days
def build_features(admission_number, book_id, days_due):
    user_df = df[df["Admission_Number"] == admission_number]
    past_overdue = user_df["Overdue"].sum()
    past_borrow = len(user_df)
    risk_score = past_overdue / (past_borrow + 1)
    overdue_ratio = user_df["Overdue"].mean() if past_borrow > 0 else 0
    recent = user_df["Overdue"].tail(3).mean() if past_borrow > 0 else 0
    if past_borrow > 1:
        gaps = user_df["Issue_Date"].diff().dt.days
        gap_days = gaps.mean()
    else:
        gap_days = 0
    book_df = df[df["Book_ID"] == book_id]
    book_risk = book_df["Overdue"].mean() if len(book_df) > 0 else 0
    due_pressure = 1 / (days_due + 1)
    return {
        "Days_Due": days_due,
        "Past_Overdue_Count": past_overdue,
        "Past_Borrow_Count": past_borrow,
        "Risk_Score": risk_score,
        "Overdue_Ratio": overdue_ratio,
        "Recent_Overdue": recent,
        "Gap_Days": gap_days,
        "Book_Risk": book_risk,
        "Due_Pressure": due_pressure
    }
    
@router.post("/overdue")
def predict_overdue(data: dict):
    features = build_features(
        data["Admission_Number"],
        data["Book_ID"],
        data["Days_Due"]
    )
    features_df = pd.DataFrame([features])
    probability = model.predict_proba(features_df)[0][1]    
    return {
        "overdue_probability": float(probability)
    }

@router.get("/borrow_analysis")
def borrow_analysis():
    most_borrowed = df["Book_Title"].value_counts().head(10).to_dict()
    top_students = df["Admission_Number"].value_counts().head(10).to_dict()
    avg_duration = float(df["Borrow_Duration"].mean())
    overdue_rate = float(df["Overdue"].mean())
    return {
        "most_borrowed_books": most_borrowed,
        "top_students": top_students,
        "average_borrow_duration": avg_duration,
        "overdue_rate": overdue_rate
    }