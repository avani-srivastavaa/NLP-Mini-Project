import os
import pandas as pd
from datetime import datetime
from google import genai
from google.genai import types


# MAIN HANDLER
def handle_borrow_return(session, user_message):

    try:
        books_file = session["files"]["books"]
        borrow_file = session["borrow_file"]
        username = session["username"]

        books_df = pd.read_csv(books_file)
        history_df = pd.read_csv(borrow_file)

        # Prepare dataset for Gemini
        books_text = "\n".join([
            f"{row['Book_ID']} | {row['Title']} | Available: {row['Available_Copies']}"
            for _, row in books_df.iterrows()
        ])

        user_history = history_df[
            (history_df["Name"] == username) &
            (history_df["Return_Date"].isna() | (history_df["Return_Date"] == ""))
        ]

        history_text = "\n".join([
            f"{row['Book_ID']} | {row['Book_Title']}"
            for _, row in user_history.iterrows()
        ]) or "None"


        # GEMINI PROMPT
        system_instruction = f"""
You are a STRICT library transaction engine.

IMPORTANT RULES:
- You MUST ONLY choose Book_ID from the provided dataset
- DO NOT invent Book_IDs
- DO NOT modify titles
- If unsure, return ERROR

Available Books:
{books_text}

User Borrowed Books:
{history_text}

User Request:
{user_message}

Respond ONLY in format:

ACTION:BORROW or RETURN
BOOK_ID:[exact id from list]

OR

ACTION:ERROR
MESSAGE:[reason]

NO extra text.
"""

        client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents="Process",
            config=types.GenerateContentConfig(
                system_instruction=system_instruction,
                temperature=0
            )
        )

        decision = response.text.strip()

        return execute_transaction(decision, session, books_df, history_df, books_file, borrow_file)

    except Exception as e:
        return f"Error: {str(e)}"


# EXECUTION (STRICT VALIDATION)
def execute_transaction(decision, session, books_df, history_df, books_file, borrow_file):

    try:
        lines = decision.split("\n")
        data = {}

        for line in lines:
            if ":" in line:
                key, value = line.split(":", 1)
                data[key.strip()] = value.strip()

        action = data.get("ACTION")
        book_id = data.get("BOOK_ID")

        if action == "ERROR":
            return data.get("MESSAGE", "Invalid request.")


        # HARD VALIDATION
        if book_id not in books_df["Book_ID"].values:
            return "Invalid book selection. Please try again."

        book_row = books_df[books_df["Book_ID"] == book_id].iloc[0]
        book_title = book_row["Title"]

        if action == "BORROW":
            return execute_borrow(session, book_id, book_title, books_df, history_df, books_file, borrow_file)

        elif action == "RETURN":
            return execute_return(session, book_id, book_title, books_df, history_df, books_file, borrow_file)

        else:
            return "Unknown action."

    except Exception as e:
        return f"Execution error: {str(e)}"


# BORROW EXECUTION
def execute_borrow(session, book_id, book_title, books_df, history_df, books_file, borrow_file):

    username = session["username"]

    # Prevent duplicate borrow
    already_borrowed = history_df[
        (history_df["Name"] == username) &
        (history_df["Book_ID"] == book_id) &
        (history_df["Return_Date"].isna() | (history_df["Return_Date"] == ""))
    ]

    if not already_borrowed.empty:
        return f"You already borrowed '{book_title}'."

    book_idx = books_df[books_df["Book_ID"] == book_id].index[0]

    if books_df.loc[book_idx, "Available_Copies"] <= 0:
        return f"'{book_title}' is not available."

    # Update
    books_df.loc[book_idx, "Available_Copies"] -= 1

    new_entry = {
        "Name": username,
        "Admission_Number": "N/A",
        "Book_ID": book_id,
        "Book_Title": book_title,
        "Issue_Date": datetime.now().strftime("%Y-%m-%d"),
        "Return_Date": "",
        "Days_Due": 7
    }

    history_df = pd.concat([history_df, pd.DataFrame([new_entry])], ignore_index=True)

    # SAVE (disabled for now)
    # books_df.to_csv(books_file, index=False)
    # history_df.to_csv(borrow_file, index=False)
    # TODO: Update in DB/CSV

    return f"Borrow successful: '{book_title}'"


# RETURN EXECUTION
def execute_return(session, book_id, book_title, books_df, history_df, books_file, borrow_file):

    username = session["username"]

    active = history_df[
        (history_df["Name"] == username) &
        (history_df["Book_ID"] == book_id) &
        (history_df["Return_Date"].isna() | (history_df["Return_Date"] == ""))
    ]

    if active.empty:
        return f"You have not borrowed '{book_title}'."

    record_idx = active.index[0]

    history_df.loc[record_idx, "Return_Date"] = datetime.now().strftime("%Y-%m-%d")

    book_idx = books_df[books_df["Book_ID"] == book_id].index[0]
    books_df.loc[book_idx, "Available_Copies"] += 1

    # SAVE (disabled)
    # books_df.to_csv(books_file, index=False)
    # history_df.to_csv(borrow_file, index=False)
    # TODO: Update in DB/CSV

    return f"Return successful: '{book_title}'"