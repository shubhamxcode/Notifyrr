const useCases = [
  {
    type: "Price",
    title: "Buy at the right moment.",
    prompt: "Tell me when this laptop costs less than ₹75,000.",
    signal: "₹82,990",
    state: "Watching",
  },
  {
    type: "Availability",
    title: "Be early when access is scarce.",
    prompt: "Notify me when Arijit Singh concert tickets become available.",
    signal: "Sold out",
    state: "Watching",
  },
  {
    type: "Opportunity",
    title: "Never miss an opening.",
    prompt: "Email me when applications open for this program.",
    signal: "Closed",
    state: "Watching",
  },
];

export function UseCasesSection() {
  return (
    <section className="section use-cases" id="use-cases">
      <div className="section-heading section-heading--split">
        <h2>If it appears on a page, Notifyr can watch for it.</h2>
        <p>
          From everyday purchases to rare opportunities, describe the outcome—not the code
          behind the website.
        </p>
      </div>

      <div className="use-cases__list">
        {useCases.map((item, index) => (
          <article className="use-case" key={item.type}>
            <div className="use-case__index">0{index + 1}</div>
            <div className="use-case__copy">
              <span>{item.type}</span>
              <h3>{item.title}</h3>
              <p>“{item.prompt}”</p>
            </div>
            <div className="use-case__signal">
              <span>{item.signal}</span>
              <small>
                <i aria-hidden="true" />
                {item.state}
              </small>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
