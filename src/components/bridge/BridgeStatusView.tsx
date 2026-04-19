"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Clock, ExternalLink, ArrowLeft, Copy } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api, shortAddr } from "@/lib/api";

interface Step {
  id: string;
  stepIndex: number;
  type: string;
  status: string;
  txHash?: string;
  errorMessage?: string;
}

interface Execution {
  id: string;
  status: string;
  userAddress: string;
  recipientAddress: string;
  errorMessage?: string;
  completedAt?: string;
  durationMs?: number;
  createdAt: string;
  steps: Step[];
  quote: {
    fromChain: string; toChain: string;
    fromToken: string; toToken: string;
    fromAmount: string; toAmount: string;
    estimatedTime: number;
  };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  PENDING:  { label: "Preparing",   icon: <Clock className="w-10 h-10" />,        color: "var(--g500)",  bg: "var(--g800)" },
  BRIDGING: { label: "Bridging…",   icon: <Loader2 className="w-10 h-10 animate-spin" />, color: "#d4a017", bg: "#d4a01710" },
  SUCCESS:  { label: "Delivered ✓", icon: <CheckCircle2 className="w-10 h-10" />, color: "#22c55e",      bg: "#22c55e12" },
  FAILED:   { label: "Failed",      icon: <XCircle className="w-10 h-10" />,      color: "#e74c3c",      bg: "#e74c3c10" },
  REFUNDED: { label: "Refunded",    icon: <CheckCircle2 className="w-10 h-10" />, color: "var(--g500)", bg: "var(--g800)" },
};

function StepBadge({ step }: { step: Step }) {
  const getStatusColor = () => {
    switch (step.status) {
      case "COMPLETED": return "#22c55e";
      case "SUBMITTED":
      case "CONFIRMED": return "#d4a017";
      case "FAILED": return "#e74c3c";
      default: return "var(--g600)";
    }
  };
  return (
    <div className="flex items-center gap-2 py-1.5 border-b border-g700 last:border-0">
      <span className="font-mono text-[0.58rem] w-12">{step.type}</span>
      <span className="font-mono text-[0.7rem] flex-1" style={{ color: getStatusColor() }}>
        {step.status}
      </span>
      {step.txHash && (
        <button onClick={() => navigator.clipboard.writeText(step.txHash!).then(() => toast.success("Copied!"))}>
          <Copy className="w-3 h-3" style={{ color: "var(--g600)" }} />
        </button>
      )}
    </div>
  );
}

export function BridgeStatusView({ executionId }: { executionId: string }) {
  const [exec, setExec] = useState<Execution | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const fetchStatus = async () => {
      try {
        const r = await api.get(`/v1/execute/${executionId}`);
        const data: Execution = r.data.data;
        setExec(data);
        setLoading(false);
        if (data.status === "SUCCESS" || data.status === "FAILED") {
          clearInterval(interval);
        }
      } catch {
        setNotFound(true);
        setLoading(false);
      }
    };

    fetchStatus();
    interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [executionId]);

  const copy = (text: string) => {
    navigator.clipboard.writeText(text).then(() => toast.success("Copied!")).catch(() => {});
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--g500)" }} />
        <p className="font-mono text-sm" style={{ color: "var(--g600)" }}>Loading transfer…</p>
      </div>
    );
  }

  if (notFound || !exec) {
    return (
      <div className="text-center space-y-4">
        <XCircle className="w-12 h-12 mx-auto" style={{ color: "var(--g600)" }} />
        <p className="font-display font-bold text-xl" style={{ color: "var(--g50)" }}>Transfer not found</p>
        <Link href="/bridge" className="font-mono text-sm flex items-center justify-center gap-1.5" style={{ color: "var(--g500)", textDecoration: "none" }}>
          <ArrowLeft className="w-3.5 h-3.5" />Back to bridge
        </Link>
      </div>
    );
  }

  const cfg = STATUS_CONFIG[exec.status] ?? STATUS_CONFIG.PENDING;
  const isLive = exec.status === "PENDING" || exec.status === "BRIDGING";
  const isSuccess = exec.status === "SUCCESS";
  const isFailed = exec.status === "FAILED";

  return (
    <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-[460px] space-y-3">
      <Link href="/bridge" className="flex items-center gap-1.5 font-mono text-[0.68rem] transition-colors"
        style={{ color: "var(--g500)", textDecoration: "none" }}>
        <ArrowLeft className="w-3.5 h-3.5" />New transfer
      </Link>

      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--g800)", border: "1px solid var(--g700)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
        <div className="p-8 text-center flex flex-col items-center gap-3" style={{ borderBottom: "1px solid var(--g700)", background: cfg.bg }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ color: cfg.color }}>
            {cfg.icon}
          </motion.div>
          <div className="font-display font-black text-2xl" style={{ color: cfg.color, letterSpacing: "-0.03em" }}>{cfg.label}</div>
          {isLive && (
            <p className="font-mono text-[0.65rem] flex items-center gap-1.5" style={{ color: "var(--g600)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
              Refreshing every 5 seconds…
            </p>
          )}
          {isSuccess && exec.durationMs && (
            <p className="font-mono text-[0.65rem]" style={{ color: "var(--g600)" }}>
              Completed in {(exec.durationMs / 1000).toFixed(1)}s
            </p>
          )}
        </div>

        {/* Steps list */}
        <div className="p-5 space-y-1">
          <div className="font-mono text-[0.6rem] tracking-wider uppercase mb-2" style={{ color: "var(--g600)" }}>Execution steps</div>
          {exec.steps.map((step) => (
            <StepBadge key={step.id} step={step} />
          ))}
        </div>

        {/* Details */}
        <div className="p-5 pt-0 space-y-0">
          {[
            { label: "Route", value: `${exec.quote.fromToken} on ${exec.quote.fromChain} → ${exec.quote.toToken} on ${exec.quote.toChain}` },
            { label: "From wallet", value: shortAddr(exec.userAddress, 8), copyable: exec.userAddress },
            ...(exec.recipientAddress !== exec.userAddress ? [{ label: "Recipient", value: shortAddr(exec.recipientAddress, 8), copyable: exec.recipientAddress }] : []),
            ...(exec.errorMessage ? [{ label: "Error", value: exec.errorMessage, error: true }] : []),
            { label: "Transfer ID", value: shortAddr(exec.id, 10) },
          ].map((row: any, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--g700)" }}>
              <span className="font-mono text-[0.62rem] tracking-wider uppercase" style={{ color: "var(--g600)" }}>{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.72rem]" style={{ color: row.error ? "#e74c3c" : "var(--g400)" }}>{row.value}</span>
                {row.copyable && (
                  <button onClick={() => copy(row.copyable)} className="transition-colors" style={{ color: "var(--g600)" }}>
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="p-5 pt-3 flex gap-3">
          <Link href="/bridge"
            className="flex-1 py-3 rounded-xl font-display font-bold text-xs tracking-widest uppercase text-center transition-all"
            style={{ background: "var(--g50)", color: "var(--g900)", textDecoration: "none" }}>
            New transfer
          </Link>
          {exec.steps[0]?.txHash && (
            <a href={`https://etherscan.io/tx/${exec.steps[0].txHash}`} target="_blank" rel="noreferrer"
              className="px-4 py-3 rounded-xl flex items-center gap-1.5 font-mono text-xs transition-all"
              style={{ border: "1px solid var(--g700)", color: "var(--g500)", textDecoration: "none" }}>
              Explorer <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}