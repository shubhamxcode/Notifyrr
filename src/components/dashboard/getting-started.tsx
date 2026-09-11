import styles from "./dashboard.module.css";

const steps = [
  { title: "Choose a page", detail: "Any public URL", complete: false },
  { title: "Describe the moment", detail: "Use everyday language", complete: false },
  { title: "Pick where to hear from us", detail: "Email first, more soon", complete: false },
];

export function GettingStarted() {
  return (
    <section className={styles.gettingStarted} aria-labelledby="getting-started-title">
      <div className={styles.sectionHeading}>
        <div>
          <h2 id="getting-started-title">Your first signal</h2>
          <p>Three small steps, then Notifyr takes the night shift.</p>
        </div>
        <span>0 of 3</span>
      </div>

      <ol className={styles.steps}>
        {steps.map((step, index) => (
          <li key={step.title}>
            <span className={styles.stepNumber}>{index + 1}</span>
            <div>
              <strong>{step.title}</strong>
              <span>{step.detail}</span>
            </div>
            <span className={styles.stepState} aria-label={step.complete ? "Complete" : "Not complete"} />
          </li>
        ))}
      </ol>
    </section>
  );
}
