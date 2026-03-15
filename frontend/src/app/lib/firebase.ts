import { initializeApp, getApps } from "firebase/app";
import { getFirestore, collection, query, where, getDocs } from "firebase/firestore";

// ─────────────────────────────────────────────────────────────
//  🔧 REPLACE these placeholder values with your real Firebase
//     project config from:
//     Firebase Console → Project Settings → General → Your apps
// ─────────────────────────────────────────────────────────────
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID",
};

// Prevent duplicate app initialization in hot-reload environments
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);

// ─────────────────────────────────────────────────────────────
//  Firestore `users` collection expected document structure:
//
//  {
//    username: "admin",          ← unique login ID
//    password: "admin123",       ← plain text for demo only
//    role: "admin",              ← "admin" | "student"
//    name: "Administrator",
//  }
//  {
//    username: "STU2024",
//    password: "student123",
//    role: "student",
//    name: "John Doe",
//    class: "10-A",
//    department: "Science",
//    branch: "Physics",
//    year: "2024",
//  }
// ─────────────────────────────────────────────────────────────

export type UserRole = "admin" | "student";

export interface LibraUser {
  username: string;
  role: UserRole;
  name: string;
  [key: string]: string;
}

/** Returns the matched user or null. Falls back to demo data when Firebase isn't configured. */
export async function authenticateUser(
  username: string,
  password: string
): Promise<LibraUser | null> {
  const isPlaceholder = firebaseConfig.apiKey === "YOUR_API_KEY";

  // ── Demo / offline fallback (used when Firebase is not yet configured) ──
  if (isPlaceholder) {
    return mockAuth(username, password);
  }

  // ── Real Firestore lookup ──
  try {
    const usersRef = collection(db, "users");
    const q = query(usersRef, where("username", "==", username));
    const snapshot = await getDocs(q);

    if (snapshot.empty) return null;

    const doc = snapshot.docs[0];
    const data = doc.data();

    if (data.password !== password) return null;

    return {
      username: data.username,
      role: data.role as UserRole,
      name: data.name ?? username,
      ...data,
    };
  } catch (err) {
    console.error("Firebase auth error:", err);
    // Fall back to mock when Firestore is unreachable during development
    return mockAuth(username, password);
  }
}

// ── Mock users (demo only — remove when real Firebase is configured) ──
const MOCK_USERS: LibraUser[] = [
  { username: "admin", password: "admin123", role: "admin", name: "Administrator" } as any,
  {
    username: "STU2024",
    password: "student123",
    role: "student",
    name: "Alex Johnson",
    class: "10-A",
    department: "Science",
    branch: "Physics",
    year: "2024",
  } as any,
];

function mockAuth(username: string, password: string): LibraUser | null {
  const found = MOCK_USERS.find(
    (u: any) => u.username === username && (u as any).password === password
  );
  if (!found) return null;
  const { password: _p, ...safe } = found as any;
  return safe as LibraUser;
}
