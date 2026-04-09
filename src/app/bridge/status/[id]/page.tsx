import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BridgeStatusView } from "@/components/bridge/BridgeStatusView";

export const metadata: Metadata = { title: "Transfer Status" };

export default function StatusPage({ params }: { params: { id: string } }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "var(--surface-2)" }}>
        <BridgeStatusView executionId={params.id} />
      </main>
    </>
  );
}
