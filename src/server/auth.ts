import { put, list } from "@vercel/blob";
import * as fs from "fs";
import * as path from "path";
import { submitLeadToCRM } from "./crm";

// Define the User interface
export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

const LOCAL_DB_PATH = path.resolve("./src/server/local_db.json");

// Helper to check if Vercel Blob Token exists
function getBlobToken(): string | undefined {
  return process.env.BLOB_READ_WRITE_TOKEN;
}

// Local DB Helpers
function readLocalDB(): UserProfile[] {
  try {
    if (!fs.existsSync(LOCAL_DB_PATH)) {
      const dir = path.dirname(LOCAL_DB_PATH);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify([]));
      return [];
    }
    const data = fs.readFileSync(LOCAL_DB_PATH, "utf8");
    return JSON.parse(data);
  } catch (e) {
    console.error("Failed to read local DB:", e);
    return [];
  }
}

function writeLocalDB(users: UserProfile[]) {
  try {
    const dir = path.dirname(LOCAL_DB_PATH);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(LOCAL_DB_PATH, JSON.stringify(users, null, 2));
  } catch (e) {
    console.error("Failed to write to local DB:", e);
  }
}

// Database Helpers
export async function signUpDb(data: UserProfile) {
  const token = getBlobToken();
  const normalizedEmail = data.email.toLowerCase().trim();

  if (token) {
    console.log("Using Vercel Blob Storage for signup");
    try {
      const { blobs } = await list({ token });
      const existing = blobs.find(b => b.pathname === `users/${normalizedEmail}.json`);
      if (existing) {
        return { success: false, error: "User already exists with this email." };
      }

      const userProfile = {
        name: data.name,
        email: normalizedEmail,
        phone: data.phone,
        password: data.password,
      };

      await put(`users/${normalizedEmail}.json`, JSON.stringify(userProfile), {
        access: "public",
        addRandomSuffix: false,
        token,
      });

      // Submit user as a lead to the CRM
      const nameParts = data.name.trim().split(/\s+/);
      const first_name = nameParts[0] || "Trader";
      const last_name = nameParts.slice(1).join(" ") || "N/A";
      await submitLeadToCRM({
        first_name,
        last_name,
        email: normalizedEmail,
        phone: data.phone,
        description: "Ciphera Intelligence Registration via Vercel Blob",
        custom_fields: {
          Source_ID: "ciphera_signup",
          How_Much_Invested: "0",
          Outline_Your_Case: "User registered on platform",
        },
      });

      return { success: true, user: { name: data.name, email: normalizedEmail, phone: data.phone } };
    } catch (error: any) {
      console.error("Vercel Blob Signup Error:", error);
      return { success: false, error: error.message || "Failed to register user to Blob storage." };
    }
  } else {
    console.log("Using local JSON file for signup fallback");
    const users = readLocalDB();
    const existing = users.find(u => u.email.toLowerCase() === normalizedEmail);
    if (existing) {
      return { success: false, error: "User already exists with this email." };
    }

    const userProfile = {
      name: data.name,
      email: normalizedEmail,
      phone: data.phone,
      password: data.password,
    };

    users.push(userProfile);
    writeLocalDB(users);

    // Submit user as a lead to the CRM
    const nameParts = data.name.trim().split(/\s+/);
    const first_name = nameParts[0] || "Trader";
    const last_name = nameParts.slice(1).join(" ") || "N/A";
    await submitLeadToCRM({
      first_name,
      last_name,
      email: normalizedEmail,
      phone: data.phone,
      description: "Ciphera Intelligence Registration via Local Fallback",
      custom_fields: {
        Source_ID: "ciphera_signup",
        How_Much_Invested: "0",
        Outline_Your_Case: "User registered on platform",
      },
    });

    return { success: true, user: { name: data.name, email: normalizedEmail, phone: data.phone } };
  }
}

export async function loginDb(data: Pick<UserProfile, "email" | "password">) {
  const token = getBlobToken();
  const normalizedEmail = data.email.toLowerCase().trim();

  if (token) {
    console.log("Using Vercel Blob Storage for login");
    try {
      const { blobs } = await list({ token });
      const existing = blobs.find(b => b.pathname === `users/${normalizedEmail}.json`);
      if (!existing) {
        return { success: false, error: "Invalid email or password." };
      }

      const res = await fetch(existing.url);
      const userProfile = await res.json() as UserProfile;

      if (userProfile.password !== data.password) {
        return { success: false, error: "Invalid email or password." };
      }

      return {
        success: true,
        user: { name: userProfile.name, email: userProfile.email, phone: userProfile.phone },
      };
    } catch (error: any) {
      console.error("Vercel Blob Login Error:", error);
      return { success: false, error: error.message || "Failed to log in via Blob storage." };
    }
  } else {
    console.log("Using local JSON file for login fallback");
    const users = readLocalDB();
    const user = users.find(
      u => u.email.toLowerCase() === normalizedEmail && u.password === data.password
    );

    if (!user) {
      return { success: false, error: "Invalid email or password." };
    }

    return {
      success: true,
      user: { name: user.name, email: user.email, phone: user.phone },
    };
  }
}
