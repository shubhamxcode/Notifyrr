const steps = [
  {
    number: "01",
    title: "Point to the exact page",
    body: "Paste the public URL you already check. Notifyr validates it and renders the page like a real browser.",
  },
  {
    number: "02",
    title: "Say what you’re waiting for",
    body: "Write the condition naturally—price, availability, text, status, date, or any visible change that matters.",
  },
  {
    number: "03",
    title: "Get one useful email",
    body: "Checks continue in the background. When your condition flips from false to true, Notifyr tells you once.",
  },
];

export function WorkflowSection() {
  return (
    <section className="section workflow" id="how-it-works">
      <div className="section-heading">
        <p className="section-heading__context">Three steps. Then stop thinking about it.</p>
        <h2>Turn any webpage into a signal.</h2>
      </div>

      <div className="workflow__steps">
        {steps.map((step) => (
          <article className="workflow-step" key={step.number}>
            <span className="workflow-step__number">{step.number}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
