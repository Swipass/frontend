"use client";

import { useEffect } from "react";

export function LandingFooter() {
  useEffect(() => {
    const yearSpan = document.getElementById("copyright-year");
    if (yearSpan) yearSpan.innerHTML = `© ${new Date().getFullYear()} Swipass · swipass.com`;
  }, []);

  return (
    <>
      <footer>
        <div className="footer-brand">
          <div className="footer-logo-wrap">
            <img src="/wordmark.png" alt="Swipass" className="footer-logo-img" />
            <span className="footer-logo-alt" style={{ display: "none" }}>
              swi<b>pass</b>
            </span>
          </div>
          <p className="footer-tagline" style={{ color: "var(--g400)" }}>
            A non-custodial decision layer above every bridge, aggregator, and chain.
          </p>
        </div>
        <div>
          <div className="footer-col-title" style={{ color: "var(--g400)" }}>Product</div>
          <div className="footer-links">
            <a href="#how" style={{ color: "var(--g400)" }}>How it works</a>
            <a href="#sdk" style={{ color: "var(--g400)" }}>SDK & API</a>
            <a href="#data" style={{ color: "var(--g400)" }}>Market data</a>
            <a href="#roadmap" style={{ color: "var(--g400)" }}>Roadmap</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title" style={{ color: "var(--g400)" }}>Developers</div>
          <div className="footer-links">
            <a href="#" style={{ color: "var(--g400)" }}>Documentation</a>
            <a href="#" style={{ color: "var(--g400)" }}>API reference</a>
            <a href="#" style={{ color: "var(--g400)" }}>SDK on npm</a>
            <a href="#" style={{ color: "var(--g400)" }}>GitHub</a>
            <a href="#" style={{ color: "var(--g400)" }}>Status page</a>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <span className="footer-copy" id="copyright-year" style={{ color: "var(--g400)" }}></span>
        <div className="footer-status" style={{ color: "var(--g400)" }}>
          <div className="status-dot live" style={{ width: "6px", height: "6px", background: "#22c55e" }}></div>
          All systems operational
        </div>
      </div>
    </>
  );
}