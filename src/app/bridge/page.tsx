import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BridgeWidget } from "@/components/bridge/BridgeWidget";

export const metadata: Metadata = { title: "Bridge | Swipass" };

export default function BridgePage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen w-full flex items-center justify-center px-4 pt-20 pb-12"
        style={{ background: "var(--g900)" }}>
        <BridgeWidget />
      </div>
    </>
  );
}