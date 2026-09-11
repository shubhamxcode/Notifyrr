import { PageHeader } from "@/components/dashboard/page-header";
import styles from "@/components/dashboard/dashboard.module.css";

const channels = [
  {
    name: "Email",
    description: "The first place Notifyr will send the news.",
    status: "Ready next",
    symbol: "@",
    available: true,
  },
  {
    name: "In-app inbox",
    description: "Keep every useful update together inside Notifyr.",
    status: "Coming soon",
    symbol: "N",
    available: false,
  },
  {
    name: "Discord",
    description: "Send alerts to a server channel you choose.",
    status: "Coming soon",
    symbol: "#",
    available: false,
  },
  {
    name: "WhatsApp",
    description: "Get time-sensitive updates wherever you are.",
    status: "Coming soon",
    symbol: "✓",
    available: false,
  },
];

export default function NotificationsPage() {
  return (
    <>
      <PageHeader
        title="Notifications"
        description="Choose how Notifyr should reach you when something changes."
      />

      <section className={styles.notificationIntro}>
        <div>
          <span className={styles.quietBadge}>One change, one useful nudge</span>
          <h2>Quiet by default.<br />Impossible to miss when it matters.</h2>
        </div>
        <p>
          Channels will become configurable as delivery integrations are connected. Your
          preferences will be private to your account and overridable per monitor.
        </p>
      </section>

      <section className={styles.channelList} aria-label="Notification channels">
        {channels.map((channel) => (
          <article className={styles.channelRow} key={channel.name}>
            <span className={styles.channelIcon} aria-hidden="true">{channel.symbol}</span>
            <div className={styles.channelCopy}>
              <h3>{channel.name}</h3>
              <p>{channel.description}</p>
            </div>
            <span className={channel.available ? styles.channelReady : styles.channelSoon}>
              {channel.status}
            </span>
          </article>
        ))}
      </section>
    </>
  );
}
