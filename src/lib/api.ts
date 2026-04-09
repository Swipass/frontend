/**
 * Axios client — auto-attaches admin JWT header when present.
 * All API calls go through this instance.
 */
import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000",
  headers: { "Content-Type": "application/json" },
  timeout: 20_000,
});

api.interceptors.request.use((cfg) => {
  if (typeof window !== "undefined") {
    const token = sessionStorage.getItem("iz-admin-token");
    if (token) cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    // 401 on admin routes → clear stale token
    if (err.response?.status === 401 && typeof window !== "undefined") {
      sessionStorage.removeItem("iz-admin-token");
    }
    return Promise.reject(err);
  }
);

// ── Formatting helpers ────────────────────────────────────────

/** Truncate a wallet address: 0x1234…abcd */
export function shortAddr(addr: string, chars = 6): string {
  if (!addr || addr.length < 10) return addr;
  return `${addr.slice(0, chars)}…${addr.slice(-4)}`;
}

/** Format raw token amount given decimals */
export function fmtAmount(raw: string, decimals: number, maxDp = 6): string {
  try {
    if (!raw || raw === "0") return "0";
    const n = BigInt(raw);
    const d = BigInt(10 ** decimals);
    const whole = n / d;
    const frac = n % d;
    if (frac === BigInt(0)) return whole.toLocaleString();   // ← changed from 0n
    const fracStr = frac.toString().padStart(decimals, "0").slice(0, maxDp).replace(/0+$/, "");
    return fracStr ? `${whole.toLocaleString()}.${fracStr}` : whole.toLocaleString();
  } catch {
    return raw;
  }
}

/** cn utility */
export function cn(...cls: (string | boolean | null | undefined)[]): string {
  return cls.filter(Boolean).join(" ");
}

/** Format seconds to human-readable */
export function fmtSeconds(s: number): string {
  if (s < 60) return `~${s}s`;
  return `~${Math.ceil(s / 60)}m`;
}

/** USD compact format */
export function fmtUSD(n: number): string {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(2)}M`;
  if (n >= 1_000) return `$${(n / 1_000).toFixed(1)}K`;
  return `$${n.toFixed(2)}`;
}