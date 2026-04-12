"use client";

import { useEffect } from "react";

export function DataSection() {
  // SVG chart
  useEffect(() => {
    const svg = document.getElementById("rel-chart");
    if (!svg) return;
    const W = 800,
      H = 120;
    const pts: number[] = [];
    for (let i = 0; i < 30; i++) pts.push(88 + Math.random() * 10);
    const minV = Math.min(...pts),
      maxV = Math.max(...pts);
    const toX = (i: number) => i * (W / (pts.length - 1));
    const toY = (v: number) => H - ((v - minV) / (maxV - minV)) * (H * 0.7) - H * 0.15;
    let d = `M ${toX(0)} ${toY(pts[0])}`;
    for (let i = 1; i < pts.length; i++) {
      const cx = (toX(i - 1) + toX(i)) / 2;
      d += ` C ${cx} ${toY(pts[i - 1])} ${cx} ${toY(pts[i])} ${toX(i)} ${toY(pts[i])}`;
    }
    const areaD = d + ` L ${toX(pts.length - 1)} ${H} L 0 ${H} Z`;
    svg.innerHTML = `
      <defs><linearGradient id="cg" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#525252" stop-opacity="0.3"/>
        <stop offset="100%" stop-color="#171717" stop-opacity="0"/>
      </linearGradient></defs>
      <path d="${areaD}" fill="url(#cg)"/>
      <path d="${d}" fill="none" stroke="#525252" stroke-width="1.5" stroke-linejoin="round"/>
      <circle cx="${toX(pts.length - 1)}" cy="${toY(pts[pts.length - 1])}" r="3" fill="#a3a3a3"/>
    `;
  }, []);

  // Animate bridge score bars on scroll
  useEffect(() => {
    const barObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.querySelectorAll<HTMLElement>(".bridge-score-bar").forEach((bar) => {
              const score = bar.dataset.score;
              setTimeout(() => {
                bar.style.width = score + "%";
              }, 100);
            });
            barObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );
    document.querySelectorAll(".bridge-grid").forEach((el) => barObserver.observe(el));
    return () => barObserver.disconnect();
  }, []);

  return (
    <section id="data">
      <div className="data-header">
        <div className="reveal-left">
          <div className="section-label">market intelligence</div>
          <h2>
            The data moat
            <br />
            <em>no one else</em>
            <br />
            is building.
          </h2>
        </div>
        <div className="reveal-right">
          <p>
            Every aggregator has the same liquidity. No one logs historical bridge performance, until now. Swipass records every quote, every
            execution, every failure. That becomes your reliability score, our routing intelligence, and eventually, a data marketplace.
          </p>
        </div>
      </div>
      <div className="reliability-chart reveal">
        <div className="chart-header">
          <span className="chart-title">Bridge Reliability Index · 30-day rolling</span>
          <span className="chart-score" id="chart-score">
            97.1%
          </span>
        </div>
        <div className="chart-canvas-wrap">
          <svg className="chart-svg" id="rel-chart" viewBox="0 0 800 120" preserveAspectRatio="none"></svg>
        </div>
        <div className="chart-labels">
          <span>30d ago</span>
          <span>25d</span>
          <span>20d</span>
          <span>15d</span>
          <span>10d</span>
          <span>5d</span>
          <span>today</span>
        </div>
      </div>
      <div className="bridge-grid" style={{ marginTop: "2px" }}>
        <div className="bridge-card reveal" style={{ transitionDelay: "0.1s" }}>
          <div className="bridge-name">Arbitrum Bridge</div>
          <div className="bridge-score-bar-wrap">
            <div className="bridge-score-bar" data-score="98"></div>
          </div>
          <div className="bridge-score-num">98</div>
          <div className="bridge-score-pct">success rate · 30d</div>
        </div>
        <div className="bridge-card reveal" style={{ transitionDelay: "0.15s" }}>
          <div className="bridge-name">Hop Protocol</div>
          <div className="bridge-score-bar-wrap">
            <div className="bridge-score-bar" data-score="94"></div>
          </div>
          <div className="bridge-score-num">94</div>
          <div className="bridge-score-pct">success rate · 30d</div>
        </div>
        <div className="bridge-card reveal" style={{ transitionDelay: "0.2s" }}>
          <div className="bridge-name">Across</div>
          <div className="bridge-score-bar-wrap">
            <div className="bridge-score-bar" data-score="97"></div>
          </div>
          <div className="bridge-score-num">97</div>
          <div className="bridge-score-pct">success rate · 30d</div>
        </div>
        <div className="bridge-card reveal" style={{ transitionDelay: "0.25s" }}>
          <div className="bridge-name">Stargate</div>
          <div className="bridge-score-bar-wrap">
            <div className="bridge-score-bar" data-score="91"></div>
          </div>
          <div className="bridge-score-num">91</div>
          <div className="bridge-score-pct">success rate · 30d</div>
        </div>
      </div>
    </section>
  );
}