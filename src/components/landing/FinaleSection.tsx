import { ThreeFinaleCanvas } from "./ThreeFinaleCanvas";

export function FinaleSection() {
  return (
    <section id="finale">
      <ThreeFinaleCanvas />
      <div className="finale-content reveal">
        <div className="section-label" style={{ justifyContent: "center", marginBottom: "28px" }}>
          get started today
        </div>
        <h2>
          The gateway is
          <br />
          <em>open.</em>
        </h2>
        <p>One line of code. No subscription. No custody. Just the best route, every time.</p>
        <div className="finale-ctas">
          <button className="btn-primary">start building free</button>
          <button className="btn-ghost" style={{ borderColor: "var(--g700)" }}>
            view documentation
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <div className="finale-footnote">swipass.com · v0.1 live · non-custodial · april 2026</div>
      </div>
    </section>
  );
}