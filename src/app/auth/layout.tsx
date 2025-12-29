import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sign In / Sign Up",
  description: "Sign in or create a NaviR account to start managing your personal navigation.",
};

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
