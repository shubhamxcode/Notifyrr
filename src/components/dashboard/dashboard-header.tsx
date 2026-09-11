import Link from "next/link";
import styles from "./dashboard.module.css";

type DashboardHeaderProps = {
  firstName: string;
};

export function DashboardHeader({ firstName }: DashboardHeaderProps) {
  return (
    <header className={styles.header}>
      <div>
        <p className={styles.greeting}>Good to see you, {firstName}</p>
        <h1>What should we keep an eye on?</h1>
      </div>
      <Link className={styles.primaryAction} href="/dashboard/monitors/new">
        <span aria-hidden="true">+</span>
        New monitor
      </Link>
    </header>
  );
}
