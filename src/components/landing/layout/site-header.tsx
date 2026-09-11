import {
  Show,
  SignInButton,
  SignUpButton,
  UserButton,
} from "@clerk/nextjs";
import Link from "next/link";
import { BrandMark } from "@/components/landing/layout/brand-mark";

const navigation = [
  { label: "How it works", href: "#how-it-works" },
  { label: "Use cases", href: "#use-cases" },
  { label: "Under the hood", href: "#under-the-hood" },
];

export function SiteHeader() {
  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label="Notifyr home">
        <BrandMark />
        <span>Notifyr</span>
      </a>

      <nav className="site-nav" aria-label="Main navigation">
        {navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
          </a>
        ))}
      </nav>

      <div className="site-header__auth">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="auth-link" type="button">
              Sign in
            </button>
          </SignInButton>
          <SignUpButton mode="modal">
            <button className="button button--compact button--dark" type="button">
              Get started
            </button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <Link className="auth-link" href="/dashboard">
            Dashboard
          </Link>
          <UserButton userProfileMode="navigation" userProfileUrl="/account" />
        </Show>
      </div>
    </header>
  );
}
