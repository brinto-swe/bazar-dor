import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect("/sign-in?callbackURL=%2Fprofile");
  }

  return <ProfileClient user={session.user} />;
}