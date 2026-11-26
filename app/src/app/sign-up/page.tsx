"use client";

// src/app/sign-up/page.tsx  (saved here as sign-up-page.tsx — rename it when you drop it in)
// Restyled to match the landing page, dashboard and sign-in page (GitHub-dark). Auth logic is unchanged.

import { useState } from "react";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { Bricolage_Grotesque, Inter } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });

const BRAND = "Commitly";

const inputClass =
  "w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-2.5 text-sm text-[#e6edf3] placeholder:text-[#6e7681] transition focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]";

export default function SignUpPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await authClient.signUp.email({
      name,
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Sign up failed");
      return;
    }

    router.push("/dashboard");
    router.refresh();
  }

  async function handleGoogleSignUp() {
    await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
  }

  return (
    <main
      className={`${display.variable} ${sans.variable} flex min-h-screen flex-col items-center justify-center bg-[#0d1117] px-4 py-10 font-[family-name:var(--font-sans)] text-[#e6edf3] antialiased`}
    >
      <Link href="/" className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">
        {BRAND}
      </Link>

      <div className="w-full max-w-[400px]">
        <div className="rounded-md border border-[#30363d] bg-[#161b22] p-8">
          <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">Create your account</h1>
          <p className="mb-6 mt-1 text-sm text-[#9da7b3]">Start turning commits into documentation.</p>

          <button
            type="button"
            onClick={handleGoogleSignUp}
            className="flex w-full items-center justify-center gap-3 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-2.5 text-sm font-medium transition hover:border-[#8b949e] hover:bg-[#30363d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]"
          >
            <svg aria-hidden width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.5 0 6.6 1.2 9.1 3.6l6.8-6.8C35.8 2.4 30.3 0 24 0 14.6 0 6.5 5.4 2.6 13.2l7.9 6.1C12.4 13.6 17.7 9.5 24 9.5z" />
              <path fill="#4285F4" d="M46.5 24.5c0-1.6-.1-3.1-.4-4.5H24v9h12.7c-.6 3-2.3 5.5-4.8 7.2l7.5 5.8c4.4-4.1 7.1-10.1 7.1-17.5z" />
              <path fill="#FBBC05" d="M10.5 28.7a14.5 14.5 0 0 1 0-9.4l-7.9-6.1a24 24 0 0 0 0 21.6l7.9-6.1z" />
              <path fill="#34A853" d="M24 48c6.5 0 11.9-2.1 15.9-5.8l-7.5-5.8c-2.1 1.4-4.8 2.3-8.4 2.3-6.3 0-11.6-4.1-13.5-9.8l-7.9 6.1C6.5 42.6 14.6 48 24 48z" />
            </svg>
            Continue with Google
          </button>

          <div className="my-5 flex items-center gap-3" aria-hidden>
            <div className="h-px flex-1 bg-[#30363d]" />
            <span className="text-xs uppercase tracking-wider text-[#6e7681]">or</span>
            <div className="h-px flex-1 bg-[#30363d]" />
          </div>

          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label htmlFor="name" className="mb-1.5 block text-sm font-medium">
                Full name
              </label>
              <input
                id="name"
                type="text"
                autoComplete="name"
                placeholder="Ada Lovelace"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="email" className="mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className={inputClass}
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-1.5 block text-sm font-medium">
                Password
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                minLength={8}
                required
                aria-describedby="password-hint"
                className={inputClass}
              />
              <p id="password-hint" className="mt-1.5 text-xs text-[#8b949e]">
                Use at least 8 characters.
              </p>
            </div>

            {error && (
              <p
                role="alert"
                className="rounded-md border border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.1)] px-3 py-2 text-sm text-[#f85149]"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-md border border-[rgba(240,246,252,0.1)] bg-[#238636] px-3 py-2.5 text-sm font-medium text-white transition hover:bg-[#2ea043] disabled:cursor-not-allowed disabled:opacity-60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]"
            >
              {loading ? "Creating account..." : "Sign up"}
            </button>
          </form>
        </div>

        <p className="mt-4 rounded-md border border-[#30363d] px-4 py-4 text-center text-sm text-[#9da7b3]">
          Already have an account?{" "}
          <Link href="/sign-in" className="font-medium text-[#58a6ff] hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </main>
  );
}