const scenarios = [
  "A sold-out concert releases new tickets",
  "A product finally drops below your budget",
  "An application page opens for submissions",
  "A hard-to-find item returns to stock",
];

export function ScenarioStrip() {
  return (
    <section className="scenario-strip" aria-label="Example things Notifyr can monitor">
      <p>Worth knowing, without refreshing</p>
      <div className="scenario-strip__track">
        {scenarios.map((scenario) => (
          <span key={scenario}>
            <i aria-hidden="true" />
            {scenario}
          </span>
        ))}
      </div>
    </section>
  );
}
