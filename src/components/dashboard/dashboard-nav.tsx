"use client";

import { UserButton } from "@clerk/nextjs";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/landing/layout/brand-mark";
import styles from "./dashboard.module.css";

const navigation = [
  { label: "Overview", href: "/dashboard" },
  { label: "Monitors", href: "/dashboard/monitors" },
  { label: "Notifications", href: "/dashboard/notifications" },
];

export function DashboardNav() {
  const pathname = usePathname();

  return (
    <aside className={styles.sidebar}>
      <Link className={styles.brand} href="/" aria-label="Notifyr home">
        <BrandMark />
        <span>Notifyr</span>
      </Link>

      <nav className={styles.navigation} aria-label="Dashboard navigation">
        {navigation.map((item) => {
          const isActive =
            item.href === "/dashboard"
              ? pathname === item.href
              : pathname.startsWith(item.href);

          return (
            <Link
              className={isActive ? styles.navigationActive : styles.navigationItem}
              href={item.href}
              key={item.href}
              aria-current={isActive ? "page" : undefined}
            >
              <span className={styles.navigationDot} aria-hidden="true" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className={styles.sidebarFooter}>
        <div>
          <strong>All systems quiet</strong>
          <span>We’ll speak up when it matters.</span>
        </div>
        <UserButton userProfileMode="navigation" userProfileUrl="/account" />
      </div>
    </aside>
  );
}
