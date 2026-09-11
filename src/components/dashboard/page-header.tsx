import Link from "next/link";
import styles from "./dashboard.module.css";

type PageHeaderProps = {
  title: string;
  description: string;
  action?: { label: string; href: string };
};

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <header className={styles.pageHeader}>
      <div>
        <h1>{title}</h1>
        <p>{description}</p>
      </div>
      {action ? (
        <Link className={styles.primaryAction} href={action.href}>
          <span aria-hidden="true">+</span>
          {action.label}
        </Link>
      ) : null}
    </header>
  );
}
