"use client";

// src/app/dashboard/dashboard-client.tsx
// Client half of the dashboard. page.tsx (a Server Component) checks the session with requireAuth()
// and passes the signed-in user's name in as a prop. All dashboard data below is still mock data.
// Working interactions: repository filter, status filter, and the Retry button on failed jobs.

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/auth/Logout-Button";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const BRAND = "Commitly";

// Passed to LogoutButton so it matches the GitHub-dark theme (the component's default is red).
const logoutClass =
  "rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1.5 text-sm font-medium text-[#f85149] transition hover:border-[#f85149] hover:bg-[rgba(248,81,73,0.1)] disabled:cursor-not-allowed disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]";

type Status = "completed" | "processing" | "failed" | "pending";

type CommitDoc = {
  sha: string;
  repo: string;
  title: string;
  summary: string;
  author: string;
  when: string;
  files: number;
  status: Status;
};

type Repo = {
  name: string;
  description: string;
  branch: string;
  lang: string;
  langColor: string;
  monitoring: boolean;
  docs: number;
};

const repos: Repo[] = [
  { name: "acme/web-app", description: "Customer-facing Next.js app", branch: "main", lang: "TypeScript", langColor: "#3178c6", monitoring: true, docs: 128 },
  { name: "acme/billing-api", description: "Payments and invoicing service", branch: "main", lang: "Go", langColor: "#00add8", monitoring: true, docs: 74 },
  { name: "acme/ml-pipeline", description: "Training and evaluation jobs", branch: "develop", lang: "Python", langColor: "#3572a5", monitoring: true, docs: 41 },
  { name: "acme/design-system", description: "Shared React components", branch: "main", lang: "TypeScript", langColor: "#3178c6", monitoring: false, docs: 19 },
];

const initialCommits: CommitDoc[] = [
  { sha: "a81f92c", repo: "acme/web-app", title: "Users can now log in securely", summary: "Login checks the password against the stored hash and starts a session only on a match. Protected routes can rely on it.", author: "priya", when: "4 min ago", files: 3, status: "completed" },
  { sha: "5be10d4", repo: "acme/billing-api", title: "Invoices retry failed payments", summary: "Adds a retry schedule for declined cards. The purpose of the new 72-hour cutoff could not be confirmed from the code.", author: "marcus", when: "22 min ago", files: 6, status: "processing" },
  { sha: "c3390ae", repo: "acme/web-app", title: "Checkout page uses the new cart store", summary: "Moves cart state out of component props into a shared store and removes the old context provider.", author: "lena", when: "1 hr ago", files: 9, status: "completed" },
  { sha: "09d7f61", repo: "acme/ml-pipeline", title: "Evaluation metrics logged per epoch", summary: "Writes precision and recall after each epoch so regressions show up earlier.", author: "dmitri", when: "3 hr ago", files: 2, status: "failed" },
  { sha: "7ee4b28", repo: "acme/billing-api", title: "Tax rules loaded from config", summary: "Replaces hardcoded rates with a config file read at startup.", author: "marcus", when: "5 hr ago", files: 4, status: "completed" },
  { sha: "f20c9b3", repo: "acme/design-system", title: "Button gains a loading state", summary: "Adds a spinner and disables clicks while a request is in flight.", author: "yuki", when: "Yesterday", files: 2, status: "pending" },
];

const masterUpdates = [
  { repo: "acme/web-app", section: "Authentication", when: "4 min ago" },
  { repo: "acme/billing-api", section: "External Integrations", when: "2 hr ago" },
  { repo: "acme/web-app", section: "State Management", when: "1 hr ago" },
];

const statusStyle: Record<Status, { label: string; cls: string }> = {
  completed: { label: "Completed", cls: "border-[rgba(46,160,67,0.4)] bg-[rgba(46,160,67,0.1)] text-[#3fb950]" },
  processing: { label: "Processing", cls: "border-[rgba(56,139,253,0.4)] bg-[rgba(56,139,253,0.1)] text-[#58a6ff]" },
  failed: { label: "Failed", cls: "border-[rgba(248,81,73,0.4)] bg-[rgba(248,81,73,0.1)] text-[#f85149]" },
  pending: { label: "Pending", cls: "border-[rgba(210,153,34,0.4)] bg-[rgba(210,153,34,0.1)] text-[#d29922]" },
};

function StatusBadge({ status }: { status: Status }) {
  const s = statusStyle[status];
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${s.cls}`}>
      <span aria-hidden className={`h-1.5 w-1.5 rounded-full bg-current ${status === "processing" ? "animate-pulse" : ""}`} />
      {s.label}
    </span>
  );
}

function Stat({ label, value, note, tone = "text-[#e6edf3]" }: { label: string; value: string; note: string; tone?: string }) {
  return (
    <div className="rounded-md border border-[#30363d] bg-[#161b22] p-5">
      <p className="text-sm text-[#8b949e]">{label}</p>
      <p className={`mt-2 font-[family-name:var(--font-display)] text-3xl font-bold ${tone}`}>{value}</p>
      <p className="mt-1 text-xs text-[#8b949e]">{note}</p>
    </div>
  );
}

const nav = ["Overview", "Repositories", "Commits", "Master docs", "Jobs", "Settings"];

type DashboardClientProps = {
  userName: string;
};

export default function DashboardClient({ userName }: DashboardClientProps) {
  const displayName = userName?.trim() || "there";
  const firstName = displayName.split(" ")[0];
  const initial = displayName.charAt(0).toUpperCase();

  const [active, setActive] = useState("Overview");
  const [repoFilter, setRepoFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [commits, setCommits] = useState(initialCommits);
  const [monitoring, setMonitoring] = useState<Record<string, boolean>>(
    Object.fromEntries(repos.map((r) => [r.name, r.monitoring]))
  );

  const visible = commits.filter(
    (c) => (repoFilter === "all" || c.repo === repoFilter) && (statusFilter === "all" || c.status === statusFilter)
  );
  const failed = commits.filter((c) => c.status === "failed");

  function retry(sha: string) {
    setCommits((prev) => prev.map((c) => (c.sha === sha ? { ...c, status: "processing" } : c)));
  }

  return (
    <div className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen bg-[#0d1117] font-[family-name:var(--font-sans)] text-[#e6edf3] antialiased lg:grid lg:grid-cols-[240px_1fr]`}>
      {/* Sidebar */}
      <aside className="hidden border-r border-[#30363d] bg-[#010409] lg:flex lg:flex-col">
        <div className="px-6 py-5">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">{BRAND}</Link>
        </div>
        <nav aria-label="Dashboard" className="flex-1 px-3">
          <ul className="space-y-1">
            {nav.map((item) => (
              <li key={item}>
                <button
                  onClick={() => setActive(item)}
                  aria-current={active === item ? "page" : undefined}
                  className={`flex w-full items-center rounded-md px-3 py-2 text-left text-sm transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58a6ff] ${
                    active === item ? "bg-[#21262d] font-medium text-white" : "text-[#c9d1d9] hover:bg-[#161b22]"
                  }`}
                >
                  {item}
                  {item === "Jobs" && failed.length > 0 && (
                    <span className="ml-auto rounded-full bg-[#f85149] px-2 text-xs font-medium text-white">{failed.length}</span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="border-t border-[#30363d] p-4">
          <div className="flex items-center gap-3">
            <span aria-hidden className="grid h-8 w-8 place-items-center rounded-full bg-[#1f6feb] text-sm font-bold">{initial}</span>
            <div className="min-w-0 text-sm">
              <p className="truncate font-medium">{displayName}</p>
              <p className="flex items-center gap-1.5 text-xs text-[#3fb950]"><span className="h-1.5 w-1.5 rounded-full bg-current" />GitHub connected</p>
            </div>
          </div>
          <LogoutButton className={`mt-4 w-full ${logoutClass}`} />
        </div>
      </aside>

      <div className="min-w-0">
        {/* Top bar */}
        <header className="flex items-center gap-4 border-b border-[#30363d] bg-[#010409] px-6 py-3">
          <span className="font-[family-name:var(--font-display)] text-lg font-bold lg:hidden">{BRAND}</span>
          <label className="relative ml-auto w-full max-w-md lg:ml-0">
            <span className="sr-only">Search commits and docs</span>
            <input
              type="search"
              placeholder="Search commits, files or docs"
              className="w-full rounded-md border border-[#30363d] bg-[#0d1117] px-3 py-1.5 text-sm placeholder:text-[#6e7681] focus:border-[#1f6feb] focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
            />
          </label>
          <button className="hidden whitespace-nowrap rounded-md border border-[rgba(240,246,252,0.1)] bg-[#238636] px-4 py-1.5 text-sm font-medium text-white transition hover:bg-[#2ea043] sm:block">
            Import repository
          </button>
          {/* Sidebar is hidden below lg, so show logout in the top bar there */}
          <LogoutButton className={`shrink-0 lg:hidden ${logoutClass}`} />
        </header>

        <main className="mx-auto max-w-6xl space-y-8 px-6 py-8">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight">Overview</h1>
            <p className="mt-1 text-[#9da7b3]">Welcome back, {firstName}. Here’s what changed across your repositories.</p>
          </div>

          {/* Stats */}
          <section aria-label="Summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Repositories monitored" value={String(Object.values(monitoring).filter(Boolean).length)} note={`of ${repos.length} imported`} />
            <Stat label="Docs generated this week" value="47" note="12 more than last week" tone="text-[#3fb950]" />
            <Stat label="Jobs processing" value={String(commits.filter((c) => c.status === "processing").length)} note="Usually under 30 seconds" tone="text-[#58a6ff]" />
            <Stat label="Failed jobs" value={String(failed.length)} note={failed.length ? "Needs your attention" : "All clear"} tone={failed.length ? "text-[#f85149]" : "text-[#e6edf3]"} />
          </section>

          <div className="grid gap-8 xl:grid-cols-[1.6fr_1fr]">
            {/* Commit feed */}
            <section aria-labelledby="feed-title" className="min-w-0">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 id="feed-title" className="font-[family-name:var(--font-display)] text-xl font-bold">Recent commit documentation</h2>
                <div className="flex gap-2 text-sm">
                  <select
                    aria-label="Filter by repository"
                    value={repoFilter}
                    onChange={(e) => setRepoFilter(e.target.value)}
                    className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
                  >
                    <option value="all">All repositories</option>
                    {repos.map((r) => <option key={r.name} value={r.name}>{r.name}</option>)}
                  </select>
                  <select
                    aria-label="Filter by status"
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as Status | "all")}
                    className="rounded-md border border-[#30363d] bg-[#21262d] px-2 py-1 focus:outline-none focus:ring-1 focus:ring-[#1f6feb]"
                  >
                    <option value="all">Any status</option>
                    <option value="completed">Completed</option>
                    <option value="processing">Processing</option>
                    <option value="pending">Pending</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              <ul className="mt-4 divide-y divide-[#30363d] overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]">
                {visible.length === 0 && <li className="p-8 text-center text-[#8b949e]">No commits match these filters.</li>}
                {visible.map((c) => (
                  <li key={c.sha} className="p-5 transition hover:bg-[#1c2128]">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h3 className="font-medium text-[#58a6ff]">
                        <a href="#" className="hover:underline">{c.title}</a>
                      </h3>
                      <StatusBadge status={c.status} />
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-[#9da7b3]">{c.summary}</p>
                    <p className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#8b949e]">
                      <span className="font-[family-name:var(--font-mono)] rounded bg-[#0d1117] px-1.5 py-0.5 text-[#c9d1d9]">{c.sha}</span>
                      <span>{c.repo}</span>
                      <span>{c.author}</span>
                      <span>{c.files} files</span>
                      <span>{c.when}</span>
                    </p>
                  </li>
                ))}
              </ul>
            </section>

            {/* Right column */}
            <div className="min-w-0 space-y-8">
              <section aria-labelledby="repos-title">
                <h2 id="repos-title" className="font-[family-name:var(--font-display)] text-xl font-bold">Repositories</h2>
                <ul className="mt-4 divide-y divide-[#30363d] overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]">
                  {repos.map((r) => (
                    <li key={r.name} className="flex items-center justify-between gap-3 p-4">
                      <div className="min-w-0">
                        <a href="#" className="block truncate font-medium text-[#58a6ff] hover:underline">{r.name}</a>
                        <p className="mt-0.5 truncate text-xs text-[#8b949e]">{r.description}</p>
                        <p className="mt-2 flex items-center gap-3 text-xs text-[#8b949e]">
                          <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: r.langColor }} />{r.lang}</span>
                          <span className="font-[family-name:var(--font-mono)]">{r.branch}</span>
                          <span>{r.docs} docs</span>
                        </p>
                      </div>
                      <button
                        role="switch"
                        aria-checked={monitoring[r.name]}
                        aria-label={`Monitoring for ${r.name}`}
                        onClick={() => setMonitoring((m) => ({ ...m, [r.name]: !m[r.name] }))}
                        className={`relative h-6 w-11 shrink-0 rounded-full border transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff] ${
                          monitoring[r.name] ? "border-[#238636] bg-[#238636]" : "border-[#30363d] bg-[#21262d]"
                        }`}
                      >
                        <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${monitoring[r.name] ? "left-[22px]" : "left-0.5"}`} />
                      </button>
                    </li>
                  ))}
                </ul>
              </section>

              <section aria-labelledby="failed-title">
                <h2 id="failed-title" className="font-[family-name:var(--font-display)] text-xl font-bold">Failed jobs</h2>
                <div className="mt-4 overflow-hidden rounded-md border border-[#30363d] bg-[#161b22]">
                  {failed.length === 0 ? (
                    <p className="p-5 text-sm text-[#8b949e]">Nothing has failed. Nice.</p>
                  ) : (
                    <ul className="divide-y divide-[#30363d]">
                      {failed.map((c) => (
                        <li key={c.sha} className="flex items-center justify-between gap-3 p-4">
                          <div className="min-w-0 text-sm">
                            <p className="truncate font-medium">{c.title}</p>
                            <p className="mt-0.5 text-xs text-[#f85149]">GitHub rate limit reached · {c.sha}</p>
                          </div>
                          <button
                            onClick={() => retry(c.sha)}
                            className="shrink-0 rounded-md border border-[#30363d] bg-[#21262d] px-3 py-1 text-sm font-medium transition hover:border-[#8b949e] hover:bg-[#30363d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58a6ff]"
                          >
                            Retry
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </section>

              <section aria-labelledby="master-title">
                <h2 id="master-title" className="font-[family-name:var(--font-display)] text-xl font-bold">Master doc updates</h2>
                <ul className="mt-4 space-y-3 rounded-md border border-[#30363d] bg-[#161b22] p-4">
                  {masterUpdates.map((u) => (
                    <li key={u.repo + u.section} className="flex items-start gap-3 text-sm">
                      <span aria-hidden className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-[#1f6feb]" />
                      <p className="text-[#9da7b3]">
                        <span className="text-[#e6edf3]">{u.section}</span> updated in <span className="text-[#58a6ff]">{u.repo}</span>
                        <span className="block text-xs text-[#8b949e]">{u.when}</span>
                      </p>
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}