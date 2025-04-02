// utils/auth.ts
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * Helper function to require authentication
 * Redirects to sign-in page if user is not authenticated
 */
export async function requireAuth() {
  const user = await currentUser();

  if (!user) {
    // Redirect to sign-in page without any query parameters
    redirect("/signin");
  }

  return user;
}

/**
 * Helper function to check if user is already authenticated
 * Redirects to dashboard if user is authenticated
 */
export async function redirectIfAuthenticated() {
  const user = await currentUser();

  if (user) {
    redirect("/dashboard");
  }

  return null;
}
