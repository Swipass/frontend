"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { api, shortAddr, fmtAmount } from "@/lib/api";
import {
  PageHeader, TableCard, THead, TCell,
  StatusBadge, Pagination, AdminLoading, AdminEmpty,
} from "./AdminPrimitives";

const STATUSES = ["", "PENDING", "BRIDGING", "SUCCESS", "FAILED", "REFUNDED"];

export function AdminTransactions() {
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-executions", page, statusFilter],
    queryFn: async () => {
      const qs = statusFilter ? `&status=${statusFilter}` : "";
      const r = await api.get(`/admin/executions?page=${page}&limit=20${qs}`);
      return r.data;
    },
    placeholderData: (prev) => prev,
  });

  return (
    <div>
      <PageHeader title="Transactions" subtitle="All bridge executions" />

      {/* Status filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        {STATUSES.map(s => (
          <button key={s || "all"} onClick={() => { setStatusFilter(s); setPage(1); }}
            className="font-mono text-[0.65rem] px-3 py-1.5 rounded-lg transition-all"
            style={{
              background: statusFilter === s ? "var(--ink-0)" : "var(--surface)",
              color: statusFilter === s ? "var(--bg)" : "var(--ink-3)",
              border: "1px solid var(--border)",
              cursor: "pointer",
            }}>
            {s || "All"}
          </button>
        ))}
      </div>

      {isLoading ? <AdminLoading /> : (
        <TableCard title="Executions" badge={`${data?.total ?? 0} total`}>
          {data?.items?.length > 0 ? (
            <>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <THead cols={["Status", "Route", "Amount", "From wallet", "Recipient", "Tx Hash", "Time"]} />
                  <tbody>
                    {data.items.map((ex: any) => {
                      const fromAmt = ex.quote?.fromAmount && ex.quote?.fromToken
                        ? `${fmtAmount(ex.quote.fromAmount, tokenDecimals(ex.quote.fromToken))} ${ex.quote.fromToken}`
                        : "—";
                      return (
                        <tr key={ex.id} className="hover:bg-[var(--surface-2)] transition-colors">
                          <TCell><StatusBadge status={ex.status} /></TCell>
                          <TCell mono>
                            {ex.quote?.fromToken}@{ex.quote?.fromChain}
                            <span style={{ color: "var(--ink-5)" }}> → </span>
                            {ex.quote?.toToken}@{ex.quote?.toChain}
                          </TCell>
                          <TCell mono>{fromAmt}</TCell>
                          <TCell mono dim>{shortAddr(ex.userAddress ?? "", 10)}</TCell>
                          <TCell mono dim>
                            {ex.recipientAddress && ex.recipientAddress !== ex.userAddress
                              ? shortAddr(ex.recipientAddress, 10)
                              : <span style={{ color: "var(--ink-5)" }}>same</span>}
                          </TCell>
                          <TCell mono dim>
                            {ex.txHash
                              ? <a href={`https://etherscan.io/tx/${ex.txHash}`} target="_blank" rel="noreferrer"
                                  className="hover:underline" style={{ color: "var(--ink-2)" }}>
                                  {shortAddr(ex.txHash, 10)}
                                </a>
                              : <span style={{ color: "var(--ink-5)" }}>—</span>}
                          </TCell>
                          <TCell mono dim>{new Date(ex.createdAt).toLocaleString()}</TCell>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <Pagination page={page} pages={data.pages} total={data.total} onPage={setPage} />
            </>
          ) : (
            <AdminEmpty msg="No transfers match this filter" />
          )}
        </TableCard>
      )}
    </div>
  );
}

/* Map token symbol to decimals for display purposes */
function tokenDecimals(symbol: string): number {
  const map: Record<string, number> = {
    USDC: 6, USDT: 6, WBTC: 8,
    ETH: 18, WETH: 18, DAI: 18,
    MATIC: 18, AVAX: 18, BNB: 18, ARB: 18, OP: 18,
  };
  return map[symbol?.toUpperCase()] ?? 18;
}
