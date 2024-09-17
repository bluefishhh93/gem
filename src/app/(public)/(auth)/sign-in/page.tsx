import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import SignInPageContent from "./sign-in-content";

export default async function SignInPage() {
  const user = await getCurrentUser();
  
  if (user) {
    redirect("/");
  }

  return <SignInPageContent />;
}