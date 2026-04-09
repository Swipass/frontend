"use client";
const ITEMS = [
  "ETH → ARB","USDC → BASE","AVAX → ETH","BNB → POLYGON",
  "OP → ETH","USDT → ARBITRUM","ETH → BNB","MATIC → ETH",
];
const ALL = [...ITEMS,...ITEMS];

export function LandingTicker() {
  return (
    <div className="overflow-hidden py-3" style={{ borderTop:"1px solid var(--border)", borderBottom:"1px solid var(--border)", background:"var(--surface-2)" }}>
      <div className="ticker-track flex gap-16 whitespace-nowrap">
        {ALL.map((item,i) => (
          <div key={i} className="flex items-center gap-2 shrink-0 font-mono text-xs" style={{ color:"var(--ink-3)" }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-500 opacity-60" />
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
