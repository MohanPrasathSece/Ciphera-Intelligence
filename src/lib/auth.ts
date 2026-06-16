/**
 * Client-side auth helpers.
 *
 * In the TanStack Start version these were server functions backed by Vercel
 * Blob / a local JSON file.  In a plain Vite SPA there is no server, so
 * users are stored in localStorage.  The CRM lead submission still fires
 * directly from the browser.
 */

import { submitLeadToCRM } from "./crm";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

const STORAGE_KEY = "ciphera-users-db";

function readUsers(): UserProfile[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeUsers(users: UserProfile[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
}

export async function signUpUser(data: UserProfile) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const users = readUsers();

  if (users.find((u) => u.email.toLowerCase() === normalizedEmail)) {
    return { success: false, error: "User already exists with this email." };
  }

  const userProfile: UserProfile = {
    name: data.name,
    email: normalizedEmail,
    phone: data.phone,
    password: data.password,
  };

  users.push(userProfile);
  writeUsers(users);

  // Submit as lead to CRM (fire-and-forget)
  const nameParts = data.name.trim().split(/\s+/);
  submitLeadToCRM({
    first_name: nameParts[0] || "Trader",
    last_name: nameParts.slice(1).join(" ") || "N/A",
    email: normalizedEmail,
    phone: data.phone,
    description: "Ciphera Intelligence Registration",
    custom_fields: {
      Source_ID: "ciphera_signup",
      How_Much_Invested: "0",
      Outline_Your_Case: "User registered on platform",
    },
  }).catch(console.error);

  return {
    success: true,
    user: { name: data.name, email: normalizedEmail, phone: data.phone },
  };
}

export async function loginUser(data: Pick<UserProfile, "email" | "password">) {
  const normalizedEmail = data.email.toLowerCase().trim();
  const users = readUsers();
  const user = users.find(
    (u) => u.email.toLowerCase() === normalizedEmail && u.password === data.password,
  );

  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }

  return {
    success: true,
    user: { name: user.name, email: user.email, phone: user.phone },
  };
}
