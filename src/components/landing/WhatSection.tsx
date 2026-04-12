export function WhatSection() {
  return (
    <section id="what">
      <div className="what-left reveal-left">
        <div className="section-label">what is swipass</div>
        <h2>
          The <em>decision layer</em>
          <br />
          above it all.
        </h2>
        <p>
          LI.FI, Socket, Rango, Across, they execute. <strong>Swipass decides.</strong> We sit one layer above every aggregator and bridge,
          selecting the best route using proprietary reliability intelligence.
        </p>
        <p>
          No custody. No liquidity. No competing with the protocols you already trust. Just the smartest routing engine in the room, learning
          from every transaction.
        </p>
      </div>
      <div className="what-diagram reveal-right">
        <div className="wd-layer wd-4"></div>
        <div className="wd-layer wd-3">
          <div className="wd-exec-node" style={{ position: "absolute", top: "-14px", left: "50%", transform: "translateX(-50%)" }}>
            LI.FI
          </div>
          <div className="wd-exec-node" style={{ position: "absolute", bottom: "-14px", left: "50%", transform: "translateX(-50%)" }}>
            Socket
          </div>
          <div className="wd-exec-node" style={{ position: "absolute", left: "-18px", top: "50%", transform: "translateY(-50%)" }}>
            Rango
          </div>
          <div className="wd-exec-node" style={{ position: "absolute", right: "-22px", top: "50%", transform: "translateY(-50%)" }}>
            Across
          </div>
        </div>
        <div className="wd-layer wd-2">
          <div className="wd-node" style={{ position: "absolute", top: "-18px", left: "50%", transform: "translateX(-50%)" }}>
            ETH
          </div>
          <div className="wd-node" style={{ position: "absolute", bottom: "-18px", left: "50%", transform: "translateX(-50%)" }}>
            SOL
          </div>
          <div className="wd-node" style={{ position: "absolute", right: "-18px", top: "50%", transform: "translateY(-50%)" }}>
            ARB
          </div>
        </div>
        <div className="wd-layer wd-c">
          <div className="wd-c-label">
            swi
            <br />
            pass
          </div>
        </div>
      </div>
    </section>
  );
}