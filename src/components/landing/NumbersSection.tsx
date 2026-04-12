"use client";

import { useEffect } from "react";

export function NumbersSection() {
  useEffect(() => {
    let volDisplay = 247843;
    let volTarget = 247843;
    const volEl = document.getElementById("n-vol");
    const interval = setInterval(() => {
      volTarget += Math.random() * 9000 + 2000;
    }, 3000);
    const animate = () => {
      volDisplay += (volTarget - volDisplay) * 0.01;
      if (volEl) volEl.textContent = "$" + Math.round(volDisplay).toLocaleString();
      requestAnimationFrame(animate);
    };
    animate();
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="numbers">
      <div className="numbers-grid">
        <div className="num-card reveal" style={{ transitionDelay: "0.05s" }}>
          <div className="num-big">
            0.2<sup>%</sup>
          </div>
          <div className="num-label">avg transaction fee</div>
          <p className="num-sub">All in. No hidden costs. Fee goes into the protocol, not a third party.</p>
        </div>
        <div className="num-card reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="num-big">3</div>
          <div className="num-label">chains live · v0.1</div>
          <p className="num-sub">Ethereum, Solana, Arbitrum. More chains via LI.FI in v1.1.</p>
        </div>
        <div className="num-card reveal" style={{ transitionDelay: "0.15s" }}>
          <div className="num-big">0</div>
          <div className="num-label">custody. ever.</div>
          <p className="num-sub">You sign from your own wallet. Swipass only provides the route data.</p>
        </div>
        <div className="num-card reveal" style={{ transitionDelay: "0.2s" }}>
          <div className="num-big" id="n-vol">
            $247k
          </div>
          <div className="num-label">routed since launch</div>
          <p className="num-sub">And growing. Data feeds back to improve every subsequent route.</p>
        </div>
      </div>
    </section>
  );
}