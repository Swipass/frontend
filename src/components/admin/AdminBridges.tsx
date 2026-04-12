"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Shield, ShieldOff, Info } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader, TableCard, AdminLoading, AdminEmpty } from "./AdminPrimitives";

export function AdminBridges() {
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["admin-bridges"],
    queryFn: async () => { const r = await api.get("/admin/bridges"); return r.data.data; },
  });

  const toggle = useMutation({
    mutationFn: async ({ name, isEnabled }: { name: string; isEnabled: boolean }) =>
      api.put(`/admin/bridges/${name}`, { isEnabled }),
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ["admin-bridges"] });
      toast.success(`${vars.name} ${vars.isEnabled ? "enabled" : "disabled"}`);
    },
    onError: () => toast.error("Failed to update bridge"),
  });

  if (isLoading) return <AdminLoading />;

  const bridges: any[] = data ?? [];
  const enabled = bridges.filter(b => b.isEnabled).length;

  return (
    <div>
      <PageHeader
        title="Bridge Control"
        subtitle={`${enabled} of ${bridges.length} bridges enabled`}
      />

      {/* Info note */}
      <div className="flex gap-2.5 p-4 rounded-2xl mb-6"
        style={{ background: "var(--g800)", border: "1px solid var(--g700)" }}>
        <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--g500)" }} />
        <p className="font-mono text-[0.68rem] leading-relaxed" style={{ color: "var(--g400)" }}>
          Disabling a bridge prevents it from being used in new quotes.
          In-flight transactions are not affected. LI.FI may still select
          a disabled bridge if it is the only available path — full filtering
          requires a custom LI.FI plan.
        </p>
      </div>

      <TableCard title="Registered Bridges">
        {bridges.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ background: "var(--g900)" }}>
                  {["Bridge", "Status", "Notes", "Action"].map(h => (
                    <th key={h} className="text-left px-5 py-3 font-mono text-[0.58rem] tracking-widest uppercase"
                      style={{ color: "var(--g500)", borderBottom: "1px solid var(--g700)" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {bridges.map((b: any) => (
                  <tr key={b.id} className="hover:bg-[var(--g800)] transition-colors">
                    {/* Name */}
                    <td className="px-5 py-4" style={{ borderBottom: "1px solid var(--g700)" }}>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl flex items-center justify-center"
                          style={{ background: b.isEnabled ? "var(--g800)" : "var(--g900)", border: "1px solid var(--g700)" }}>
                          {b.isEnabled
                            ? <Shield className="w-4 h-4" style={{ color: "#22c55e" }} />
                            : <ShieldOff className="w-4 h-4" style={{ color: "var(--g500)" }} />}
                        </div>
                        <span className="font-mono font-medium text-sm capitalize" style={{ color: "var(--g200)" }}>
                          {b.name}
                        </span>
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-5 py-4" style={{ borderBottom: "1px solid var(--g700)" }}>
                      <span className="font-mono text-[0.62rem] tracking-widest uppercase px-2.5 py-1 rounded-lg"
                        style={{
                          color: b.isEnabled ? "#22c55e" : "var(--g500)",
                          background: b.isEnabled ? "#22c55e12" : "var(--g900)",
                          border: `1px solid ${b.isEnabled ? "#22c55e22" : "var(--g700)"}`,
                        }}>
                        {b.isEnabled ? "Enabled" : "Disabled"}
                      </span>
                    </td>

                    {/* Notes */}
                    <td className="px-5 py-4" style={{ borderBottom: "1px solid var(--g700)" }}>
                      <span className="font-mono text-[0.68rem]" style={{ color: "var(--g500)" }}>
                        {b.notes || "—"}
                      </span>
                    </td>

                    {/* Toggle */}
                    <td className="px-5 py-4" style={{ borderBottom: "1px solid var(--g700)" }}>
                      <button
                        onClick={() => toggle.mutate({ name: b.name, isEnabled: !b.isEnabled })}
                        disabled={toggle.isPending}
                        className="font-mono text-[0.65rem] px-3 py-1.5 rounded-lg transition-all"
                        style={{
                          background: "var(--g900)",
                          border: `1px solid ${b.isEnabled ? "#e74c3c33" : "#22c55e33"}`,
                          color: b.isEnabled ? "#e74c3c" : "#22c55e",
                          cursor: toggle.isPending ? "not-allowed" : "pointer",
                          opacity: toggle.isPending ? 0.5 : 1,
                        }}>
                        {b.isEnabled ? "Disable" : "Enable"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <AdminEmpty msg="No bridges registered" />
        )}
      </TableCard>
    </div>
  );
}