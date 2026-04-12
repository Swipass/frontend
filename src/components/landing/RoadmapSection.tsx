export function RoadmapSection() {
  const roadmap = [
    { version: "v0.1", title: "Working bridge", desc: "LI.FI integration, 3 chains, basic execute, admin panel", badge: "Shipped", status: "done" },
    { version: "v0.2", title: "Data collection", desc: "route_executions table, TimescaleDB, reliability scores, UI badge", badge: "Building", status: "next" },
    { version: "v0.3", title: "One-line SDK", desc: "Swipass.send(), chain inference, correction logging, learning loop", badge: "Planned", status: "" },
    { version: "v1.0", title: "Public launch", desc: "Reliability scores live, SDK documented, developer onboarding", badge: "Planned", status: "" },
    { version: "v1.2", title: "Market Analysis", desc: "Public dashboard, data API freemium, first paid subscriptions", badge: "Planned", status: "" },
    { version: "v2.0", title: "Multi-aggregator", desc: "Rango + Socket adapters, intelligent routing engine active", badge: "Planned", status: "" },
    { version: "v3.0", title: "Solver marketplace", desc: "Open solver network, intent auctions, two-sided marketplace", badge: "Planned", status: "" },
  ];

  return (
    <section id="roadmap">
      <div className="roadmap-header reveal">
        <div className="section-label" style={{ justifyContent: "center", marginBottom: "20px" }}>
          roadmap
        </div>
        <h2>
          Where we are.
          <br />
          <em>Where we're going.</em>
        </h2>
        <p style={{ marginTop: "16px" }}>Layered growth. No over-engineering. No skipped stages.</p>
      </div>
      <div className="roadmap-track reveal" style={{ transitionDelay: "0.1s" }}>
        {roadmap.map((item) => (
          <div key={item.version} className={`rm-item ${item.status}`}>
            <div className="rm-dot"></div>
            <div className="rm-version">{item.version}</div>
            <div className="rm-title">{item.title}</div>
            <p className="rm-desc">{item.desc}</p>
            <div className={`rm-badge ${item.badge.toLowerCase()}`}>{item.badge}</div>
          </div>
        ))}
      </div>
    </section>
  );
}