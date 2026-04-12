"use client";

import { useEffect } from "react";
import toast from "react-hot-toast";
import { ThreeHeroCanvas } from "./ThreeHeroCanvas";

export function HeroSection() {
  useEffect(() => {
    const ticker = document.getElementById("hero-ticker");
    if (!ticker) return;

    const chains = ["ETH", "SOL", "ARB", "OP", "BASE", "MATIC", "BSC"];
    const tokens = ["USDC", "ETH", "USDT", "WBTC", "DAI", "SOL"];
    
    const addCard = () => {
      const from = chains[Math.floor(Math.random() * chains.length)];
      let to;
      do {
        to = chains[Math.floor(Math.random() * chains.length)];
      } while (to === from);
      const tok = tokens[Math.floor(Math.random() * tokens.length)];
      const amt = (Math.random() * 12000 + 200).toFixed(0);
      const div = document.createElement("div");
      div.className = "tick-card";
      div.innerHTML = `
        <div class="tick-route"><b>${from}</b><span>→</span><b>${to}</b></div>
        <div class="tick-amt">$${Number(amt).toLocaleString()} ${tok}</div>
        <div class="tick-st"><div class="tick-st-dot"></div>routing via swipass</div>
      `;
      ticker.insertBefore(div, ticker.firstChild);
      if (ticker.children.length > 4 && ticker.lastChild) {
        ticker.removeChild(ticker.lastChild);
      }
    };
    
    addCard();
    addCard();
    const interval = setInterval(addCard, 2000 + Math.random() * 1200);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let volDisplay = 247843;
    let scoreDisplay = 97.1;
    let volTarget = 247843;
    let scoreTarget = 97.1;

    const volEl = document.getElementById("h-vol");
    const scoreEl = document.getElementById("h-score");

    const interval = setInterval(() => {
      volTarget += Math.random() * 9000 + 2000;
      scoreTarget += (Math.random() - 0.4) * 0.3;
      scoreTarget = Math.max(94, Math.min(99, scoreTarget));
    }, 3000);

    const animate = () => {
      volDisplay += (volTarget - volDisplay) * 0.01;
      scoreDisplay += (scoreTarget - scoreDisplay) * 0.02;
      if (volEl) volEl.textContent = "$" + Math.round(volDisplay).toLocaleString();
      if (scoreEl) scoreEl.textContent = scoreDisplay.toFixed(1) + "%";
      requestAnimationFrame(animate);
    };
    animate();
    return () => clearInterval(interval);
  }, []);

  const showComingSoon = () => {
    toast.success("Coming soon! 🚀");
  };

  return (
    <section id="hero">
      <ThreeHeroCanvas />
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="live-dot"></span> v0.1 live · 3 chains · non-custodial
        </div>
        <h1 className="hero-h">
          Move value<br />
          <em>anywhere.</em>
          <br />
          <span className="dim">In one line.</span>
        </h1>
        <p className="hero-sub">
          Swipass is a decision layer above every bridge and aggregator. Not another bridge — the engine that picks the best one, every time.
        </p>
        <div className="hero-ctas">
          <button className="btn-primary" onClick={showComingSoon}>start building</button>
          <button className="btn-ghost" onClick={showComingSoon}>
            read the docs
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
      </div>
      <div className="hero-ticker" id="hero-ticker"></div>
      <div className="hero-bottom">
        <div className="hero-stat">
          <span className="hero-stat-num" id="h-vol">$0</span>
          <span className="hero-stat-label">routed today</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">3</span>
          <span className="hero-stat-label">chains active</span>
        </div>
        <div className="scroll-cue">
          <div className="scroll-cue-line"></div>
          <span>scroll</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num" id="h-score">97.1%</span>
          <span className="hero-stat-label">bridge reliability</span>
        </div>
        <div className="hero-stat">
          <span className="hero-stat-num">0.2%</span>
          <span className="hero-stat-label">avg fee</span>
        </div>
      </div>
    </section>
  );
}