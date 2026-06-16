import { createServerFn } from "@tanstack/react-start";

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  password?: string;
}

export const signUpUser = createServerFn({ method: "POST" })
  .validator((data: UserProfile) => {
    if (!data.email || !data.password || !data.name || !data.phone) {
      throw new Error("Missing required fields");
    }
    return data;
  })
  .handler(async ({ data }) => {
    // Dynamically import server-side DB logic to prevent compilation issues in client bundles
    const { signUpDb } = await import("../server/auth");
    return signUpDb(data);
  });

export const loginUser = createServerFn({ method: "POST" })
  .validator((data: Pick<UserProfile, "email" | "password">) => {
    if (!data.email || !data.password) {
      throw new Error("Missing email or password");
    }
    return data;
  })
  .handler(async ({ data }) => {
    // Dynamically import server-side DB logic to prevent compilation issues in client bundles
    const { loginDb } = await import("../server/auth");
    return loginDb(data);
  });
