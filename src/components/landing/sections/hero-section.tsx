import { MonitorDemo } from "@/components/landing/visuals/monitor-demo";

export function HeroSection() {
  return (
    <section className="hero" id="top">
      <div className="hero__copy">
        <div className="availability-note">
          <span>Built for the public web</span>
          <span aria-hidden="true">↗</span>
        </div>
        <h1>The web changes. You shouldn’t have to keep checking.</h1>
        <p className="hero__lede">
          Paste any public webpage. Describe what matters in plain language. Notifyr watches
          the page and emails you the moment your condition becomes true.
        </p>
        <div className="hero__actions">
          <a className="button button--primary" href="#try-notifyr">
            See Notifyr in action
            <span aria-hidden="true">→</span>
          </a>
          <a className="text-link" href="#how-it-works">
            How it works
            <span aria-hidden="true">↓</span>
          </a>
        </div>
        <p className="hero__note">No browser tab left open. No repetitive checking. No noise.</p>
      </div>

      <div className="hero__visual">
        <div className="hero__orbit hero__orbit--one" aria-hidden="true" />
        <div className="hero__orbit hero__orbit--two" aria-hidden="true" />
        <MonitorDemo />
      </div>
    </section>
  );
}
