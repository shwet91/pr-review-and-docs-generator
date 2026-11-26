// src/app/dashboard/page.tsx
// Server Component: do NOT add "use client" here.
// The session lookup reads headers(), which is request-time data, so it lives in its own
// async component rendered inside <Suspense> in this same file. The page shell (skeleton)
// prerenders instantly and the dashboard streams in once the session is checked.

import { Suspense } from "react";
import { requireAuth } from "@/lib/require-auth";
import DashboardClient from "./dashboard-client";

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-[#0d1117]" aria-busy="true" aria-label="Loading dashboard">
      <div className="h-[57px] border-b border-[#30363d] bg-[#010409]" />
      <div className="mx-auto max-w-6xl space-y-6 px-6 py-8">
        <div className="h-8 w-48 animate-pulse rounded-md bg-[#161b22]" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-md border border-[#30363d] bg-[#161b22]" />
          ))}
        </div>
      </div>
    </div>
  );
}

// Async component: requireAuth() redirects to /sign-in when there is no session.
async function AuthedDashboard() {
  const session = await requireAuth();
  return <DashboardClient userName={session.user.name} />;
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <AuthedDashboard />
    </Suspense>
  );
}