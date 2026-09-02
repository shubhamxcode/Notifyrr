import { UserProfile } from "@clerk/nextjs";
import Link from "next/link";

export default function AccountPage() {
  return (
    <main className="min-h-screen bg-[var(--surface)] px-5 py-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <Link className="brand" href="/" aria-label="Notifyr home">
            Notifyr
          </Link>
          <Link
            className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--primary-dark)]"
            href="/dashboard"
          >
            Back to dashboard
          </Link>
        </header>

        <section className="flex justify-center py-12">
          <UserProfile path="/account" routing="path" />
        </section>
      </div>
    </main>
  );
}
