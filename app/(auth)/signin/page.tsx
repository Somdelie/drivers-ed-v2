// app/sign-in/page.tsx (note the hyphenated path to match your middleware)
import SignInForm from "@/components/ui/SignInForm";
import { currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  // Check if user is already signed in
  const user = await currentUser();

  // If user is already signed in, redirect to dashboard
  if (user) {
    return redirect("/dashboard");
  }

  // Otherwise, render the sign-in form
  return <SignInForm />;
}
