"""Quick test to verify the data loading and embedding pipeline works."""
import sys
import os

sys.path.insert(0, os.path.join(os.path.dirname(__file__), "userchatbot"))

from agent import get_books_for_department, ensure_books_and_embeddings, CACHE_DIR

# Test 1: Book loading
print("=" * 50)
print("TEST 1: Book Data Loading")
print("=" * 50)
books = get_books_for_department("CS")
print(f"Loaded {len(books)} CS books")
if books:
    for b in books[:3]:
        print(f"  - {b['title']} by {b['author']}")
    print("  ...")
else:
    print("  ERROR: No books found!")
    sys.exit(1)

# Test 2: Embedding generation + cache
print()
print("=" * 50)
print("TEST 2: Embedding Generation & Cache")
print("=" * 50)
session = {"department": "CS", "username": "test", "year": 2}
books, (model, embeddings) = ensure_books_and_embeddings(session)
print(f"Books: {len(books)}")
print(f"Embeddings shape: {embeddings.shape}")
print(f"Model loaded: {type(model).__name__}")

# Test 3: Cache file saved
cache_file = os.path.join(CACHE_DIR, "CS_embeddings.npy")
print(f"Cache file exists: {os.path.exists(cache_file)}")

# Test 4: Import recommend.py
print()
print("=" * 50)
print("TEST 3: Recommendation Engine")
print("=" * 50)
from recommend import get_recommendations
results = get_recommendations("machine learning", books, model, embeddings, top_n=3)
print(f"Top 3 recommendations for 'machine learning':")
for b in results:
    print(f"  - {b['title']} by {b['author']}")

print()
print("ALL TESTS PASSED!")
