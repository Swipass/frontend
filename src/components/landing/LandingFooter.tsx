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
          <p className="footer-tagline">A non-custodial decision layer above every bridge, aggregator, and chain.</p>
        </div>
        <div>
          <div className="footer-col-title">Product</div>
          <div className="footer-links">
            <a href="#how">How it works</a>
            <a href="#sdk">SDK & API</a>
            <a href="#data">Market data</a>
            <a href="#roadmap">Roadmap</a>
          </div>
        </div>
        <div>
          <div className="footer-col-title">Developers</div>
          <div className="footer-links">
            <a href="#">Documentation</a>
            <a href="#">API reference</a>
            <a href="#">SDK on npm</a>
            <a href="#">GitHub</a>
            <a href="#">Status page</a>
          </div>
        </div>
      </footer>
      <div className="footer-bottom">
        <span className="footer-copy" id="copyright-year"></span>
        <div className="footer-status">
          <div className="status-dot live" style={{ width: "6px", height: "6px" }}></div>
          All systems operational
        </div>
      </div>
    </>
  );
}