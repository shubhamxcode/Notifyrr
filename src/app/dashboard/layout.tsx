import { auth } from "@clerk/nextjs/server";
import type { ReactNode } from "react";
import { DashboardNav } from "@/components/dashboard/dashboard-nav";
import styles from "@/components/dashboard/dashboard.module.css";

export default async function DashboardLayout({ children }: { children: ReactNode }) {
  await auth.protect();

  return (
    <div className={styles.shell}>
      <DashboardNav />
      <main className={styles.main}>
        <div className={styles.content}>{children}</div>
      </main>
    </div>
  );
}
