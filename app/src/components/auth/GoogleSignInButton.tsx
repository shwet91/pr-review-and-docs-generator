"use client";

import { authClient } from "@/lib/auth-client";

export function GoogleSignInButton() {
  return (
    <button
      onClick={() =>
        authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        })
      }
      className="w-full rounded border p-3"
    >
      Continue with Google
    </button>
  );
}