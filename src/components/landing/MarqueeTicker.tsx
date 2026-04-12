"use client";

import { useEffect } from "react";

export function MarqueeTicker() {
  useEffect(() => {
    const items = [
      ["ETH → ARB", "$12,450 USDC"],
      ["SOL → ETH", "$3,200 SOL"],
      ["ARB → OP", "$890 ETH"],
      ["ETH → SOL", "$5,100 USDT"],
      ["BASE → ETH", "$2,340 WBTC"],
      ["MATIC → ARB", "$8,920 USDC"],
      ["BSC → ETH", "$1,650 BNB"],
      ["OP → BASE", "$4,400 USDC"],
      ["ETH → BASE", "$7,700 DAI"],
      ["SOL → ARB", "$3,020 USDT"],
      ["ETH → MATIC", "$990 WETH"],
      ["ARB → ETH", "$5,800 USDC"],
    ];
    const track = document.getElementById("marquee");
    if (track) {
      const render = () => items.map(([r, a]) => `<div class="marquee-item"><span>${r}</span>${a}</div>`).join("");
      track.innerHTML = render() + render();
    }
  }, []);

  return (
    <div id="proof">
      <div className="marquee-track" id="marquee"></div>
    </div>
  );
}