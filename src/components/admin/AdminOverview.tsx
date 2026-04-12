"use client";

import { useQuery } from "@tanstack/react-query";
import { api, shortAddr } from "@/lib/api";
import { PageHeader, StatCard, TableCard, THead, TCell, StatusBadge, AdminLoading } from "./AdminPrimitives";

export function AdminOverview() {
  const { data, isLoading } = useQuery({
    queryKey: ["admin-stats"],
    queryFn: async () => { const r = await api.get("/admin/stats"); return r.data.data; },
    refetchInterval: 30_000,
  });

  if (isLoading) return <AdminLoading />;

  const s = data ?? {};

  return (
    <div>
      <PageHeader title="Overview" subtitle="Platform health at a glance" />

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total transfers" value={s.totalExecutions ?? 0} accent />
        <StatCard label="Success rate" value={`${s.successRate ?? 0}%`} sub={`${s.successExecutions ?? 0} successful`} />
        <StatCard label="Transfers today" value={s.dailyExecutions ?? 0} sub={`${s.weeklyExecutions ?? 0} this week`} />
        <StatCard label="In flight" value={s.pendingExecutions ?? 0} sub="pending + bridging" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total quotes" value={s.totalQuotes ?? 0} />
        <StatCard label="Failed transfers" value={s.failedExecutions ?? 0} />
        <StatCard label="7-day transfers" value={s.weeklyExecutions ?? 0} />
        <StatCard label="Quote → exec rate" value={
          s.totalQuotes > 0 ? `${Math.round((s.totalExecutions / s.totalQuotes) * 100)}%` : "—"
        } />
      </div>

      {/* Recent transfers table */}
      <TableCard title="Recent Transfers" badge="Last 10">
        {s.recentExecutions?.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <THead cols={["Status", "Route", "From wallet", "Time"]} />
              <tbody>
                {s.recentExecutions.map((ex: any) => (
                  <tr key={ex.id} className="hover:bg-[var(--g800)] transition-colors">
                    <TCell><StatusBadge status={ex.status} /></TCell>
                    <TCell mono>
                      {ex.quote?.fromToken}@{ex.quote?.fromChain} → {ex.quote?.toToken}@{ex.quote?.toChain}
                    </TCell>
                    <TCell mono dim>{shortAddr(ex.userAddress ?? "", 10)}</TCell>
                    <TCell mono dim>{new Date(ex.createdAt).toLocaleString()}</TCell>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="py-12 text-center font-mono text-sm" style={{ color: "var(--g500)" }}>
            No transfers yet — bridge something!
          </div>
        )}
      </TableCard>
    </div>
  );
}