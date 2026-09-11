import Link from "next/link";
import { PageHeader } from "@/components/dashboard/page-header";
import styles from "@/components/dashboard/dashboard.module.css";

export default function MonitorsPage() {
  return (
    <>
      <PageHeader
        title="Monitors"
        description="The pages Notifyr is watching for you will live here."
        action={{ label: "New monitor", href: "/dashboard/monitors/new" }}
      />

      <section className={styles.monitorEmpty} aria-labelledby="monitor-empty-title">
        <div className={styles.monitorPulse} aria-hidden="true">
          <span />
          <span />
          <i />
        </div>
        <div>
          <span className={styles.quietBadge}>Nothing on watch yet</span>
          <h2 id="monitor-empty-title">Your corner of the internet is still unsupervised.</h2>
          <p>
            Create a monitor for a product, ticket page, application, or anything else
            whose next change matters to you.
          </p>
          <Link className={styles.primaryAction} href="/dashboard/monitors/new">
            Watch your first page <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>
    </>
  );
}
