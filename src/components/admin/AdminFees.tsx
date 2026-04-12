"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Save, Info } from "lucide-react";
import toast from "react-hot-toast";
import { PageHeader, TableCard, AdminLoading } from "./AdminPrimitives";

export function AdminFees() {
  const qc = useQueryClient();

  const { data: cfg, isLoading } = useQuery({
    queryKey: ["admin-fees"],
    queryFn: async () => { const r = await api.get("/admin/fees"); return r.data.data; },
  });

  // Local form state (percentages entered as %, stored as decimals)
  const [feePct, setFeePct] = useState("");
  const [minPct, setMinPct] = useState("");
  const [maxPct, setMaxPct] = useState("");

  const mutation = useMutation({
    mutationFn: async (payload: Record<string, number>) => api.put("/admin/fees", payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["admin-fees"] });
      toast.success("Fee config updated");
      setFeePct(""); setMinPct(""); setMaxPct("");
    },
    onError: () => toast.error("Failed to update fee config"),
  });

  const save = () => {
    const payload: Record<string, number> = {};
    if (feePct) payload.feePct = parseFloat(feePct) / 100;
    if (minPct) payload.minFeePct = parseFloat(minPct) / 100;
    if (maxPct) payload.maxFeePct = parseFloat(maxPct) / 100;
    if (Object.keys(payload).length === 0) { toast.error("Enter at least one value to update"); return; }
    mutation.mutate(payload);
  };

  if (isLoading) return <AdminLoading />;

  const currentFee = ((cfg?.feePct ?? 0) * 100).toFixed(3);
  const currentMin = ((cfg?.minFeePct ?? 0) * 100).toFixed(3);
  const currentMax = ((cfg?.maxFeePct ?? 0) * 100).toFixed(3);

  return (
    <div>
      <PageHeader title="Fee Configuration" subtitle="Set the Swipass transaction fee applied to all bridges" />

      <div className="grid md:grid-cols-2 gap-6">

        {/* Current config display */}
        <TableCard title="Current Configuration">
          <div className="p-5 space-y-0">
            {[
              { label: "Default fee", value: `${currentFee}%`, desc: "Applied to every bridge transaction" },
              { label: "Minimum fee", value: `${currentMin}%`, desc: "Floor — never charged less" },
              { label: "Maximum fee", value: `${currentMax}%`, desc: "Cap — never charged more" },
            ].map(({ label, value, desc }, i, arr) => (
              <div key={label} className="flex items-center justify-between py-4"
                style={{ borderBottom: i < arr.length - 1 ? "1px solid var(--g700)" : "none" }}>
                <div>
                  <div className="font-sans text-sm font-medium" style={{ color: "var(--g200)" }}>{label}</div>
                  <div className="font-mono text-[0.62rem] mt-0.5" style={{ color: "var(--g500)" }}>{desc}</div>
                </div>
                <div className="font-display font-black text-2xl" style={{ color: "var(--g50)", letterSpacing: "-0.04em" }}>
                  {value}
                </div>
              </div>
            ))}
          </div>
        </TableCard>

        {/* Update form */}
        <TableCard title="Update Fees">
          <div className="p-5 space-y-5">
            {/* Info box */}
            <div className="flex gap-2.5 p-3 rounded-xl"
              style={{ background: "var(--g900)", border: "1px solid var(--g700)" }}>
              <Info className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--g500)" }} />
              <p className="font-mono text-[0.65rem] leading-relaxed" style={{ color: "var(--g400)" }}>
                Enter percentages (e.g. 0.3 = 0.3%). Leave blank to keep current value.
                Changes apply to all new quotes immediately.
              </p>
            </div>

            {[
              { label: "Default fee %", val: feePct, set: setFeePct, placeholder: `current: ${currentFee}%` },
              { label: "Minimum fee %", val: minPct, set: setMinPct, placeholder: `current: ${currentMin}%` },
              { label: "Maximum fee %", val: maxPct, set: setMaxPct, placeholder: `current: ${currentMax}%` },
            ].map(({ label, val, set, placeholder }) => (
              <div key={label}>
                <label className="font-mono text-[0.6rem] tracking-widest uppercase block mb-1.5"
                  style={{ color: "var(--g500)" }}>{label}</label>
                <input type="number" step="0.001" min="0.05" max="2" value={val}
                  onChange={e => set(e.target.value)} placeholder={placeholder}
                  className="w-full px-4 py-3 rounded-xl font-mono text-sm iz-input"
                  style={{ background: "var(--g900)", border: "1px solid var(--g700)", color: "var(--g50)", outline: "none" }} />
              </div>
            ))}

            <button onClick={save} disabled={mutation.isPending}
              className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-display font-bold text-sm tracking-widest uppercase transition-all"
              style={{
                background: mutation.isPending ? "var(--g700)" : "var(--g50)",
                color: mutation.isPending ? "var(--g500)" : "var(--g900)",
                cursor: mutation.isPending ? "not-allowed" : "pointer",
              }}>
              <Save className="w-4 h-4" />
              {mutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </TableCard>
      </div>
    </div>
  );
}