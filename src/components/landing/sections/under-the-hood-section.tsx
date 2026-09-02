const details = [
  ["Real browser rendering", "JavaScript-heavy pages are rendered with Chromium, not treated like static text."],
  ["Structured understanding", "Gemini turns visible page content into a clear subject, value, condition, and confidence."],
  ["Efficient recurring checks", "Stable extraction rules are reused. AI steps in only when the page becomes unclear or changes shape."],
  ["One transition, one email", "Notifications fire only when a condition changes from false to true, preventing repeat noise."],
];

export function UnderTheHoodSection() {
  return (
    <section className="section architecture" id="under-the-hood">
      <div className="architecture__statement">
        <span className="architecture__pulse" aria-hidden="true" />
        <p>Always checking. Quietly.</p>
        <h2>Built to understand modern pages—not just scrape them.</h2>
      </div>

      <div className="architecture__details">
        {details.map(([title, body]) => (
          <article key={title}>
            <h3>{title}</h3>
            <p>{body}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
