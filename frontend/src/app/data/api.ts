const BASE_URL = "http://127.0.0.1:8000";

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
  const url = `${BASE_URL}/chat`;
  const payload = { session_id: sessionId, message };
  console.log("[sendChatMessage] Sending POST to:", url);
  console.log("[sendChatMessage] Payload:", payload);
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  console.log("[sendChatMessage] Response status:", res.status);
  if (!res.ok) {
    let err;
    try {
      err = await res.json();
    } catch (e) {
      err = { detail: "Unknown error" };
    }
    console.error("[sendChatMessage] Error response:", err);
    throw new Error(err.detail ?? "Chat failed");
  }
  const data = await res.json();
  console.log("[sendChatMessage] Response data:", data);
  return data; // { response: string }
}

