// src/app/page.tsx
// Landing page with a GitHub-style dark theme. Tailwind + next/font only, no extra dependencies.
// Replace "Commitly" with your product name and update the /login and /signup routes as needed.
//
// Palette (GitHub dark):
//   canvas #0d1117 · inset #010409 · surface #161b22 · border #30363d
//   text #e6edf3 · muted #8b949e · link #58a6ff · primary #238636 · accent #1f6feb

import Link from "next/link";
import { Bricolage_Grotesque, Inter, JetBrains_Mono } from "next/font/google";

const display = Bricolage_Grotesque({ subsets: ["latin"], variable: "--font-display", weight: ["500", "700"] });
const sans = Inter({ subsets: ["latin"], variable: "--font-sans" });
const mono = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });

const BRAND = "Commitly";

const steps = [
  { title: "Connect GitHub", body: "Sign in with GitHub and choose which repositories to monitor. Public and private repos both work, with only the permissions we need." },
  { title: "We read your project", body: "On import, we study the repository and write the first version of your project’s master document." },
  { title: "Push as usual", body: "A webhook tells us about each new commit. We fetch the diff and the files that changed." },
  { title: "Read what changed", body: "Every commit gets its own plain-English write-up, and the master document updates to match." },
];

const faqs = [
  { q: "Does it read my whole codebase?", a: "No. We fetch the diff for each commit plus the context needed to explain it. We don’t keep copies of your source code." },
  { q: "What happens to secrets in a diff?", a: "Likely secrets such as keys and tokens are masked before anything is sent to the AI model." },
  { q: "What if a write-up fails?", a: "You’ll see the failed job on your dashboard and can retry it. Webhook retries never create duplicate docs." },
  { q: "Can I choose the AI provider?", a: "Yes. The provider is configurable, so you can switch models without changing how documentation works." },
];

function DiffLine({ kind, children }: { kind: "add" | "del" | "ctx"; children: React.ReactNode }) {
  const styles = {
    add: "bg-[rgba(46,160,67,0.15)] text-[#7ee787]",
    del: "bg-[rgba(248,81,73,0.15)] text-[#ffa198]",
    ctx: "text-[#8b949e]",
  }[kind];
  const mark = kind === "add" ? "+" : kind === "del" ? "−" : " ";
  return (
    <div className={`flex gap-3 px-4 py-0.5 ${styles}`}>
      <span aria-hidden className="w-3 shrink-0 select-none text-right">{mark}</span>
      <span className="whitespace-pre">{children}</span>
    </div>
  );
}

export default function LandingPage() {
  return (
    <div className={`${display.variable} ${sans.variable} ${mono.variable} min-h-screen bg-[#0d1117] font-[family-name:var(--font-sans)] text-[#e6edf3] antialiased`}>
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded focus:bg-[#161b22] focus:px-3 focus:py-2">
        Skip to content
      </a>

      {/* Header */}
      <header className="border-b border-[#30363d] bg-[#010409]">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link href="/" className="font-[family-name:var(--font-display)] text-xl font-bold tracking-tight">
            {BRAND}
          </Link>
          <nav aria-label="Primary" className="flex items-center gap-6 text-sm">
            <a href="#how-it-works" className="hidden text-[#c9d1d9] hover:text-white sm:inline">How it works</a>
            <a href="#two-docs" className="hidden text-[#c9d1d9] hover:text-white sm:inline">What you get</a>
            <a href="#faq" className="hidden text-[#c9d1d9] hover:text-white sm:inline">FAQ</a>
            <Link href="/login" className="text-[#c9d1d9] hover:text-white">Log in</Link>
            <Link href="/signup" className="rounded-md border border-[#30363d] bg-[#21262d] px-4 py-1.5 font-medium transition hover:border-[#8b949e] hover:bg-[#30363d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]">
              Sign up
            </Link>
          </nav>
        </div>
      </header>

      <main id="main">
        {/* Hero */}
        <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pb-20 pt-14 lg:grid-cols-[1fr_1.1fr] lg:pt-24">
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-5xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
              Every commit, explained in plain English.
            </h1>
            <p className="mt-6 max-w-[34rem] text-lg leading-relaxed text-[#9da7b3]">
              Connect your GitHub repositories and {BRAND} writes up each commit as it’s pushed, then keeps one living document that describes how your project works today.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <Link href="/signup" className="rounded-md border border-[rgba(240,246,252,0.1)] bg-[#238636] px-6 py-3 font-medium text-white transition hover:bg-[#2ea043] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]">
                Connect GitHub
              </Link>
              <a href="#how-it-works" className="px-2 py-3 font-medium text-[#58a6ff] underline-offset-4 hover:underline">
                See how it works
              </a>
            </div>
            <p className="mt-4 text-sm text-[#8b949e]">Works with public and private repositories.</p>
          </div>

          {/* Diff to docs */}
          <div aria-label="Example: a code diff and the documentation generated from it">
            <div className="overflow-hidden rounded-t-md border border-[#30363d] bg-[#0d1117]">
              <div className="flex items-center justify-between border-b border-[#30363d] bg-[#161b22] px-4 py-2 font-[family-name:var(--font-mono)] text-xs text-[#8b949e]">
                <span>a81f92c · Add user authentication</span>
                <span>src/lib/auth.ts</span>
              </div>
              <div className="py-2 font-[family-name:var(--font-mono)] text-[13px] leading-6">
                <DiffLine kind="ctx">export async function login(email, password) {"{"}</DiffLine>
                <DiffLine kind="del">  return db.user.findFirst({"{ where: { email } }"});</DiffLine>
                <DiffLine kind="add">  const user = await db.user.findUnique({"{ where: { email } }"});</DiffLine>
                <DiffLine kind="add">  if (!user || !verify(password, user.hash)) throw new AuthError();</DiffLine>
                <DiffLine kind="add">  return createSession(user.id);</DiffLine>
                <DiffLine kind="ctx">{"}"}</DiffLine>
              </div>
            </div>

            <div className="rounded-b-md border border-t-0 border-[#1f6feb] bg-[#161b22] p-6">
              <p className="text-sm font-medium text-[#58a6ff]">Commit documentation, generated 14 seconds after push</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold">Users can now log in securely</h2>
              <p className="mt-2 leading-relaxed text-[#9da7b3]">
                Login now checks the submitted password against the stored hash and starts a session only when it matches. Before, it returned the first user with a matching email.
              </p>
              <dl className="mt-4 grid gap-3 border-t border-[#30363d] pt-4 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-medium">Technical impact</dt>
                  <dd className="mt-1 text-[#9da7b3]">Protected pages can now rely on a valid session.</dd>
                </div>
                <div>
                  <dt className="font-medium">Worth checking</dt>
                  <dd className="mt-1 text-[#9da7b3]">Failed logins aren’t rate limited yet.</dd>
                </div>
              </dl>
            </div>
          </div>
        </section>

        {/* How it works (a real sequence) */}
        <section id="how-it-works" className="border-y border-[#30363d] bg-[#010409]">
          <div className="mx-auto max-w-6xl px-6 py-20">
            <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Set it up once. Documentation follows every push.
            </h2>
            <ol className="mt-12 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
              {steps.map((s, i) => (
                <li key={s.title} className="border-t-2 border-[#1f6feb] pt-4">
                  <span className="font-[family-name:var(--font-mono)] text-sm text-[#8b949e]">Step {i + 1}</span>
                  <h3 className="mt-2 font-[family-name:var(--font-display)] text-xl font-bold">{s.title}</h3>
                  <p className="mt-2 leading-relaxed text-[#9da7b3]">{s.body}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* Two kinds of docs */}
        <section id="two-docs" className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="max-w-2xl font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
            One record of the past. One picture of the present.
          </h2>
          <div className="mt-12 grid gap-6 lg:grid-cols-2">
            <article className="rounded-md border border-[#30363d] bg-[#161b22] p-8">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">Commit documentation</h3>
              <p className="mt-3 leading-relaxed text-[#9da7b3]">
                Each commit gets its own page that explains what changed and why it matters, so nobody has to read a raw diff to catch up.
              </p>
              <ul className="mt-6 space-y-2">
                <li>Summary and purpose of the change</li>
                <li>Features added, changed or removed</li>
                <li>Technical and architectural impact</li>
                <li>Risks worth a second look</li>
                <li>A link back to the original GitHub commit</li>
              </ul>
            </article>
            <article className="rounded-md border border-[#30363d] bg-[#161b22] p-8">
              <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold">Master project document</h3>
              <p className="mt-3 leading-relaxed text-[#9da7b3]">
                One document that describes the project as it is now. New commits are folded into the right sections, and removed features disappear from it.
              </p>
              <ul className="mt-6 space-y-2">
                <li>What the project does and how it’s structured</li>
                <li>Modules, folders and how they connect</li>
                <li>API endpoints and database schema</li>
                <li>Authentication and integrations</li>
                <li>Key technical decisions over time</li>
              </ul>
            </article>
          </div>
          <p className="mt-6 max-w-2xl text-[#9da7b3]">
            When the code doesn’t make a change’s purpose clear, the write-up says so instead of guessing.
          </p>
        </section>

        {/* Trust */}
        <section className="border-y border-[#30363d] bg-[#010409]">
          <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 lg:grid-cols-[1fr_1.2fr]">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Built to be trusted with private code.
            </h2>
            <ul className="grid gap-6 sm:grid-cols-2">
              {[
                ["Only the access you grant", "You can open only repositories you already have access to on GitHub."],
                ["Tokens stay on the server", "GitHub credentials are stored encrypted and never reach your browser."],
                ["Verified webhooks", "Every GitHub event is signature-checked and processed once, even if GitHub retries."],
                ["Secrets masked", "Keys and tokens found in diffs are removed before AI analysis."],
              ].map(([t, d]) => (
                <li key={t}>
                  <h3 className="font-medium text-[#3fb950]">{t}</h3>
                  <p className="mt-1 leading-relaxed text-[#9da7b3]">{d}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* FAQ */}
        <section id="faq" className="mx-auto max-w-3xl px-6 py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">Questions</h2>
          <div className="mt-8 divide-y divide-[#30363d] border-y border-[#30363d]">
            {faqs.map((f) => (
              <details key={f.q} className="group py-5">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#58a6ff]">
                  {f.q}
                  <span aria-hidden className="text-xl text-[#8b949e] transition group-open:rotate-45">+</span>
                </summary>
                <p className="mt-3 leading-relaxed text-[#9da7b3]">{f.a}</p>
              </details>
            ))}
          </div>
        </section>

        {/* Final CTA */}
        <section className="mx-auto max-w-6xl px-6 pb-24">
          <div className="rounded-md border border-[#30363d] bg-[#161b22] px-8 py-14 text-center">
            <h2 className="font-[family-name:var(--font-display)] text-3xl font-bold tracking-tight sm:text-4xl">
              Your next commit can document itself.
            </h2>
            <p className="mx-auto mt-3 max-w-xl text-[#9da7b3]">Import a repository and read its first master document in minutes.</p>
            <Link href="/signup" className="mt-8 inline-block rounded-md border border-[rgba(240,246,252,0.1)] bg-[#238636] px-6 py-3 font-medium text-white transition hover:bg-[#2ea043] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#58a6ff]">
              Connect GitHub
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#30363d] bg-[#010409]">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-6 py-8 text-sm text-[#8b949e]">
          <span>© 2026 {BRAND}</span>
          <nav aria-label="Footer" className="flex gap-6">
            <Link href="/privacy" className="hover:text-[#58a6ff]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#58a6ff]">Terms</Link>
            <Link href="/login" className="hover:text-[#58a6ff]">Log in</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}