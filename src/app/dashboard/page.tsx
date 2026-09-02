import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const firstName = user?.firstName ?? "there";

  return (
    <main className="min-h-screen bg-[var(--surface)] px-5 py-6 text-[var(--foreground)]">
      <div className="mx-auto max-w-5xl">
        <header className="flex items-center justify-between border-b border-[var(--line)] pb-5">
          <Link className="brand" href="/" aria-label="Notifyr home">
            Notifyr
          </Link>
          <div className="flex items-center gap-4">
            <Link
              className="text-sm font-semibold text-[var(--muted)] transition-colors hover:text-[var(--primary-dark)]"
              href="/account"
            >
              Manage account
            </Link>
            <UserButton userProfileMode="navigation" userProfileUrl="/account" />
          </div>
        </header>

        <section className="py-16">
          <p className="mb-3 text-sm font-semibold text-[var(--primary-dark)]">
            Signed in securely
          </p>
          <h1 className="max-w-3xl text-5xl font-semibold tracking-[-0.04em] sm:text-6xl">
            Welcome, {firstName}.
          </h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-[var(--muted)]">
            Your Notifyr account is ready. The monitor creation workflow will live here.
          </p>

          <div className="mt-12 rounded-2xl border border-[var(--line)] bg-white p-7 shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-[var(--muted)]">
              Account connected
            </span>
            <p className="mt-3 font-mono text-sm text-[var(--foreground)]">
              Clerk user: {userId}
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
