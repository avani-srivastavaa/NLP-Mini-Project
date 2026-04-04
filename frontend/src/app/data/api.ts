const BASE_URL = "http://127.0.0.1:8001";

// Google Firebase Login
export async function loginWithGoogle(idToken: string) {
  const res = await fetch(`${BASE_URL}/auth/google-login`, { // Updated path for clarity
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


