import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BridgeWidget } from "@/components/bridge/BridgeWidget";

export const metadata: Metadata = { title: "Bridge" };

export default function BridgePage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 py-12 relative overflow-hidden"
        style={{ background: "var(--surface-2)" }}>
        {/* Background decoration */}
        <div className="orb w-[500px] h-[500px] top-[-100px] right-[-200px] opacity-[0.04]" style={{ background: "var(--ink-0)" }} />
        <div className="orb w-[400px] h-[400px] bottom-0 left-[-150px] opacity-[0.03]" style={{ background: "var(--ink-0)" }} />
        <BridgeWidget />
      </main>
    </>
  );
}
