export function HowSection() {
  const steps = [
    {
      num: "01",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
          <circle cx="9" cy="9" r="7" />
          <path d="M9 5v4l3 3" />
        </svg>
      ),
      title: "Intent arrives",
      desc: "A user or developer sends a transfer intent, token, amount, recipient. Chains are optional. Swipass infers what it can and asks for confirmation when needed.",
    },
    {
      num: "02",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M3 9h12M3 5l12 4-12 4" />
        </svg>
      ),
      title: "Routes are scored",
      desc: "Swipass queries every aggregator simultaneously, normalises the responses, and ranks routes by price, speed, and 30-day historical reliability, not just the headline quote.",
    },
    {
      num: "03",
      icon: (
        <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="1.2">
          <path d="M4 9l4 4 6-8" />
          <circle cx="9" cy="9" r="7" />
        </svg>
      ),
      title: "User signs. Done.",
      desc: "The best route is presented. The user signs from their own wallet. Swipass tracks the execution and logs the outcome to improve future decisions. Your funds never leave your control.",
    },
  ];

  return (
    <section id="how">
      <div className="how-header reveal">
        <div className="section-label" style={{ justifyContent: "center", marginBottom: "20px" }}>
          how it works
        </div>
        <h2>
          Simple for users.
          <br />
          <em>Powerful for builders.</em>
        </h2>
        <p style={{ marginTop: "16px" }}>Three layers of abstraction. Zero custody. One outcome.</p>
      </div>
      <div className="how-steps" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        {steps.map((step, i) => (
          <div key={step.num} className="how-step reveal" style={{ transitionDelay: `${0.1 * (i + 1)}s` }}>
            <div className="step-num">{step.num}</div>
            <div className="step-icon">{step.icon}</div>
            <div className="step-title">{step.title}</div>
            <p className="step-desc">{step.desc}</p>
            <div className="step-corner"></div>
          </div>
        ))}
      </div>
    </section>
  );
}