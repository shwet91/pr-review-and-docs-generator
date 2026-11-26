// src/app/dashboard/layout.tsx
// Intentionally does no session lookup. Reading headers()/cookies() in a layout without a
// Suspense boundary blocks prerendering in Next 16. Auth is enforced in page.tsx instead.

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}