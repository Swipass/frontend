"use client";

export function SDKSection() {
  return (
    <section id="sdk">
      <div className="sdk-grid">
        <div className="sdk-left reveal-left">
          <div className="section-label">one-line sdk</div>
          <h2>
            One line.
            <br />
            <em>Every chain.</em>
          </h2>
          <p>
            No quote step. No transaction building. No gas management. Pass a token, an amount, and a recipient address, Swipass handles the
            rest and returns a signed transaction ready to broadcast.
          </p>
          <div className="sdk-feature">
            <div className="sdk-feat-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M7 1L1 7l6 6M13 7H1" />
              </svg>
            </div>
            <div>
              <div className="sdk-feat-title">Optional chains</div>
              <div className="sdk-feat-desc">Omit fromChain or toChain, Swipass infers from address format and past corrections.</div>
            </div>
          </div>
          <div className="sdk-feature">
            <div className="sdk-feat-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                <circle cx="7" cy="7" r="5" />
                <path d="M7 4v3l2 2" />
              </svg>
            </div>
            <div>
              <div className="sdk-feat-title">Living agent</div>
              <div className="sdk-feat-desc">Every correction you make is logged. The system gets smarter without code changes.</div>
            </div>
          </div>
          <div className="sdk-feature">
            <div className="sdk-feat-icon">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.2">
                <path d="M2 7h10M8 4l3 3-3 3" />
              </svg>
            </div>
            <div>
              <div className="sdk-feat-title">Reliability-weighted routing</div>
              <div className="sdk-feat-desc">Routes scored on 30-day success rate, not just today's price. Fewer failed transfers.</div>
            </div>
          </div>
        </div>
        <div className="reveal-right" style={{ transitionDelay: "0.15s", overflowX: "auto", width: "100%" }}>
          <div className="code-window" style={{ minWidth: "280px" }}>
            <div className="code-toolbar">
              <div className="code-dot"></div>
              <div className="code-dot"></div>
              <div className="code-dot"></div>
              <span className="code-title">swipass-sdk · TypeScript</span>
            </div>
            <div className="code-body" style={{ overflowX: "auto" }}>
              <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
                <code style={{ fontFamily: "var(--font-mono)", fontSize: "13px", lineHeight: "1.8", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
{`// install: npm i @swipass/sdk
import Swipass from '@swipass/sdk';

// ── Minimal: chains inferred automatically ──
const result = await Swipass.send({
  from:      'USDC',
  to:        'ETH',
  amount:    '500',
  recipient: '0xd8dA6BF...'
});

// ── With reliability score in response ──
console.log(result.best.reliabilityScore);
// → 0.97

// ── Execute when ready ──
const tx = await Swipass.execute(
  result.best.id
);`}
                </code>
              </pre>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2px", marginTop: "2px" }}>
            <div style={{ padding: "20px", border: "1px solid var(--g800)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", color: "var(--g700)", textTransform: "uppercase", marginBottom: "8px" }}>
                sdk
              </div>
              <div style={{ fontSize: "13px", color: "var(--g400)", fontWeight: "300" }}>TypeScript · npm</div>
            </div>
            <div style={{ padding: "20px", border: "1px solid var(--g800)", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "9px", letterSpacing: "0.15em", color: "var(--g700)", textTransform: "uppercase", marginBottom: "8px" }}>
                api
              </div>
              <div style={{ fontSize: "13px", color: "var(--g400)", fontWeight: "300" }}>REST · /v1</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}