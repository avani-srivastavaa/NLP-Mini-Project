import os
import math
import pandas as pd
from google import genai
from google.genai import types
from sentence_transformers import SentenceTransformer
from sklearn.metrics.pairwise import cosine_similarity


# ============================================================================
# DEPARTMENT SELECTION
# ============================================================================
# List of available departments based on CSV files in datasets/department_books/
AVAILABLE_DEPARTMENTS = [
    "auto",
    "cs",
    "ecs",
    "extc",
    "first year",
    "it",
    "mech"
]


# ============================================================================
# QUERY EXPANSION (improves search for known frequently used keywords)
# ============================================================================
# Dictionary of exam/topic keywords that are expanded for better semantic matching
    Prompts user to select their department and academic year at startup.
    This ensures embeddings are generated only for relevant books.
    
    Returns:
        tuple: (department, year) where department is a string and year is int or None
    """
    print("\n" + "="*60)
    print("WELCOME TO ENGINEERING COLLEGE BOOK RECOMMENDATION CHATBOT")
    print("="*60)
    
    print("\nPlease select your department:")
    for i, dept in enumerate(AVAILABLE_DEPARTMENTS, 1):
        print(f"{i}. {dept.upper()}")
    
    Parameters:
        user_prompt (str): User's search query
        books (list): List of book dictionaries from get_books_for_department()
        embedding_model: SentenceTransformer instance
        book_embeddings: Precomputed embeddings for all books
        top_n (int): Number of top results to return (default: 60)
    
    Returns:
        list: Top N books scored and sorted by relevance
    """
    # Step 1: Expand the user query with predefined keywords
    # Example: "jee" becomes "jee jee engineering entrance iit entrance..."
    expanded_query = expand_query(user_prompt)
    
    # Step 2: Create embedding for the expanded query
    query_embedding = embedding_model.encode([expanded_query])
    
    # Step 3: Calculate cosine similarity between query and all book embeddings
    # Returns array of similarity scores between 0 and 1
    similarities = cosine_similarity(query_embedding, book_embeddings)[0]
    
    scored_books = []
    query_lower = user_prompt.lower()
    
    # Step 4: Score each book based on multiple factors
    for idx, similarity_score in enumerate(similarities):
        book = books[idx]
        
        # Factor 1: Semantic similarity (85% weight)
        # This is how contextually relevant the book is to the query
        # similarity_score is already normalized between 0-1
        
        # Factor 2: Popularity score (10% weight)
        # Books with more ratings/reviews are likely more useful
        import numpy as np
        from sklearn.metrics.pairwise import cosine_similarity

        # --- NLP Filtering ---
        def nlp_filter_books(query, books, embeddings, model, top_n=60):
            """
            Filter books using semantic similarity, keyword match, and popularity.
            Returns top_n books most relevant to the query.
            """
            keywords = [
                "jee", "gate", "core", "reference", "novel", "fiction", "non-fiction", "project", "python", "java", "c++", "mathematics", "mechanics", "electronics", "data", "machine learning", "ai", "artificial intelligence", "network", "database", "cloud", "iot", "robotics", "design", "theory", "practice", "lab", "practical", "exam", "syllabus", "semester", "year", "author", "title", "subject"
            ]
            expanded_query = query + " " + " ".join([k for k in keywords if k in query.lower()])
            query_emb = model.encode([expanded_query])
            sims = cosine_similarity(query_emb, embeddings)[0]
            scores = []
            for i, book in enumerate(books):
                score = sims[i]
                score += float(book.get("rating", 0)) * 0.05
                if "year" in book and book["year"].isdigit():
                    score += int(book["year"]) * 0.001
                if any(k in book["search_blob"].lower() for k in keywords if k in query.lower()):
                    score += 0.1
                scores.append(score)
            top_idx = np.argsort(scores)[::-1][:top_n]
            filtered_books = [books[i] for i in top_idx]
            return filtered_books

        # --- AI-Powered Recommendation ---
        def model_recommendation(user_query, filtered_books, gemini_model):
            """
            Use Gemini AI to recommend up to 3 books from filtered_books for the user_query.
            Gemini is instructed to only recommend from the provided list.
            """
            book_list_str = "\n".join([f"{b['title']} by {b['author']}" for b in filtered_books])
            system_prompt = f"""
        You are a helpful library assistant. Only recommend books from the list below. Never invent book titles.
        If the query is unclear, ask for clarification.
        List of available books:\n{book_list_str}
        """
            prompt = f"User query: {user_query}\nRecommend up to 3 books with reasons."
            response = gemini_model.generate_content([system_prompt, prompt])
            return response.text.strip()
    except Exception as e:
        print(f"✗ Error initializing Gemini client: {e}")
        return
    
    # Step 2: Format books into a readable context for Gemini
    # Include title, author, rating count, and price for each book
    book_context = "\n".join([
        f"Title: {b['title']} | Author: {b['author']} | Rating_Count: {b['rating']} | Price: {b['price']}"
        for b in filtered_books
    ])
    
    # Step 3: Configure Gemini model with strict system instructions
    # These instructions ensure the AI:
    # - Only recommends books from the provided list
    # - Never invents book titles
    # - Limits recommendations to max 3 books
    # - Provides clear reasoning
    config = types.GenerateContentConfig(
        system_instruction="""You are an AI library assistant for an engineering college.

CRITICAL RULES:
1. You MUST only recommend books that appear in the provided dataset.
2. Never invent or suggest books NOT in the list.
3. If no book matches the request, reply: "Suitable book not found in library."

QUERY HANDLING:
• Understand user requirements (subject, exam, skill level, etc.)
• Break complex requests into smaller requirements if needed

RECOMMENDATION RULES:
1. First try to find ONE book that satisfies ALL requirements.
2. If different books satisfy different requirements, recommend up to 3 books.
3. Never recommend more than 3 books.

OUTPUT FORMAT:
Title:
Author:
Reason:

The reason must explain which part of the user's query the book addresses.""",
        temperature=0.6  # Balanced between creativity and consistency
    )
    
    # Step 4: Prepare the full prompt with user request and available books
    full_prompt = f"""
User Request:
{user_prompt}

Available Books (choose ONLY from these):

{book_context}"""
    
    try:
        # Step 5: Call Gemini API to generate recommendations
        print("\n🤖 AI is analyzing and recommending books...")
        response = client.models.generate_content(
            model=MODEL_ID,
            contents=full_prompt,
            config=config
        )
        
        print("\n" + "="*60)
        print("RECOMMENDED BOOKS:")
        print("="*60)
        print(response.text)
        
    except Exception as e:
        print(f"✗ Error calling Gemini API: {e}")


# ============================================================================
# MAIN CHATBOT ORCHESTRATION
# ============================================================================
def main():
    """
    Main function that orchestrates the entire chatbot workflow:
    
    Workflow:
    1. Ask user for department and year
    2. Load books from the department-specific CSV
    3. Generate embeddings ONLY for those books (efficient!)
    4. Start interactive chat loop for personalized recommendations
    5. Allow user to change department or exit
    
