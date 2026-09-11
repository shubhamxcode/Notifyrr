"use client";

import { useState } from "react";
import styles from "./dashboard.module.css";

const ideas = [
  "Price drops below…",
  "Tickets become available",
  "Applications open",
  "This item is back in stock",
];

export function NewMonitorForm() {
  const [url, setUrl] = useState("");
  const [request, setRequest] = useState("");
  const canContinue = url.trim().length > 0 && request.trim().length > 0;

  return (
    <div className={styles.monitorBuilder}>
      <form className={styles.monitorForm} onSubmit={(event) => event.preventDefault()}>
        <div className={styles.formProgress} aria-label="Step 1 of 3">
          <span className={styles.progressActive}>1</span>
          <i />
          <span>2</span>
          <i />
          <span>3</span>
        </div>

        <div className={styles.formHeading}>
          <span>Step 1 · Tell us what to watch</span>
          <h2>Start with the page you keep checking.</h2>
          <p>No selectors, rules, or technical setup. Just the page and the moment.</p>
        </div>

        <label className={styles.field}>
          <span>Public webpage</span>
          <div className={styles.urlInput}>
            <span>https://</span>
            <input
              autoComplete="url"
              inputMode="url"
              name="url"
              placeholder="store.example.com/product"
              value={url}
              onChange={(event) => setUrl(event.target.value.replace(/^https?:\/\//, ""))}
            />
          </div>
          <small>Notifyr only monitors pages anyone can visit without signing in.</small>
        </label>

        <label className={styles.field}>
          <span>What are you waiting for?</span>
          <textarea
            name="request"
            placeholder="Notify me when…"
            rows={4}
            value={request}
            onChange={(event) => setRequest(event.target.value)}
          />
        </label>

        <div className={styles.ideaList} aria-label="Example monitor conditions">
          {ideas.map((idea) => (
            <button key={idea} type="button" onClick={() => setRequest(idea)}>
              {idea}
            </button>
          ))}
        </div>

        <div className={styles.formFooter}>
          <p>Your monitor stays private to your account.</p>
          <button className={styles.continueButton} type="submit" disabled={!canContinue}>
            Continue to details <span aria-hidden="true">→</span>
          </button>
        </div>
      </form>

      <aside className={styles.builderAside}>
        <div className={styles.builderPreview} aria-hidden="true">
          <span className={styles.previewDot} />
          <p>{url ? `https://${url}` : "Your webpage"}</p>
          <strong>{request || "Your condition appears here"}</strong>
          <div><span /><span /><span /></div>
        </div>
        <h3>We’ll turn your words into a reliable signal.</h3>
        <p>
          Notifyr renders the page, finds the relevant value, and checks whether your
          condition has become true.
        </p>
      </aside>
    </div>
  );
}
