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
QUERY_EXPANSIONS = {
    "jee": "jee engineering entrance iit entrance exam physics chemistry mathematics",
    "jee mains": "jee mains engineering entrance exam physics chemistry maths",
    "neet": "neet medical entrance biology physics chemistry",
    "upsc": "upsc civil services india history geography politics economics",
    "gate": "gate engineering exam preparation",
}


def expand_query(query):
    """
    Expands user query with predefined keywords to improve search results.
    If the query contains keywords like 'jee', 'neet', etc., appends related terms.
    
    Example: "jee" -> "jee jee engineering entrance iit entrance exam..."
    """
    q = query.lower()
    for key in QUERY_EXPANSIONS:
        if key in q:
            q += " " + QUERY_EXPANSIONS[key]
    return q


# ============================================================================
# DEPARTMENT & YEAR SELECTION
# ============================================================================
def select_department_and_year():
    """
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
    
    # Get department selection
    while True:
        try:
            dept_choice = int(input("\nEnter department number (1-7): "))
            if 1 <= dept_choice <= len(AVAILABLE_DEPARTMENTS):
                selected_department = AVAILABLE_DEPARTMENTS[dept_choice - 1]
                break
            else:
                print(f"Please enter a number between 1 and {len(AVAILABLE_DEPARTMENTS)}")
        except ValueError:
            print("Invalid input. Please enter a number.")
    
    print(f"\n✓ Selected Department: {selected_department.upper()}")
    
    # Get year (optional)
    year = input("Enter your academic year (1/2/3/4) or press Enter to skip: ").strip()
    if year and year.isdigit():
        year = int(year)
    else:
        year = None
    
    return selected_department, year


# ============================================================================
# LOAD DEPARTMENT-SPECIFIC BOOKS
# ============================================================================
def get_books_for_department(department):
    """
    Loads books from the department-specific CSV file.
    This is called AFTER user selects their department, ensuring fast data loading.
    
    Parameters:
        department (str): Name of the department (e.g., "cs", "auto", "mech")
    
    Returns:
        list: List of book dictionaries with keys:
              - title: Book name
              - author: Author name
              - price: Book price
              - rating: Rating count/popularity
              - release_year: Year of publication
              - search_blob: Lowercase combined title + author for searching
    """
    # Construct the path to the department CSV file
    base_path = os.path.join(
        os.path.dirname(__file__),
        "..",
        "datasets",
        "department_books"
    )
    csv_path = os.path.join(base_path, f"{department}_books.csv")
    
    # Check if file exists
    if not os.path.exists(csv_path):
        print(f"✗ Error: CSV file not found at {csv_path}")
        return []
    
    print(f"\n📚 Loading books from department: {department.upper()}")
    print(f"   Reading from: {csv_path}")
    
    # Read the CSV file
    df = pd.read_csv(csv_path)
    print(f"   Total books in {department} dataset: {len(df)}")
    
    books = []
    
    # Process each row in the CSV
    for _, row in df.iterrows():
        # Extract title (using "Title" column from department CSV)
        title = str(row.get("Title", "Unknown"))
        author = str(row.get("Author", "Unknown"))
        
        # Extract available copies (as popularity metric)
        available_copies = int(row.get("Available_Copies", 0))
        total_copies = int(row.get("Total_Copies", 0))
        
        # Use available copies as a proxy for popularity/rating
        rating_value = available_copies if available_copies > 0 else total_copies
        
        # Set release year to current year if not available
        year = 2026
        
        # Create a searchable text blob combining title and author (lowercase for matching)
        search_blob = f"{title} {author}".lower()
        
        # Store book information
        books.append({
            "title": title,
            "author": author,
            "price": "N/A",  # No price info in this CSV
            "rating": rating_value,
            "release_year": year,
            "search_blob": search_blob
        })
    
    return books


# ============================================================================
# EMBEDDING MODEL INITIALIZATION (called AFTER department selection)
# ============================================================================
def initialize_embeddings(books):
    """
    Loads the embedding model and generates semantic embeddings for books.
    This function is called AFTER department selection to ensure:
    1. Fast startup (no embeddings generated until user selects department)
    2. Efficiency (only embedding relevant books for that department)
    3. Memory efficiency (smaller embeddings for smaller subsets)
    
    Parameters:
        books (list): List of book dictionaries from get_books_for_department()
    
    Returns:
        tuple: (embedding_model, book_embeddings)
                - embedding_model: SentenceTransformer instance for encoding new queries
                - book_embeddings: Precomputed embeddings for all books in the subset
    """
    print("\n" + "-"*60)
    print("INITIALIZING EMBEDDING MODEL FOR SEMANTIC SEARCH")
    print("-"*60)
    
    print("📥 Loading embedding model (all-MiniLM-L6-v2)...")
    embedding_model = SentenceTransformer("all-MiniLM-L6-v2")
    
    print(f"🔄 Generating embeddings for {len(books)} books...")
    book_texts = [b["search_blob"] for b in books]
    book_embeddings = embedding_model.encode(book_texts, show_progress_bar=True)
    
    print("✓ Embeddings generated successfully.")
    print("-"*60 + "\n")
    
    return embedding_model, book_embeddings


# ============================================================================
# NLP FILTER ENGINE (semantic search with scoring heuristics)
# ============================================================================
def nlp_filter_books(user_prompt, books, embedding_model, book_embeddings, top_n=60):
    """
    Filters books using semantic similarity and multiple scoring heuristics.
    
    Process:
    1. Expands user query with predefined keywords for better matching
    2. Encodes expanded query into semantic embedding
    3. Calculates cosine similarity between query embedding and all book embeddings
    4. Scores each book based on:
       - Semantic similarity (85% weight): How contextually relevant is the book?
       - Popularity (10% weight): How many times has it been rated/reviewed?
       - Recency (5% weight): How recent is the publication?
       - Keyword bonus: Does the exact query appear in title/author? (+0.25)
    5. Returns top N books sorted by combined score
    
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
        rating = book["rating"]
        popularity_score = math.log1p(rating)  # log1p handles 0 gracefully
        
        # Factor 3: Recency score (5% weight)
        # Recent books might be more relevant than older ones
        year = book["release_year"]
        recency_score = year / 2025 if year else 0  # Normalize to 0-1 range
        
        # Factor 4: Exact keyword match bonus
        # If the user's exact query appears in book title/author, boost score
        keyword_bonus = 0
        if query_lower in book["search_blob"]:
            keyword_bonus += 0.25  # Add 25% bonus for exact match
        
        # Combine all factors into final score
        final_score = (
            0.85 * similarity_score +       # Semantic relevance
            0.10 * popularity_score +        # Popularity/rating
            0.05 * recency_score +           # Recency
            keyword_bonus                    # Exact match
        )
        
        scored_books.append((final_score, book))
    
    # Step 5: Sort books by final score (highest first)
    scored_books.sort(reverse=True, key=lambda x: x[0])
    
    # Extract top N books (return only the book dict, not the score)
    top_books = [book for _, book in scored_books[:top_n]]
    
    return top_books


# ============================================================================
# MODEL RECOMMENDATION (AI-powered book suggestion)
# ============================================================================
def model_recommendation(user_prompt, filtered_books):
    """
    Uses Google Gemini AI to generate intelligent book recommendations.
    The AI only sees books from the pre-filtered department dataset.
    
    Process:
    1. Initialize Gemini client with API key
    2. Format filtered books into a readable context for AI
    3. Configure Gemini with strict rules (only recommend from provided books)
    4. Send user prompt and available books to Gemini
    5. Gemini analyzes and returns recommendations with explanations
    
    Parameters:
        user_prompt (str): User's book search request
        filtered_books (list): Pre-filtered books to choose recommendations from
    """
    # Step 1: Initialize Gemini client (done at function call time to ensure API key is loaded)
    try:
        api_key = os.getenv("GEMINI_API_KEY")
        if not api_key:
            print("✗ Error: GEMINI_API_KEY environment variable not found.")
            print("   Please set it: $env:GEMINI_API_KEY = 'your-key-here'")
            print("   Or refer to: https://ai.google.dev/gemini-api/docs/api-key")
            return
        
        client = genai.Client(api_key=api_key)
        MODEL_ID = "gemini-2.5-flash"
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
    
    This design ensures:
    - Fast startup (no heavy computations until user selects department)
    - Efficient memory usage (only embedding relevant books)
    - Scalability (works well for large datasets)
    - Better recommendations (department-specific context)
    """
    # Step 1: Get user's department and year preference
    selected_dept, selected_year = select_department_and_year()
    
    # Step 2: Load books ONLY for the selected department
    BOOKS = get_books_for_department(selected_dept)
    
    if not BOOKS:
        print("✗ No books found for this department. Exiting.")
        return
    
    print(f"\n✓ Dataset loaded successfully: {len(BOOKS)} books available")
    
    # Step 3: Initialize embedding model and generate embeddings
    # This is now AFTER department selection for efficiency
    embedding_model, book_embeddings = initialize_embeddings(BOOKS)
    
    # Step 4: Start the interactive chat loop
    print("\n" + "="*60)
    print("BOOK RECOMMENDATION CHATBOT")
    print("="*60)
    print("\nCommands:")
    print("  - Ask for any book or topic to get recommendations")
    print("  - Type 'change-department' to select a different department")
    print("  - Type 'exit' or 'quit' to leave\n")
    
    while True:
        user_input = input("📖 What kind of book are you looking for? ").strip()
        
        # Allow user to exit
        if user_input.lower() in ["exit", "quit"]:
            print("\n👋 Goodbye! Thank you for using the Book Recommendation Chatbot.")
            break
        
        # Allow user to change department
        if user_input.lower() == "change-department":
            print("\n🔄 Restarting department selection...")
            main()
            return
        
        # Skip empty inputs
        if not user_input:
            print("⚠️  Please enter a valid search query.")
            continue
        
        # Filter books using NLP and semantic similarity
        print("\n🔍 Searching and filtering books...")
        filtered_books = nlp_filter_books(user_input, BOOKS, embedding_model, book_embeddings)
        
        if not filtered_books:
            print("✗ No books found matching your query.")
            continue
        
        print(f"✓ Found {len(filtered_books)} matching books. Generating recommendations...\n")
        
        # Get recommendations from Gemini AI
        model_recommendation(user_input, filtered_books)


# ============================================================================
# START THE CHATBOT
# ============================================================================
if __name__ == "__main__":
    main()
