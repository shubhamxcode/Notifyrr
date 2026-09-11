import Link from "next/link";
import styles from "./dashboard.module.css";

const examples = [
  { symbol: "₹", text: "A price drops" },
  { symbol: "●", text: "Tickets appear" },
  { symbol: "↗", text: "Applications open" },
];

export function EmptyMonitorState() {
  return (
    <section className={styles.emptyState} aria-labelledby="empty-state-title">
      <div className={styles.radar} aria-hidden="true">
        <span className={styles.radarSweep} />
        <span className={styles.radarPing} />
        <span className={styles.radarCenter}>N</span>
      </div>

      <div className={styles.emptyCopy}>
        <p className={styles.sectionLabel}>Your watchlist is wonderfully quiet</p>
        <h2 id="empty-state-title">Give us a page. Go do literally anything else.</h2>
        <p>
          Paste a public URL and describe what you are waiting for. Notifyr checks it in
          the background and nudges you only when your condition becomes true.
        </p>

        <Link className={styles.primaryAction} href="/dashboard/monitors/new">
          Create your first monitor
          <span aria-hidden="true">→</span>
        </Link>

        <div className={styles.examples} aria-label="Things you can monitor">
          {examples.map((example) => (
            <span key={example.text}>
              <i aria-hidden="true">{example.symbol}</i>
              {example.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
