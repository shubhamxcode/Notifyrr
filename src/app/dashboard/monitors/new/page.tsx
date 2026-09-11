import Link from "next/link";
import { NewMonitorForm } from "@/components/dashboard/new-monitor-form";
import styles from "@/components/dashboard/dashboard.module.css";

export default function NewMonitorPage() {
  return (
    <>
      <header className={styles.builderHeader}>
        <div>
          <Link href="/dashboard/monitors">← Monitors</Link>
          <h1>Create a monitor</h1>
        </div>
        <span>Step 1 of 3</span>
      </header>
      <NewMonitorForm />
    </>
  );
}
