import { currentUser } from "@clerk/nextjs/server";
import { DashboardHeader } from "@/components/dashboard/dashboard-header";
import { EmptyMonitorState } from "@/components/dashboard/empty-monitor-state";
import { GettingStarted } from "@/components/dashboard/getting-started";
import styles from "@/components/dashboard/dashboard.module.css";

export default async function DashboardPage() {
  const user = await currentUser();
  const firstName = user?.firstName ?? "there";

  return (
    <>
      <DashboardHeader firstName={firstName} />
      <div className={styles.workspace}>
        <EmptyMonitorState />
        <GettingStarted />
      </div>
    </>
  );
}
