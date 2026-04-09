/* Shared admin UI primitives — imported by all admin page components */

import { ReactNode } from "react";
import { Loader2 } from "lucide-react";

/* ── Page header ─────────────────────────────────────────────── */
export function PageHeader({ title, subtitle, action }: {
  title: string; subtitle?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between mb-8">
      <div>
        <h1 className="font-display font-black text-2xl" style={{ color: "var(--ink-0)", letterSpacing: "-0.04em" }}>
          {title}
        </h1>
        {subtitle && (
          <p className="font-mono text-[0.65rem] mt-1" style={{ color: "var(--ink-4)" }}>{subtitle}</p>
        )}
      </div>
      {action}
    </div>
  );
}

/* ── Stat card ───────────────────────────────────────────────── */
export function StatCard({ label, value, sub, accent }: {
  label: string; value: string | number; sub?: string; accent?: boolean;
}) {
  return (
    <div className="rounded-2xl p-5" style={{
      background: accent ? "var(--ink-0)" : "var(--surface)",
      border: `1px solid ${accent ? "transparent" : "var(--border)"}`,
    }}>
      <div className="font-mono text-[0.58rem] tracking-widest uppercase mb-2"
        style={{ color: accent ? "rgba(249,248,246,0.4)" : "var(--ink-4)" }}>
        {label}
      </div>
      <div className="font-display font-black text-3xl" style={{
        color: accent ? "var(--bg)" : "var(--ink-0)",
        letterSpacing: "-0.04em",
      }}>
        {value}
      </div>
      {sub && (
        <div className="font-mono text-[0.62rem] mt-1" style={{ color: accent ? "rgba(249,248,246,0.4)" : "var(--ink-4)" }}>
          {sub}
        </div>
      )}
    </div>
  );
}

/* ── Table card wrapper ──────────────────────────────────────── */
export function TableCard({ title, badge, children }: {
  title: string; badge?: string; children: ReactNode;
}) {
  return (
    <div className="rounded-2xl overflow-hidden" style={{ background: "var(--surface)", border: "1px solid var(--border)" }}>
      <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: "1px solid var(--border)" }}>
        <span className="font-display font-bold text-sm" style={{ color: "var(--ink-0)" }}>{title}</span>
        {badge && <span className="font-mono text-[0.6rem] tracking-widest uppercase" style={{ color: "var(--ink-4)" }}>{badge}</span>}
      </div>
      {children}
    </div>
  );
}

/* ── Table row helpers ───────────────────────────────────────── */
export function THead({ cols }: { cols: string[] }) {
  return (
    <thead>
      <tr style={{ background: "var(--surface-2)" }}>
        {cols.map(c => (
          <th key={c} className="text-left px-5 py-3 font-mono text-[0.58rem] tracking-widest uppercase"
            style={{ color: "var(--ink-4)", borderBottom: "1px solid var(--border)", whiteSpace: "nowrap" }}>
            {c}
          </th>
        ))}
      </tr>
    </thead>
  );
}

export function TCell({ children, mono, dim, error, style }: {
  children: ReactNode; mono?: boolean; dim?: boolean; error?: boolean;
  style?: React.CSSProperties;
}) {
  return (
    <td className="px-5 py-3.5" style={{
      fontFamily: mono ? "var(--font-dm-mono)" : "var(--font-dm-sans)",
      fontSize: mono ? "0.75rem" : "0.85rem",
      color: error ? "#e74c3c" : dim ? "var(--ink-4)" : "var(--ink-2)",
      borderBottom: "1px solid var(--border)",
      ...style,
    }}>
      {children}
    </td>
  );
}

/* ── Status badge ─────────────────────────────────────────────── */
const STATUS_COLORS: Record<string, { fg: string; bg: string }> = {
  SUCCESS:  { fg: "#22c55e", bg: "#22c55e15" },
  FAILED:   { fg: "#e74c3c", bg: "#e74c3c12" },
  BRIDGING: { fg: "#d4a017", bg: "#d4a01712" },
  PENDING:  { fg: "var(--ink-4)", bg: "var(--surface-2)" },
  REFUNDED: { fg: "var(--ink-3)", bg: "var(--surface-2)" },
};

export function StatusBadge({ status }: { status: string }) {
  const c = STATUS_COLORS[status] ?? STATUS_COLORS.PENDING;
  return (
    <span className="font-mono text-[0.6rem] tracking-widest uppercase px-2 py-1 rounded-lg"
      style={{ color: c.fg, background: c.bg, border: `1px solid ${c.fg}22` }}>
      {status}
    </span>
  );
}

/* ── Pagination ──────────────────────────────────────────────── */
export function Pagination({ page, pages, total, onPage }: {
  page: number; pages: number; total: number; onPage: (p: number) => void;
}) {
  if (pages <= 1) return null;
  return (
    <div className="flex items-center justify-between px-5 py-3.5" style={{ borderTop: "1px solid var(--border)" }}>
      <span className="font-mono text-[0.65rem]" style={{ color: "var(--ink-4)" }}>
        Page {page} of {pages} · {total} total
      </span>
      <div className="flex gap-2">
        <PaginBtn label="← Prev" disabled={page <= 1} onClick={() => onPage(page - 1)} />
        <PaginBtn label="Next →" disabled={page >= pages} onClick={() => onPage(page + 1)} />
      </div>
    </div>
  );
}

function PaginBtn({ label, disabled, onClick }: { label: string; disabled: boolean; onClick: () => void }) {
  return (
    <button onClick={onClick} disabled={disabled}
      className="font-mono text-[0.65rem] px-3 py-1.5 rounded-lg transition-all"
      style={{
        background: "var(--surface-2)", border: "1px solid var(--border)",
        color: disabled ? "var(--ink-5)" : "var(--ink-2)",
        cursor: disabled ? "not-allowed" : "pointer", opacity: disabled ? 0.5 : 1,
      }}>
      {label}
    </button>
  );
}

/* ── Loading / empty ──────────────────────────────────────────── */
export function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-16 gap-3">
      <Loader2 className="w-5 h-5 animate-spin" style={{ color: "var(--ink-4)" }} />
      <span className="font-mono text-sm" style={{ color: "var(--ink-4)" }}>Loading…</span>
    </div>
  );
}

export function AdminEmpty({ msg = "No data" }: { msg?: string }) {
  return (
    <div className="py-14 text-center font-mono text-sm" style={{ color: "var(--ink-4)" }}>{msg}</div>
  );
}
