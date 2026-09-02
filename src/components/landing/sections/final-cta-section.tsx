export function FinalCtaSection() {
  return (
    <section className="final-cta">
      <div>
        <span className="final-cta__signal" aria-hidden="true">
          <i />
          <i />
          <i />
        </span>
        <h2>Close the tab. We’ll keep watch.</h2>
        <p>
          Give Notifyr the page and the condition. Come back only when there is something
          worth knowing.
        </p>
      </div>
      <a className="button button--light" href="#try-notifyr">
        Explore the demo
        <span aria-hidden="true">↗</span>
      </a>
    </section>
  );
}
