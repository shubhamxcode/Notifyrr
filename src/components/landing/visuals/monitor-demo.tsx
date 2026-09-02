const stages = [
  { label: "Page rendered", detail: "Chromium", state: "done" },
  { label: "Price found", detail: "₹4,499", state: "done" },
  { label: "Condition checked", detail: "Waiting", state: "active" },
];

export function MonitorDemo() {
  return (
    <div className="monitor-demo" id="try-notifyr" aria-label="Example Notifyr monitor">
      <div className="monitor-demo__bar">
        <div className="browser-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        <span className="monitor-demo__secure">Public URL</span>
      </div>

      <div className="monitor-demo__body">
        <div className="demo-label">
          <span className="live-dot" />
          New monitor
        </div>

        <div className="url-field">
          <span className="url-field__protocol">https://</span>
          <span className="url-field__value">store.example.com/running-shoes</span>
          <span className="url-field__check" aria-label="URL validated">
            ✓
          </span>
        </div>

        <div className="intent-field">
          <span className="intent-field__quote">“</span>
          <p>Notify me when these shoes cost less than ₹4,000.</p>
        </div>

        <div className="demo-progress" aria-hidden="true">
          <span />
        </div>

        <div className="demo-stages">
          {stages.map((stage) => (
            <div className="demo-stage" key={stage.label}>
              <span className={`demo-stage__icon demo-stage__icon--${stage.state}`}>
                {stage.state === "done" ? "✓" : ""}
              </span>
              <span>
                <strong>{stage.label}</strong>
                <small>{stage.detail}</small>
              </span>
            </div>
          ))}
        </div>

        <div className="condition-card">
          <div>
            <span className="condition-card__label">Trigger</span>
            <strong>Price drops below ₹4,000</strong>
          </div>
          <span className="condition-card__status">Monitoring</span>
        </div>
      </div>

      <div className="demo-notification">
        <span className="demo-notification__mark">N</span>
        <span>
          <strong>Price drop detected</strong>
          <small>We’ll email you once—right when it happens.</small>
        </span>
        <span className="demo-notification__time">now</span>
      </div>
    </div>
  );
}
