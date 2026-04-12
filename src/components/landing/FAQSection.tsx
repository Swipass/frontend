export function FAQSection() {
  const faqs = [
    { q: "What is Swipass?", a: "A non‑custodial gateway to send any token to any wallet on any blockchain in one click – or one line of code." },
    { q: "Does Swipass hold my funds?", a: "Never. You sign transactions directly from your own wallet. Swipass only constructs and routes the transaction data, your funds never touch our infrastructure." },
    { q: "How is Swipass different from LI.FI / Socket?", a: "LI.FI and Socket are execution aggregators. Swipass is a decision layer above them, we add bridge reliability scores, one‑line SDK, optional chain inference that learns, and a data marketplace." },
    { q: "What is the bridge reliability score?", a: "A score (0–100) based on historical success rate, average latency, and slippage accuracy for each bridge. Shown next to every quote." },
    { q: "How does the one‑line SDK work?", a: "`await Swipass.send({ from: 'solana:USDC', to: 'ethereum:ETH', amount: '100', recipient: '0x...' })` – no separate quote step, no transaction building. SDK handles everything." },
    { q: "Can I omit chain parameters?", a: "Yes. The SDK will return a quote with suggested chains and ask for confirmation. Your correction is logged to improve future suggestions (the living agent)." },
    { q: "What chains are supported now?", a: "Ethereum, Solana, Arbitrum. More chains via LI.FI in v1.1." },
    { q: "What’s the fee?", a: "0.1–0.3% per transaction, added to the quote. No hidden costs." },
    { q: "How is destination gas handled?", a: "Gas on the destination chain is prepaid by the solver network and deducted from the transferred amount. You need zero native gas on the destination chain." },
    { q: "What happens if a transfer fails?", a: "Your funds never leave your wallet because you haven’t signed yet. You can retry with a different route." },
  ];

  return (
    <section id="faq">
      <div className="faq-header reveal">
        <div className="section-label" style={{ justifyContent: "center", marginBottom: "20px" }}>
          faq
        </div>
        <h2>
          Common questions.
          <br />
          <em>Straight answers.</em>
        </h2>
        <p style={{ marginTop: "16px" }}>Everything you need to know about Swipass.</p>
      </div>
      <div className="faq-grid reveal" style={{ transitionDelay: "0.1s" }}>
        {faqs.map((faq, i) => (
          <div key={i} className="faq-item">
            <div className="faq-q">{faq.q}</div>
            <div className="faq-a">{faq.a}</div>
          </div>
        ))}
      </div>
    </section>
  );
}