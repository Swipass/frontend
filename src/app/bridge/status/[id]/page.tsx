// src/app/bridge/status/[id]/page.tsx
import { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import { BridgeStatusView } from "@/components/bridge/BridgeStatusView";

export const metadata: Metadata = { title: "Transfer Status" };

export default async function StatusPage({ 
  params 
}: { 
  params: Promise<{ id: string }> 
}) {
  const { id } = await params; // Next.js 15+: params is a Promise

  return (
    <>
      <Navbar />
      <main
        className="min-h-screen pt-16 flex flex-col items-center justify-center px-4 py-12"
        style={{ background: "var(--surface-2)" }}
      >
        <BridgeStatusView executionId={id} />
      </main>
    </>
  );
}