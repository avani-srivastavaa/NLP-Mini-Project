const BASE_URL = "http://127.0.0.1:8000";

// Google Firebase Login
export async function loginWithGoogle(idToken: string) {
  const res = await fetch(`${BASE_URL}/auth/google/login`, { 
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Google Login failed");
  }
  return res.json(); // { message, user_id, admission_number, name, department, email, new_user }
}

// Manual Login with Admission Number & Password
export async function manualLogin(admission_number: string, password: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ admission_number, password }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Invalid credentials");
  }
  return res.json(); // { message, user_id, admission_number, name, department, email }
}

// Update User Profile
export async function updateUserProfile(admission_number: string, profileData: any) {
  const res = await fetch(`${BASE_URL}/auth/profile/${admission_number}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(profileData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Update failed");
  }
  return res.json();
}

// Get Currently Issued Books
export async function getUserActiveBorrows(admission_number: string) {
  const res = await fetch(`${BASE_URL}/user-active-borrows/${admission_number}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.active_borrows || data; // Backend returns { active_borrows: [] } or a list
}

// Get Full Borrow History
export async function getUserBorrowHistory(admission_number: string) {
  const res = await fetch(`${BASE_URL}/user-borrow-history/${admission_number}`);
  if (!res.ok) return [];
  const data = await res.json();
  return data.history || data;
}

// Get All Books from Catalog
export async function getBooks() {
  const res = await fetch(`${BASE_URL}/books`);
  if (!res.ok) return [];
  return res.json();
}

// Complete Google Profile (Dashboard Step 2)
export async function completeGoogleProfile(payload: any) {
  const res = await fetch(`${BASE_URL}/auth/google/complete-profile`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Profile completion failed");
  }
  return res.json();
}

// Create Credentials (Login Step 1)
export async function createGoogleCredentials(payload: { email: string, name: string, admission_number: string, password: string }) {
  const res = await fetch(`${BASE_URL}/auth/google/create-credentials`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to create credentials");
  }
  return res.json();
}

export async function sendChatMessage(sessionId: string, message: string, userId?: string, department?: string) {
  const url = `${BASE_URL}/chat`;
  const payload = { session_id: sessionId, message, user_id: userId, department: department };
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch (e) {
      err = { detail: "Unknown error" };
    }
    throw new Error(err.detail ?? "Chat failed");
  }
  return res.json(); // { response: string }
}

export async function initChatbot(sessionId: string, userId: string, department: string) {
  const url = `${BASE_URL}/chat/init`;
  const payload = { session_id: sessionId, user_id: userId, department: department };
  
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  
  if (!res.ok) return { status: "error" };
  return res.json();
}

// Submit a Book Review
export async function submitReview(book_id: string, user_id: string, review: string) {
  const res = await fetch(`${BASE_URL}/review`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ book_id, user_id, review }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to submit review");
  }
  return res.json();
}

// ═══════════════════════════════════════════════════════════════════════════════
// ADMIN API FUNCTIONS
// ═══════════════════════════════════════════════════════════════════════════════

export async function getAdminBorrowRecords() {
  const res = await fetch(`${BASE_URL}/admin/borrow-records`);
  if (!res.ok) return [];
  return res.json();
}

export async function getAdminStudents() {
  const res = await fetch(`${BASE_URL}/admin/students`);
  if (!res.ok) return [];
  return res.json();
}

export async function getStudentBorrowDetails(userId: string) {
  const res = await fetch(`${BASE_URL}/admin/student/${userId}/borrows`);
  if (!res.ok) return [];
  return res.json();
}

export async function addBook(bookData: {
  title: string;
  author: string;
  department: string;
  total_copies: number;
  available_copies?: number;
  column_dept?: string;
  shelf_no?: string;
  rack_no?: string;
}) {
  const res = await fetch(`${BASE_URL}/admin/books`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(bookData),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to add book");
  }
  return res.json();
}

export async function updateBookCopies(bookId: string, totalCopies: number) {
  const res = await fetch(`${BASE_URL}/admin/books/${bookId}/copies`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ total_copies: totalCopies }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to update copies");
  }
  return res.json();
}

export async function deleteBook(bookId: string) {
  const res = await fetch(`${BASE_URL}/admin/books/${bookId}`, {
    method: "DELETE",
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Failed to delete book");
  }
  return res.json();
}

