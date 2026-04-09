"use client";

/**
 * LandingMockCard — Client Component.
 * Must be "use client" because it uses SafeImage (which has onError handlers).
 * Extracted from the landing page Server Component to keep SSR clean.
 */
import { SafeImage } from "@/components/ui/SafeImage";

function MockChainRow({
  chainLogo, chainName, tokenLogo, tokenSymbol, amount,
}: {
  chainLogo: string; chainName: string;
  tokenLogo: string; tokenSymbol: string; amount: string;
}) {
  return (
    <div className="flex items-center justify-between p-3 rounded-xl"
      style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
      <div className="flex items-center gap-2.5">
        {/* Stacked logos: chain behind, token in front */}
        <div className="relative w-8 h-8 shrink-0">
          <SafeImage src={chainLogo} alt={chainName} size={28}
            className="absolute top-0 left-0 ring-1"
            style={{ "--tw-ring-color": "var(--surface-2)" } as React.CSSProperties} />
          <SafeImage src={tokenLogo} alt={tokenSymbol} size={16}
            className="absolute bottom-0 right-0 ring-1"
            style={{ "--tw-ring-color": "var(--surface-2)" } as React.CSSProperties} />
        </div>
        <div>
          <div className="font-medium text-sm" style={{ color: "var(--ink-1)" }}>{chainName}</div>
          <div className="font-mono text-[0.62rem]" style={{ color: "var(--ink-4)" }}>{tokenSymbol}</div>
        </div>
      </div>
      <div className="font-mono font-meizipass-frontenddium text-base" style={{ color: "var(--ink-0)" }}>{amount}</div>
    </div>
  );
}

export function LandingMockCard() {
  return (
    <div className="w-full max-w-[400px] rounded-2xl overflow-visible card-3d"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
        boxShadow: "0 12px 48px var(--glow), 0 2px 8px var(--glow)",
      }}>

      {/* Window chrome */}
      <div className="flex items-center gap-2 px-4 py-3"
        style={{ borderBottom: "1px solid var(--border)", background: "var(--surface-2)", borderRadius: "1rem 1rem 0 0" }}>
        {["#e74c3c","#e67e22","#27ae60"].map((c,i) => (
          <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />
        ))}
        <span className="font-mono text-[0.62rem] ml-2" style={{ color: "var(--ink-4)" }}>
          app.swipass.com / bridge
        </span>
      </div>

      <div className="p-5 space-y-4">
        {/* From */}
        <div>
          <div className="font-mono text-[0.58rem] tracking-widest uppercase mb-2" style={{ color: "var(--ink-4)" }}>From</div>
          <MockChainRow
            chainLogo="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png"
            chainName="Ethereum"
            tokenLogo="https://assets.coingecko.com/coins/images/6319/small/usdc.png"
            tokenSymbol="USDC"
            amount="1,000.00"
          />
        </div>

        {/* Arrow */}
        <div className="flex justify-center">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center arrow-pulse"
            style={{ background: "var(--surface-2)", border: "1px solid var(--border)", color: "var(--ink-3)", fontSize: "1rem" }}>
            ↓
          </div>
        </div>

        {/* To */}
        <div>
          <div className="font-mono text-[0.58rem] tracking-widest uppercase mb-2" style={{ color: "var(--ink-4)" }}>To</div>
          <MockChainRow
            chainLogo="https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png"
            chainName="Arbitrum"
            tokenLogo="https://assets.coingecko.com/coins/images/6319/small/usdc.png"
            tokenSymbol="USDC"
            amount="≈ 997.00"
          />
        </div>

        {/* Summary */}
        <div className="rounded-xl p-3.5 space-y-1.5"
          style={{ background: "var(--surface-2)", border: "1px solid var(--border)" }}>
          {[
            ["Best route found", "Across Protocol"],
            ["Swipass fee",      "0.3% · ~$3.00"],
            ["Destination gas",  "Covered"],
            ["Est. time",        "~18s"],
          ].map(([k,v]) => (
            <div key={k} className="flex justify-between font-mono text-[0.66rem]"
              style={{ color: "var(--ink-4)" }}>
              <span>{k}</span>
              <span style={{ color: "var(--ink-2)" }}>{v}</span>
            </div>
          ))}
          <div className="flex justify-between font-mono text-[0.72rem] font-semibold pt-1.5"
            style={{ borderTop: "1px solid var(--border)", color: "var(--ink-0)" }}>
            <span>You receive</span><span>997.00 USDC</span>
          </div>
        </div>

        {/* CTA */}
        <div className="w-full py-3.5 rounded-xl font-display font-black text-xs tracking-widest uppercase text-center"
          style={{ background: "var(--ink-0)", color: "var(--bg)" }}>
          Sign & send →
        </div>

        <p className="text-center font-mono text-[0.58rem]" style={{ color: "var(--ink-5)" }}>
          Non-custodial · You sign from your own wallet
        </p>
      </div>
    </div>
  );
}
