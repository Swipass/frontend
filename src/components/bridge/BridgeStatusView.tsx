"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, XCircle, Loader2, Clock, ExternalLink, ArrowLeft, Copy } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { api, shortAddr } from "@/lib/api";

interface Execution {
  id: string;
  status: string;
  txHash?: string;
  userAddress: string;
  recipientAddress: string;
  errorMessage?: string;
  completedAt?: string;
  durationMs?: number;
  createdAt: string;
  quote: {
    fromChain: string; toChain: string;
    fromToken: string; toToken: string;
    fromAmount: string; toAmount: string;
    estimatedTime: number;
  };
}

const STATUS_CONFIG: Record<string, { label: string; icon: React.ReactNode; color: string; bg: string }> = {
  PENDING:  { label: "Preparing",   icon: <Clock className="w-10 h-10" />,        color: "var(--ink-3)",  bg: "var(--surface-2)" },
  BRIDGING: { label: "Bridging…",   icon: <Loader2 className="w-10 h-10 animate-spin" />, color: "#d4a017", bg: "#d4a01710" },
  SUCCESS:  { label: "Delivered ✓", icon: <CheckCircle2 className="w-10 h-10" />, color: "#22c55e",      bg: "#22c55e12" },
  FAILED:   { label: "Failed",      icon: <XCircle className="w-10 h-10" />,      color: "#e74c3c",      bg: "#e74c3c10" },
  REFUNDED: { label: "Refunded",    icon: <CheckCircle2 className="w-10 h-10" />, color: "var(--ink-3)", bg: "var(--surface-2)" },
};

const PROGRESS_STEPS = ["PENDING","BRIDGING","SUCCESS"];

function StepDot({ step, current }: { step: string; current: string }) {
  const idx = PROGRESS_STEPS.indexOf(step);
  const curIdx = PROGRESS_STEPS.indexOf(current === "FAILED" ? "BRIDGING" : current);
  const done = idx < curIdx;
  const active = idx === curIdx;
  return (
    <div className="flex flex-col items-center gap-1.5">
      <div className="w-3 h-3 rounded-full transition-all duration-500"
        style={{ background: done || active ? "var(--ink-0)" : "var(--border)", opacity: active ? 1 : done ? 0.5 : 0.25 }} />
      <span className="font-mono text-[0.58rem] tracking-wider capitalize" style={{ color: active ? "var(--ink-1)" : "var(--ink-4)" }}>
        {step.toLowerCase()}
      </span>
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
        if (data.status === "SUCCESS" || data.status === "FAILED" || data.status === "REFUNDED") {
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

  // ── Loading state ──────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin" style={{ color: "var(--ink-3)" }} />
        <p className="font-mono text-sm" style={{ color: "var(--ink-4)" }}>Loading transfer…</p>
      </div>
    );
  }

  // ── Not found ──────────────────────────────────────────────
  if (notFound || !exec) {
    return (
      <div className="text-center space-y-4">
        <XCircle className="w-12 h-12 mx-auto" style={{ color: "var(--ink-4)" }} />
        <p className="font-display font-bold text-xl" style={{ color: "var(--ink-0)" }}>Transfer not found</p>
        <Link href="/bridge" className="font-mono text-sm flex items-center justify-center gap-1.5" style={{ color: "var(--ink-3)", textDecoration: "none" }}>
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

      {/* Back link */}
      <Link href="/bridge" className="flex items-center gap-1.5 font-mono text-[0.68rem] transition-colors"
        style={{ color: "var(--ink-4)", textDecoration: "none" }}>
        <ArrowLeft className="w-3.5 h-3.5" />New transfer
      </Link>

      {/* Main status card */}
      <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)", boxShadow: "0 4px 32px var(--glow)" }}>

        {/* Status hero */}
        <div className="p-8 text-center flex flex-col items-center gap-3" style={{ borderBottom: "1px solid var(--border)", background: cfg.bg }}>
          <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} style={{ color: cfg.color }}>
            {cfg.icon}
          </motion.div>
          <div className="font-display font-black text-2xl" style={{ color: cfg.color, letterSpacing: "-0.03em" }}>{cfg.label}</div>
          {isLive && (
            <p className="font-mono text-[0.65rem] flex items-center gap-1.5" style={{ color: "var(--ink-4)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse-dot" />
              Refreshing every 5 seconds…
            </p>
          )}
          {isSuccess && exec.durationMs && (
            <p className="font-mono text-[0.65rem]" style={{ color: "var(--ink-4)" }}>
              Completed in {(exec.durationMs / 1000).toFixed(1)}s
            </p>
          )}
        </div>

        {/* Progress bar */}
        {!isFailed && (
          <div className="px-8 py-4 flex items-center justify-between" style={{ borderBottom: "1px solid var(--border)" }}>
            <StepDot step="PENDING" current={exec.status} />
            <div className="flex-1 h-px mx-3" style={{ background: "var(--border)" }} />
            <StepDot step="BRIDGING" current={exec.status} />
            <div className="flex-1 h-px mx-3" style={{ background: "var(--border)" }} />
            <StepDot step="SUCCESS" current={exec.status} />
          </div>
        )}

        {/* Details */}
        <div className="p-5 space-y-0">
          {[
            { label: "Route", value: `${exec.quote.fromToken} on ${exec.quote.fromChain} → ${exec.quote.toToken} on ${exec.quote.toChain}` },
            { label: "From wallet", value: shortAddr(exec.userAddress, 8), copyable: exec.userAddress },
            ...(exec.recipientAddress !== exec.userAddress
              ? [{ label: "Recipient", value: shortAddr(exec.recipientAddress, 8), copyable: exec.recipientAddress }]
              : []),
            ...(exec.txHash
              ? [{ label: "Tx hash", value: shortAddr(exec.txHash, 12), copyable: exec.txHash }]
              : []),
            ...(exec.errorMessage
              ? [{ label: "Error", value: exec.errorMessage, error: true }]
              : []),
            { label: "Transfer ID", value: shortAddr(exec.id, 10) },
          ].map((row: any, i) => (
            <div key={i} className="flex items-center justify-between py-3" style={{ borderBottom: "1px solid var(--border)" }}>
              <span className="font-mono text-[0.62rem] tracking-wider uppercase" style={{ color: "var(--ink-4)" }}>{row.label}</span>
              <div className="flex items-center gap-2">
                <span className="font-mono text-[0.72rem]" style={{ color: row.error ? "#e74c3c" : "var(--ink-2)" }}>{row.value}</span>
                {row.copyable && (
                  <button onClick={() => copy(row.copyable)} className="transition-colors" style={{ color: "var(--ink-5)" }}>
                    <Copy className="w-3 h-3" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="p-5 pt-3 flex gap-3">
          <Link href="/bridge"
            className="flex-1 py-3 rounded-xl font-display font-bold text-xs tracking-widest uppercase text-center transition-all"
            style={{ background: "var(--ink-0)", color: "var(--bg)", textDecoration: "none" }}>
            New transfer
          </Link>
          {exec.txHash && (
            <a href={`https://etherscan.io/tx/${exec.txHash}`} target="_blank" rel="noreferrer"
              className="px-4 py-3 rounded-xl flex items-center gap-1.5 font-mono text-xs transition-all"
              style={{ border: "1px solid var(--border)", color: "var(--ink-3)", textDecoration: "none" }}>
              Explorer <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}
