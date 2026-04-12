export function ArchitectureSection() {
  const layers = [
    {
      idx: "L0",
      tag: "Execution",
      status: "Live now",
      statusClass: "live",
      name: "Execution Core",
      desc: "Quote generation, transaction construction, user-signed execution, status tracking, fee application. The stable foundation that never gets rewritten, only extended with new adapters.",
      tags: ["Fastify", "PostgreSQL", "LI.FI adapter", "Next.js"],
    },
    {
      idx: "L1",
      tag: "Intelligence",
      status: "v1.0 next",
      statusClass: "next",
      name: "Routing Intelligence",
      desc: "Adapter system for LI.FI, Socket, Rango, Across. Route normalisation. Scoring engine weighted by price, time, reliability, liquidity. Historical data feeds directly into route selection.",
      tags: ["Multi-aggregator", "Score engine", "TimescaleDB", "BullMQ"],
    },
    {
      idx: "L2",
      tag: "Intent",
      status: "Future",
      statusClass: "future",
      name: "Intent Layer",
      desc: "Full chain abstraction. \"Send $100 to this address\", Swipass infers chains, handles gas, splits large amounts across multiple routes. The Stripe moment for value movement.",
      tags: ["Chain inference", "Gas abstraction", "Multi-path"],
    },
    {
      idx: "L3",
      tag: "Financial",
      status: "v3.0",
      statusClass: "future",
      name: "Financial Expansion",
      desc: "Fiat plugin system, CEX integrations, open solver marketplace. Two-sided marketplace where solvers compete to fulfil intents. Isolated from core routing, regulatory complexity stays contained.",
      tags: ["Solver marketplace", "Fiat plugins", "CEX adapters"],
    },
  ];

  return (
    <section id="arch">
      <div className="arch-header reveal">
        <div className="section-label">layered architecture</div>
        <h2>
          Built once
          <br />
          at the <em>core.</em>
        </h2>
        <p style={{ marginTop: "16px" }}>
          Four permanent layers. Lower layers never rewrite, only upper layers evolve. This is how Swipass survives multiple market cycles.
        </p>
      </div>
      <div className="arch-layers">
        {layers.map((layer, i) => (
          <div key={layer.idx} className="arch-layer reveal" style={{ transitionDelay: `${0.05 * (i + 1)}s` }}>
            <div className="arch-layer-num">
              <div className="arch-layer-idx">{layer.idx}</div>
              <div>
                <div className="arch-layer-tag">{layer.tag}</div>
                <div className="arch-layer-status">
                  <div className={`status-dot ${layer.statusClass}`}></div>
                  {layer.status}
                </div>
              </div>
            </div>
            <div className="arch-layer-body">
              <div className="arch-layer-name">{layer.name}</div>
              <p className="arch-layer-desc">{layer.desc}</p>
              <div className="arch-layer-tags">
                {layer.tags.map((tag) => (
                  <div key={tag} className="arch-tag">
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}