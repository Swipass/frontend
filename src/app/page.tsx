/**
 * Landing page, Server Component with Client Footer fix
 * All "Izipass" changed to "Swipass"
 */

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";
import { LandingReveal } from "@/components/landing/LandingReveal";
import { LandingTicker } from "@/components/landing/LandingTicker";
import { SafeImage } from "@/components/ui/SafeImage";
import { LandingMockCard } from "@/components/landing/LandingMockCard";

export default function HomePage() {
  const steps = [
    { n:"01", icon:"🔗", title:"Connect your wallet",   desc:"MetaMask, Coinbase, Rainbow, any WalletConnect wallet. Your keys never leave your device, ever." },
    { n:"02", icon:"⚡", title:"Set your intent",        desc:"Pick chain, token, amount. Optionally forward funds straight to a different wallet in the same transaction." },
    { n:"03", icon:"🧠", title:"We find the best path",  desc:"Our engine queries multiple liquidity protocols simultaneously and selects the cheapest, fastest, most reliable route." },
    { n:"04", icon:"✍️", title:"Sign once",               desc:"One wallet signature. Destination-chain gas is covered, no need to hold the native token on the receiving chain." },
    { n:"05", icon:"✓",  title:"Funds arrive",           desc:"Most transfers complete in under 30 seconds. Live status tracking at every step." },
  ];

  const chains = [
    { name:"Ethereum",  logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/ethereum/info/logo.png" },
    { name:"Arbitrum",  logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/arbitrum/info/logo.png" },
    { name:"Base",      logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/base/info/logo.png" },
    { name:"Optimism",  logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/optimism/info/logo.png" },
    { name:"Polygon",   logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/polygon/info/logo.png" },
    { name:"Avalanche", logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/avalanchec/info/logo.png" },
    { name:"BNB Chain", logo:"https://raw.githubusercontent.com/trustwallet/assets/master/blockchains/binance/info/logo.png" },
  ];

  const faqs = [
    { q:"Does Swipass ever hold my funds?",       a:"Never. You sign transactions from your own wallet. We construct the optimal route and hand you a transaction to approve, funds never pass through our infrastructure." },
    { q:"How is the best route chosen?",           a:"We query multiple liquidity protocols simultaneously and rank results by output amount, settlement speed, and reliability. The best combination wins, every single time." },
    { q:"What about gas on the destination chain?",a:"Destination-chain gas is pre-covered by solvers and deducted from your transfer. You don't need to hold any native token on the receiving chain." },
    { q:"Can I send to a different wallet?",       a:"Yes. Enter a recipient address on the bridge page and we handle the bridge and delivery in a single transaction, no double-signing, no extra steps." },
    { q:"What tokens are supported?",              a:"We support the most liquid tokens on each chain: ETH, USDC, USDT, WBTC, DAI, WETH, plus chain-native assets like MATIC, AVAX, BNB, ARB, and OP." },
    { q:"What is the fee?",                        a:"Swipass charges a 0.3% routing fee. Underlying protocol costs and gas are shown transparently before you sign, no hidden surprises." },
  ];

  return (
    <>
      <Navbar />
      <LandingReveal />

      {/* ── HERO ──────────────────────────────────────────────────── */}
      <section id="hero" className="relative min-h-screen pt-16 flex flex-col overflow-hidden">
        <div className="orb w-[700px] h-[700px] top-[-250px] right-[-250px] opacity-[0.03]"
          style={{ background:"var(--ink-0)" }} />

        <div className="flex-1 grid md:grid-cols-2 gap-0" style={{ minHeight:"calc(100vh - 64px)" }}>
          {/* Left, copy */}
          <div className="flex flex-col justify-center px-6 md:px-14 py-16 md:py-0"
            style={{ borderRight:"1px solid var(--border)" }}>

            <div className="flex items-center gap-2 mb-8 w-fit px-3 py-1.5 rounded-full"
              style={{ border:"1px solid var(--border)", background:"var(--surface)" }}>
              <span className="animate-pulse-dot w-[7px] h-[7px] rounded-full inline-block shrink-0"
                style={{ background:"#22c55e" }} />
              <span className="font-mono text-[0.62rem] tracking-widest uppercase" style={{ color:"var(--ink-3)" }}>
                Live · 7 chains · Open beta
              </span>
            </div>

            <h1 className="font-display font-black leading-none tracking-tight mb-6"
              style={{ fontSize:"clamp(3rem,6vw,5.5rem)", color:"var(--ink-0)", letterSpacing:"-0.04em" }}>
              One interface.<br />
              <span className="relative inline-block">
                Every route.
                <span className="absolute -bottom-1 left-0 right-0 h-[3px] rounded-full opacity-15"
                  style={{ background:"var(--ink-0)" }} />
              </span>
              <br />Best price.
            </h1>

            <p className="text-[1.05rem] leading-relaxed mb-10" style={{ color:"var(--ink-3)", maxWidth:"46ch" }}>
              Swipass is an aggregator of aggregators, we sit above individual bridges
              and routing protocols, compare every available path in real time, and
              execute the one that gets you the most value.
            </p>

            <div className="flex flex-wrap gap-4 mb-12">
              <Link href="/bridge"
                className="flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-7 py-4 rounded-xl transition-all hover:opacity-80 hover:-translate-y-0.5"
                style={{ background:"var(--ink-0)", color:"var(--bg)", textDecoration:"none" }}>
                Start bridging <span aria-hidden>→</span>
              </Link>
              <Link href="#how"
                className="flex items-center gap-2 font-sans text-sm px-6 py-4 rounded-xl transition-all"
                style={{ border:"1px solid var(--border-strong)", color:"var(--ink-2)", textDecoration:"none" }}>
                How it works
              </Link>
            </div>

            <div className="flex flex-wrap gap-8 pt-8" style={{ borderTop:"1px solid var(--border)" }}>
              {[{label:"Avg. settle time",val:"< 30s"},{label:"Chains",val:"7"},{label:"Custody risk",val:"Zero"},{label:"Routing fee",val:"0.3%"}].map(({label,val}) => (
                <div key={label}>
                  <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-1" style={{ color:"var(--ink-4)" }}>{label}</div>
                  <div className="font-display font-bold text-xl" style={{ color:"var(--ink-0)" }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right, interactive mock card */}
          <div className="hidden md:flex items-center justify-center p-8" style={{ background:"var(--surface-2)" }}>
            <LandingMockCard />
          </div>
        </div>
      </section>

      <LandingTicker />

      {/* ── WHY SWIPASS ──────────────────────────────────────────── */}
      <section id="why" className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="reveal text-center mb-16">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color: "var(--ink-4)" }}>
              // the difference
            </div>
            <h2
              className="font-display font-black mb-4"
              style={{
                fontSize: "clamp(2rem,3.5vw,3rem)",
                color: "var(--ink-0)",
                letterSpacing: "-0.035em",
              }}
            >
              Aggregator of aggregators.<br />Not just another bridge.
            </h2>
            <p
              className="text-base mx-auto"
              style={{ color: "var(--ink-3)", maxWidth: "52ch", lineHeight: 1.75 }}
            >
              Individual bridges lock you into one route. Single aggregators query one source.
              Swipass sits above the entire landscape, comparing paths across multiple
              protocols so you always move value at the best available price.
            </p>
          </div>
          <div
            className="reveal grid md:grid-cols-3 gap-0 rounded-2xl overflow-hidden"
            style={{ border: "1px solid var(--border)" }}
          >
            {[
              { label: "Single bridge", desc: "One protocol, one route. If it is slow or expensive you have no alternative.", highlight: false },
              { label: "Single aggregator", desc: "Better than a bridge, but still drawing from one data source with one set of routes.", highlight: false },
              { label: "Swipass", desc: "Queries multiple protocols in parallel. Best route wins automatically, every time.", highlight: true },
            ].map((c, i) => (
              <div
                key={c.label}
                className="p-8 flex flex-col gap-3"
                style={{
                  borderRight: i < 2 ? "1px solid var(--border)" : "none",
                  // Use a fixed dark background for the highlighted card (works in both light/dark)
                  background: c.highlight ? "#0f172a" : "var(--surface)",
                  // Light text on the dark background
                  color: c.highlight ? "#ffffff" : "var(--ink-0)",
                }}
              >
                <div className="flex items-center gap-2">
                  {c.highlight && (
                    <span className="w-2 h-2 rounded-full shrink-0" style={{ background: "#22c55e" }} />
                  )}
                  <span
                    className="font-display font-black text-base"
                    style={{
                      color: c.highlight ? "#ffffff" : "var(--ink-0)",
                      letterSpacing: "-0.02em",
                    }}
                  >
                    {c.label}
                  </span>
                </div>
                <p
                  className="text-sm leading-relaxed"
                  style={{
                    // Slightly transparent white for the description
                    color: c.highlight ? "rgba(255,255,255,0.7)" : "var(--ink-3)",
                  }}
                >
                  {c.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ─────────────────────────────────────────── */}
      <section id="how" className="py-28" style={{ background:"var(--ink-0)" }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="reveal grid md:grid-cols-2 gap-16 items-start mb-16">
            <div>
              <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-4 opacity-30"
                style={{ color:"var(--bg)" }}>// how it works</div>
              <h2 className="font-display font-black leading-tight"
                style={{ fontSize:"clamp(2.2rem,4vw,3.5rem)", color:"var(--bg)", letterSpacing:"-0.035em" }}>
                One click.<br />Funds land.
              </h2>
            </div>
            <p className="text-base leading-relaxed md:mt-8" style={{ color:"var(--bg)", opacity:0.5 }}>
              You state your intent. We handle route discovery, gas abstraction, execution,
              and status tracking. No bridge or protocol knowledge required on your end.
            </p>
          </div>
          <div className="reveal grid grid-cols-2 md:grid-cols-5 rounded-2xl overflow-hidden"
            style={{ border:"1px solid rgba(249,248,246,0.12)" }}>
            {steps.map((s,i) => (
              <div key={s.n} className="p-6"
                style={{ borderRight:i<4?"1px solid rgba(249,248,246,0.1)":"none" }}>
                <div className="font-mono text-[0.58rem] tracking-widest uppercase opacity-25 mb-4"
                  style={{ color:"var(--bg)" }}>{s.n}</div>
                <div className="text-xl mb-3 opacity-60">{s.icon}</div>
                <div className="font-display font-bold text-sm mb-2" style={{ color:"var(--bg)" }}>{s.title}</div>
                <div className="text-xs leading-relaxed opacity-45" style={{ color:"var(--bg)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CHAINS ───────────────────────────────────────────────── */}
      <section id="chains" className="py-24 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <div className="reveal">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color:"var(--ink-4)" }}>// supported chains</div>
            <h2 className="font-display font-black mb-4"
              style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", color:"var(--ink-0)", letterSpacing:"-0.03em" }}>
              High-liquidity chains only
            </h2>
            <p className="text-base mb-12 mx-auto" style={{ color:"var(--ink-3)", maxWidth:"44ch", lineHeight:1.75 }}>
              Fewer chains, deeper liquidity, better execution. We add more as coverage meets our quality bar.
            </p>
          </div>
          <div className="reveal reveal-delay-1 flex flex-wrap justify-center gap-3">
            {chains.map((c) => (
              <div key={c.name}
                className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl card-3d"
                style={{ border:"1px solid var(--border)", background:"var(--surface)" }}>
                <SafeImage src={c.logo} alt={c.name} size={24} />
                <span className="font-mono text-sm" style={{ color:"var(--ink-1)" }}>{c.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PRINCIPLES ───────────────────────────────────────────── */}
      <section id="principles" className="py-24 px-6" style={{ background:"var(--surface-2)" }}>
        <div className="max-w-5xl mx-auto">
          <div className="reveal mb-12">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color:"var(--ink-4)" }}>// built differently</div>
            <h2 className="font-display font-black"
              style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", color:"var(--ink-0)", letterSpacing:"-0.03em" }}>
              Principles we don't compromise on
            </h2>
          </div>
          <div className="reveal grid md:grid-cols-3 gap-0 rounded-2xl overflow-hidden"
            style={{ border:"1px solid var(--border)" }}>
            {[
              { icon:"🔐", title:"Non-custodial, always",   desc:"Your funds never pass through Swipass infrastructure. You sign from your wallet, assets move directly between chains." },
              { icon:"⛽", title:"Destination gas covered", desc:"Arriving on a chain with zero balance? No problem. Solvers cover destination gas, deducted from your transfer amount." },
              { icon:"🔁", title:"Bridge and forward",       desc:"Deliver funds directly to a different wallet in one transaction. Bridge and send, without the double-step." },
            ].map((item,i) => (
              <div key={item.title} className="p-8"
                style={{ borderRight:i<2?"1px solid var(--border)":"none" }}>
                <div className="text-3xl mb-4">{item.icon}</div>
                <div className="font-display font-bold text-base mb-2" style={{ color:"var(--ink-0)" }}>{item.title}</div>
                <p className="text-sm leading-relaxed" style={{ color:"var(--ink-3)" }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="reveal mb-12">
            <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color:"var(--ink-4)" }}>// faq</div>
            <h2 className="font-display font-black"
              style={{ fontSize:"clamp(1.8rem,3.5vw,2.8rem)", color:"var(--ink-0)", letterSpacing:"-0.03em" }}>
              Common questions
            </h2>
          </div>
          <div className="reveal grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden"
            style={{ border:"1px solid var(--border)" }}>
            {faqs.map((item,i) => (
              <div key={item.q} className="p-7"
                style={{
                  borderRight:i%2===0?"1px solid var(--border)":"none",
                  borderBottom:i<faqs.length-2?"1px solid var(--border)":"none",
                }}>
                <div className="font-display font-bold text-sm mb-2" style={{ color:"var(--ink-0)" }}>{item.q}</div>
                <p className="text-sm leading-relaxed" style={{ color:"var(--ink-3)" }}>{item.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────── */}
      <section id="start" className="py-32 px-6 text-center" style={{ background:"var(--ink-0)" }}>
        <div className="reveal max-w-xl mx-auto">
          <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-6 opacity-25"
            style={{ color:"var(--bg)" }}>// ready to move value</div>
          <h2 className="font-display font-black mb-4"
            style={{ fontSize:"clamp(2.5rem,5vw,4rem)", color:"var(--bg)", letterSpacing:"-0.04em", lineHeight:1.05 }}>
            The best route,<br />every time.
          </h2>
          <p className="text-base mb-10" style={{ color:"var(--bg)", opacity:0.45, lineHeight:1.7 }}>
            Connect your wallet and let Swipass handle the routing.
            No registration, no KYC, no custody.
          </p>
          <Link href="/bridge"
            className="inline-flex items-center gap-2 font-display font-bold text-sm tracking-widest uppercase px-10 py-5 rounded-xl hover:opacity-90 transition-all"
            style={{ background:"var(--bg)", color:"var(--ink-0)", textDecoration:"none" }}>
            Open the bridge →
          </Link>
        </div>
      </section>

      {/* ── FOOTER ───────────────────────────────────────────────── */}
      <footer className="py-10 px-6 md:px-10" style={{ borderTop: "1px solid var(--border)", background: "var(--bg)" }}>
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-6">
          
          {/* Logo + Brand */}
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2.5 no-underline">
              <img
                src="/wordmark.png"
                alt="swipass"
                height="30"
                style={{
                  height: "30px",
                  width: "auto",
                  filter: "invert(1)", // Temporary fallback since footer is server component
                  transition: "filter 0.3s",
                }}
              />
            </Link>
            <span className="font-mono text-[0.62rem] tracking-widest px-2 py-0.5 rounded-sm"
              style={{ 
                color: "var(--ink-4)", 
                border: "1px solid var(--border)" 
              }}>
              v0.1 beta
            </span>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-wrap gap-x-6 gap-y-2 justify-center">
            {[
              { label: "How it works", href: "#how" },
              { label: "Chains", href: "#chains" },
              { label: "FAQ", href: "#faq" },
              { label: "Bridge", href: "/bridge" },
              { label: "Documentation", href: "/docs" },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="font-mono text-[0.68rem] transition-colors hover:text-[var(--ink-1)]"
                style={{ color: "var(--ink-4)", textDecoration: "none" }}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Copyright */}
          <div className="font-mono text-[0.65rem] text-center md:text-right" 
               style={{ color: "var(--ink-5)" }}>
            © {new Date().getFullYear()} Swipass • Non-custodial • Powered by LI.FI
          </div>
        </div>
      </footer>
    </>
  );
}