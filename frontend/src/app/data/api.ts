const BASE_URL = "http://localhost:8000";

export async function loginUser(idToken: string) {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id_token: idToken }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Login failed");
  }
  return res.json(); // { email, name, role }
}

export async function sendChatMessage(sessionId: string, message: string) {
  const res = await fetch(`${BASE_URL}/chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, message }),
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.detail ?? "Chat failed");
  }
  return res.json(); // { response: string }
}

