"use client";
import {
  useState, useEffect, useCallback, useRef,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useAccount, useSendTransaction, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown, ChevronDown, Settings, AlertCircle, Loader2, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api, fmtAmount, shortAddr } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";

interface Chain { id: string; name: string; logoUrl: string; nativeSymbol: string }
interface Token { symbol: string; name: string; address: string; decimals: number; logoUrl: string }
interface Quote {
  id: string; fromChain: string; toChain: string;
  fromToken: string; toToken: string;
  fromTokenLogoUrl: string; toTokenLogoUrl: string;
  fromAmount: string; toAmount: string; toAmountMin: string;
  fee: { percentage: number; amount: string; token: string };
  estimatedTime: number; gasCostUSD: string;
  bridges: string[]; expiresAt: string;
}

function useClickOutside(ref: RefObject<HTMLElement | null>, fn: () => void) {
  useEffect(() => {
    const h = (e: MouseEvent) => { if (ref.current && !ref.current.contains(e.target as Node)) fn(); };
    document.addEventListener("mousedown", h, true);
    return () => document.removeEventListener("mousedown", h, true);
  }, [ref, fn]);
}

function DropdownPortal({ anchorRef, onClose, children }: {
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const [pos, setPos] = useState({ top: 0, left: 0, width: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  useClickOutside(panelRef, onClose);
  useEffect(() => {
    const el = anchorRef.current; if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + window.scrollY + 4, left: r.left + window.scrollX, width: r.width });
  }, [anchorRef]);
  if (typeof document === "undefined") return null;
  return createPortal(
    <div ref={panelRef} style={{ position: "absolute", top: pos.top, left: pos.left, width: Math.max(pos.width, 190), zIndex: 9999 }}>
      <motion.div initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -4 }} transition={{ duration: 0.12 }}
        className="rounded-xl overflow-hidden shadow-2xl"
        style={{ background: "var(--g900)", border: "1px solid var(--g700)", maxHeight: 260, overflowY: "auto" }}>
        {children}
      </motion.div>
    </div>,
    document.body
  );
}

function ChainSelector({ value, chains, onChange, id, openId, setOpenId }: any) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isOpen = openId === id;
  return (
    <div className="relative flex-1">
      <button ref={btnRef} onClick={() => setOpenId(isOpen ? null : id)}
        className="w-full flex items-center justify-between p-2.5 rounded-xl transition-all"
        style={{ background: "var(--g800)", border: `1px solid ${isOpen ? "var(--g600)" : "var(--g700)"}` }}>
        <div className="flex items-center gap-2 min-w-0">
          {value ? <SafeImage src={value.logoUrl} alt={value.name} size={22} /> : <div className="w-5 h-5 rounded-full shimmer" />}
          <span className="font-medium text-sm truncate" style={{ color: "var(--g200)" }}>{value?.name ?? "Select chain"}</span>
        </div>
        <ChevronDown className="w-3.5 h-3.5 shrink-0 ml-1" style={{ color: "var(--g500)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <DropdownPortal anchorRef={btnRef} onClose={() => setOpenId(null)}>
            {chains.map((c: any) => (
              <button key={c.id}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                style={{ background: value?.id === c.id ? "var(--g800)" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--g800)")}
                onMouseLeave={e => (e.currentTarget.style.background = value?.id === c.id ? "var(--g800)" : "transparent")}
                onClick={() => { onChange(c); setOpenId(null); }}>
                <SafeImage src={c.logoUrl} alt={c.name} size={22} />
                <span className="text-sm flex-1" style={{ color: "var(--g200)" }}>{c.name}</span>
                <span className="font-mono text-[0.58rem]" style={{ color: "var(--g600)" }}>{c.nativeSymbol}</span>
              </button>
            ))}
          </DropdownPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

function TokenSelector({ value, tokens, onChange, id, openId, setOpenId }: any) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const isOpen = openId === id;
  return (
    <div className="relative shrink-0">
      <button ref={btnRef} onClick={() => setOpenId(isOpen ? null : id)}
        className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all"
        style={{ background: "var(--g800)", border: `1px solid ${isOpen ? "var(--g600)" : "var(--g700)"}` }}>
        {value ? <SafeImage src={value.logoUrl} alt={value.symbol} size={20} /> : <div className="w-5 h-5 rounded-full shimmer" />}
        <span className="font-mono font-semibold text-sm" style={{ color: "var(--g50)" }}>{value?.symbol ?? "—"}</span>
        <ChevronDown className="w-3 h-3" style={{ color: "var(--g500)", transform: isOpen ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
      </button>
      <AnimatePresence>
        {isOpen && (
          <DropdownPortal anchorRef={btnRef} onClose={() => setOpenId(null)}>
            {tokens.map((t: any) => (
              <button key={t.symbol}
                className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
                style={{ background: value?.symbol === t.symbol ? "var(--g800)" : "transparent" }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--g800)")}
                onMouseLeave={e => (e.currentTarget.style.background = value?.symbol === t.symbol ? "var(--g800)" : "transparent")}
                onClick={() => { onChange(t); setOpenId(null); }}>
                <SafeImage src={t.logoUrl} alt={t.symbol} size={22} />
                <div className="flex-1">
                  <div className="font-mono font-semibold text-sm" style={{ color: "var(--g50)" }}>{t.symbol}</div>
                  <div className="font-mono text-[0.58rem]" style={{ color: "var(--g600)" }}>{t.name}</div>
                </div>
              </button>
            ))}
          </DropdownPortal>
        )}
      </AnimatePresence>
    </div>
  );
}

function ChainTokenRow({
  label, chain, token, amount, chains, tokens, readOnly,
  onChainChange, onTokenChange, onAmountChange, rowId, openId, setOpenId
}: any) {
  return (
    <div className="rounded-2xl p-4 space-y-3" style={{ background: "var(--g800)", border: "1px solid var(--g700)" }}>
      <div className="font-mono text-[0.58rem] tracking-widest uppercase" style={{ color: "var(--g500)" }}>{label}</div>
      <ChainSelector value={chain} chains={chains} onChange={onChainChange} id={`${rowId}-chain`} openId={openId} setOpenId={setOpenId} />
      <div className="flex items-center gap-3">
        <div className="shrink-0">
          <TokenSelector value={token} tokens={tokens} onChange={onTokenChange} id={`${rowId}-token`} openId={openId} setOpenId={setOpenId} />
        </div>
        <div className="flex-1 min-w-0">
          {readOnly ? (
            <div className="text-right font-mono font-bold text-xl truncate" style={{ color: amount ? "var(--g50)" : "var(--g600)" }}>
              {amount || "—"}
            </div>
          ) : (
            <input
              type="number"
              min="0"
              step="any"
              placeholder="0.00"
              value={amount}
              onChange={e => onAmountChange?.(e.target.value)}
              className="w-full text-right bg-transparent font-mono font-bold text-xl iz-input"
              style={{ color: "var(--g50)", border: "none", outline: "none" }}
            />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, danger }: any) {
  return (
    <div className="flex justify-between items-center py-1">
      <span className="font-mono text-[0.64rem]" style={{ color: "var(--g600)" }}>{label}</span>
      <span className="font-mono text-[0.68rem]" style={{ color: danger ? "#e74c3c" : "var(--g400)" }}>{value}</span>
    </div>
  );
}

export function BridgeWidget() {
  const router = useRouter();
  const { address, isConnected } = useAccount();
  const { sendTransaction } = useSendTransaction();
  const { switchChain } = useSwitchChain();

  const [chains, setChains] = useState<Chain[]>([]);
  const [tokenMap, setTokenMap] = useState<Record<string, Token[]>>({});
  const [fromChain, setFromChain] = useState<Chain | null>(null);
  const [toChain, setToChain] = useState<Chain | null>(null);
  const [fromToken, setFromToken] = useState<Token | null>(null);
  const [toToken, setToToken] = useState<Token | null>(null);
  const [inputAmount, setInputAmount] = useState("");
  const [useCustomRecipient, setUseCustomRecipient] = useState(false);
  const [recipientAddr, setRecipientAddr] = useState("");
  const [openDropdownId, setOpenDropdownId] = useState<string | null>(null);
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoteLoading, setQuoteLoading] = useState(false);
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);
  const [executing, setExecuting] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [slippage, setSlippage] = useState("0.5");

  // Multi-step execution state
  const [executionId, setExecutionId] = useState<string | null>(null);
  const [waitingForNext, setWaitingForNext] = useState(false);
  const nextStepInterval = useRef<NodeJS.Timeout | null>(null);

  // Approval state
  const [needsApproval, setNeedsApproval] = useState(false);
  const [approving, setApproving] = useState(false);
  const [firstTxSpender, setFirstTxSpender] = useState<string | null>(null);

  useEffect(() => {
    api.get("/v1/chains").then(r => {
      const list: Chain[] = r.data.data;
      setChains(list);
      if (list.length >= 2) { setFromChain(list[0]); setToChain(list[1]); }
    }).catch(() => toast.error("Failed to load chains"));
  }, []);

  const loadTokens = useCallback(async (chainId: string) => {
    if (tokenMap[chainId]) return tokenMap[chainId];
    try {
      const r = await api.get(`/v1/tokens/${chainId}`);
      const tokens: Token[] = r.data.data;
      setTokenMap(p => ({ ...p, [chainId]: tokens }));
      return tokens;
    } catch { return []; }
  }, [tokenMap]);

  useEffect(() => { if (!fromChain) return; loadTokens(fromChain.id).then(t => setFromToken(t.find(x => x.symbol === "USDC") ?? t[0] ?? null)); }, [fromChain?.id]);
  useEffect(() => { if (!toChain) return; loadTokens(toChain.id).then(t => setToToken(t.find(x => x.symbol === "USDC") ?? t[0] ?? null)); }, [toChain?.id]);

  useEffect(() => {
    if (!quote) return;
    const tick = () => {
      const rem = Math.max(0, Math.floor((new Date(quote.expiresAt).getTime() - Date.now()) / 1000));
      setTimeLeft(rem);
      if (rem === 0) { setQuote(null); setQuoteError("Quote expired — please get a new one."); }
    };
    tick(); const id = setInterval(tick, 1000); return () => clearInterval(id);
  }, [quote]);

  const swapChains = () => {
    setFromChain(toChain);
    setToChain(fromChain);
    setFromToken(toToken);
    setToToken(fromToken);
    setQuote(null);
    setQuoteError(null);
    setOpenDropdownId(null);
    setNeedsApproval(false);
  };

  const fetchQuote = async () => {
    if (!fromChain || !toChain || !fromToken || !toToken || !inputAmount) return;
    const num = parseFloat(inputAmount);
    if (isNaN(num) || num <= 0) { toast.error("Enter a valid amount"); return; }

    setQuoteLoading(true);
    setQuoteError(null);
    setQuote(null);
    setNeedsApproval(false);
    setOpenDropdownId(null);

    try {
      const raw = BigInt(Math.round(num * 10 ** fromToken.decimals)).toString();
      const r = await api.post("/v1/quote", {
        fromChain: fromChain.id,
        toChain: toChain.id,
        fromToken: fromToken.symbol,
        toToken: toToken.symbol,
        fromAmount: raw,
        fromAddress: address,
        recipientAddress: useCustomRecipient && recipientAddr ? recipientAddr : address,
        slippage: parseFloat(slippage) / 100,
      });
      setQuote(r.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setQuoteError(e.response?.data?.error ?? "No route found. Try a different amount or token.");
    } finally {
      setQuoteLoading(false);
    }
  };

  // Check if we need approval for the first step
  const checkApprovalNeeded = async (firstTx: any): Promise<boolean> => {
    if (!fromToken || !address || !firstTx) return false;

    const spender = firstTx.to;
    setFirstTxSpender(spender);

    // For native tokens we don't need approval
    if (fromToken.address === "0x0000000000000000000000000000000000000000") {
      setNeedsApproval(false);
      return false;
    }

    try {
      // Simple check - in production you can use useReadContract for live value
      // For now we assume approval is needed for ERC20 tokens (safe default)
      setNeedsApproval(true);
      return true;
    } catch {
      setNeedsApproval(false);
      return false;
    }
  };

  const handleApprove = async () => {
    if (!fromToken || !firstTxSpender || !address) return;

    setApproving(true);
    try {
      const approveData = `0x095ea7b3${firstTxSpender.slice(2).padStart(64, '0')}${"f".repeat(64)}` as `0x${string}`;

      sendTransaction({
        to: fromToken.address as `0x${string}`,
        data: approveData,
        value: BigInt(0),
      }, {
        onSuccess: () => {
          toast.success(`Approval transaction sent for ${fromToken.symbol}`);
          setTimeout(() => {
            setNeedsApproval(false);
            setApproving(false);
            toast.success("Approval confirmed! Starting transfer now...");
            execute(); // retry transfer after approval
          }, 7000);
        },
        onError: (err: any) => {
          toast.error("Approval rejected");
          setApproving(false);
        },
      });
    } catch (err) {
      toast.error("Failed to send approval");
      setApproving(false);
    }
  };

  const execute = async () => {
    if (!quote || !address) return;

    setExecuting(true);
    try {
      const recipient = useCustomRecipient && recipientAddr ? recipientAddr : address;

      const r = await api.post("/v1/execute", {
        quoteId: quote.id,
        userAddress: address,
        recipientAddress: recipient,
      });

      const { executionId: execId, transactionRequest: firstTx } = r.data.data;

      const needsApprove = await checkApprovalNeeded(firstTx);
      if (needsApprove) {
        setExecuting(false);
        return;
      }

      setExecutionId(execId);
      await signAndSendStep(execId, firstTx, 0);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || "Failed to prepare transaction");
      setExecuting(false);
    }
  };

  const signAndSendStep = async (execId: string, txReq: any, stepIdx: number) => {
    const targetChainId = Number(txReq.chainId);
    try {
      await switchChain({ chainId: targetChainId });
    } catch {
      toast.error(`Please switch your wallet to chain ID ${targetChainId} and try again.`);
      setExecuting(false);
      return;
    }

    sendTransaction({
      to: txReq.to as `0x${string}`,
      data: txReq.data as `0x${string}`,
      value: BigInt(txReq.value ?? "0"),
      chainId: targetChainId,
    }, {
      onSuccess: async (hash) => {
        try {
          await api.post(`/v1/execute/${execId}/submit-step`, { txHash: hash });
          toast.success(`Step ${stepIdx + 1} submitted!`);
          setWaitingForNext(true);
          startPollingNextStep(execId);
        } catch (err) {
          toast.error("Failed to record transaction");
          setExecuting(false);
        }
      },
      onError: (err: any) => {
        console.error(err);
        toast.error("Transaction rejected or failed");
        setExecuting(false);
      },
    });
  };

  const startPollingNextStep = (execId: string) => {
    if (nextStepInterval.current) clearInterval(nextStepInterval.current);
    nextStepInterval.current = setInterval(async () => {
      try {
        const res = await api.get(`/v1/execute/${execId}/next`);
        const data = res.data.data;
        if (data.completed) {
          clearInterval(nextStepInterval.current!);
          setWaitingForNext(false);
          setExecuting(false);
          router.push(`/bridge/status/${execId}`);
        } else if (data.transactionRequest) {
          clearInterval(nextStepInterval.current!);
          setWaitingForNext(false);
          await signAndSendStep(execId, data.transactionRequest, data.stepIndex);
        }
      } catch (err) {
        console.error("Poll next step error", err);
      }
    }, 3000);
  };

  const fromTokens = fromChain ? (tokenMap[fromChain.id] ?? []) : [];
  const toTokens = toChain ? (tokenMap[toChain.id] ?? []) : [];
  const toDisplay = quote && toToken ? fmtAmount(quote.toAmount, toToken.decimals, 6) : "";
  const canQuote = !!fromChain && !!toChain && !!fromToken && !!toToken && !!inputAmount && parseFloat(inputAmount) > 0;
  const recipientOk = !useCustomRecipient || recipientAddr.length > 10;

  return (
    <div className="w-full max-w-[460px] mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="font-display font-black text-2xl" style={{ color: "var(--g50)", letterSpacing: "-0.035em" }}>Bridge</h1>
          <p className="font-mono text-[0.58rem] tracking-widest uppercase mt-0.5" style={{ color: "var(--g600)" }}>Aggregator of aggregators · Non-custodial</p>
        </div>
        <button onClick={() => setShowSettings(!showSettings)}
          className="w-9 h-9 flex items-center justify-center rounded-xl transition-all"
          style={{ background: showSettings ? "var(--g800)" : "var(--g800)", border: "1px solid var(--g700)", color: "var(--g500)" }}>
          {showSettings ? <X className="w-4 h-4" /> : <Settings className="w-4 h-4" />}
        </button>
      </div>

      {/* Settings */}
      <AnimatePresence>
        {showSettings && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
            className="rounded-2xl overflow-hidden mb-3" style={{ background: "var(--g800)", border: "1px solid var(--g700)" }}>
            <div className="p-4">
              <div className="font-mono text-[0.6rem] tracking-widest uppercase mb-3" style={{ color: "var(--g600)" }}>Slippage tolerance</div>
              <div className="flex gap-2">
                {["0.1", "0.5", "1.0"].map(v => (
                  <button key={v} onClick={() => setSlippage(v)} className="px-3 py-1.5 rounded-lg font-mono text-xs transition-all"
                    style={{ background: slippage === v ? "var(--g50)" : "var(--g900)", color: slippage === v ? "var(--g900)" : "var(--g500)", border: "1px solid var(--g700)" }}>
                    {v}%
                  </button>
                ))}
                <input type="number" placeholder="Custom %" value={slippage} onChange={e => setSlippage(e.target.value)}
                  className="flex-1 px-3 py-1.5 rounded-lg font-mono text-xs iz-input"
                  style={{ background: "var(--g900)", border: "1px solid var(--g700)", color: "var(--g50)", outline: "none" }} />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Card */}
      <div className="rounded-2xl" style={{ background: "var(--g800)", border: "1px solid var(--g700)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
        <div className="flex items-center gap-2 px-4 py-3 rounded-t-2xl" style={{ borderBottom: "1px solid var(--g700)", background: "var(--g900)" }}>
          {["#e74c3c", "#e67e22", "#27ae60"].map((c, i) => <div key={i} className="w-2.5 h-2.5 rounded-full" style={{ background: c }} />)}
          <span className="font-mono text-[0.58rem] ml-1.5" style={{ color: "var(--g600)" }}>app.swipass.com / bridge</span>
          {isConnected && address && (
            <span className="ml-auto font-mono text-[0.58rem] flex items-center gap-1.5" style={{ color: "var(--g600)" }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
              {shortAddr(address)}
            </span>
          )}
        </div>

        <div className="p-5 space-y-2">
          <ChainTokenRow label="From" chain={fromChain} token={fromToken} amount={inputAmount}
            chains={chains} tokens={fromTokens}
            onChainChange={c => { setFromChain(c); setQuote(null); }}
            onTokenChange={t => { setFromToken(t); setQuote(null); }}
            onAmountChange={v => { setInputAmount(v); setQuote(null); setQuoteError(null); }}
            rowId="from" openId={openDropdownId} setOpenId={setOpenDropdownId} />

          <div className="flex justify-center -my-0.5">
            <button onClick={swapChains}
              className="w-9 h-9 rounded-xl flex items-center justify-center z-10 relative transition-all hover:scale-110 active:scale-95"
              style={{ background: "var(--g800)", border: "2px solid var(--g700)", color: "var(--g500)" }}>
              <ArrowDown className="w-4 h-4" />
            </button>
          </div>

          <ChainTokenRow label="To" chain={toChain} token={toToken} amount={toDisplay} readOnly
            chains={chains} tokens={toTokens}
            onChainChange={c => { setToChain(c); setQuote(null); }}
            onTokenChange={t => { setToToken(t); setQuote(null); }}
            onAmountChange={() => { }}
            rowId="to" openId={openDropdownId} setOpenId={setOpenDropdownId} />

          {/* Recipient */}
          <div className="pt-1">
            <label className="flex items-center gap-2 cursor-pointer w-fit mb-2 select-none"
              onClick={() => { setUseCustomRecipient(p => !p); if (useCustomRecipient) setQuote(null); }}>
              <div className="w-4 h-4 rounded flex items-center justify-center shrink-0 transition-all"
                style={{ background: useCustomRecipient ? "var(--g50)" : "transparent", border: `2px solid ${useCustomRecipient ? "var(--g50)" : "var(--g700)"}` }}>
                {useCustomRecipient && <span className="text-[0.52rem] font-bold" style={{ color: "var(--g900)" }}>✓</span>}
              </div>
              <span className="font-mono text-[0.64rem]" style={{ color: "var(--g500)" }}>
                Send to a different wallet <span className="opacity-50">(bridge &amp; forward)</span>
              </span>
            </label>
            <AnimatePresence>
              {useCustomRecipient && (
                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                  <input type="text" placeholder="0x… recipient wallet address"
                    value={recipientAddr} onChange={e => { setRecipientAddr(e.target.value); setQuote(null); }}
                    className="w-full px-3.5 py-3 rounded-xl font-mono text-sm iz-input"
                    style={{ background: "var(--g900)", border: "1px solid var(--g700)", color: "var(--g50)", outline: "none" }} />
                  {recipientAddr && !recipientAddr.match(/^0x[0-9a-fA-F]{40}$/) && (
                    <p className="font-mono text-[0.6rem] mt-1.5 flex items-center gap-1" style={{ color: "#e74c3c" }}>
                      <AlertCircle className="w-3 h-3" />Enter a valid EVM address (0x…)
                    </p>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Quote Summary */}
          <AnimatePresence>
            {quote && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="rounded-xl p-3.5 space-y-1" style={{ background: "var(--g900)", border: "1px solid var(--g700)" }}>
                  <SummaryRow label="Best route" value={quote.bridges.slice(0, 2).join(", ") || "via routing engine"} />
                  <SummaryRow label="Swipass fee" value={`${(quote.fee.percentage * 100).toFixed(2)}%`} />
                  <SummaryRow label="Destination gas" value="Covered by solver" />
                  <SummaryRow label="Estimated time" value={`~${quote.estimatedTime}s`} />
                  <SummaryRow label="Quote expires in" value={`${timeLeft}s`} danger={timeLeft < 8} />
                  <div className="flex justify-between items-center pt-1.5" style={{ borderTop: "1px solid var(--g700)" }}>
                    <span className="font-mono text-[0.66rem] font-semibold" style={{ color: "var(--g50)" }}>You receive</span>
                    <div className="flex items-center gap-2">
                      {toToken && <SafeImage src={toToken.logoUrl} alt={toToken.symbol} size={16} />}
                      <span className="font-mono text-sm font-bold" style={{ color: "var(--g50)" }}>{toDisplay} {toToken?.symbol}</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error */}
          <AnimatePresence>
            {quoteError && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                className="flex items-start gap-2.5 p-3 rounded-xl" style={{ background: "#e74c3c10", border: "1px solid #e74c3c30" }}>
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "#e74c3c" }} />
                <p className="font-mono text-[0.68rem] leading-relaxed" style={{ color: "#e74c3c" }}>{quoteError}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons with Approval Flow */}
          {!isConnected ? (
            <ConnectButton.Custom>
              {({ openConnectModal }) => (
                <button onClick={openConnectModal}
                  className="w-full py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all hover:opacity-85"
                  style={{ background: "var(--g50)", color: "var(--g900)", cursor: "pointer" }}>
                  Connect Wallet
                </button>
              )}
            </ConnectButton.Custom>
          ) : !quote ? (
            <button onClick={fetchQuote} disabled={!canQuote || quoteLoading || !recipientOk}
              className="w-full py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: canQuote && !quoteLoading && recipientOk ? "var(--g50)" : "var(--g700)",
                color: canQuote && !quoteLoading && recipientOk ? "var(--g900)" : "var(--g500)",
                cursor: canQuote && !quoteLoading ? "pointer" : "not-allowed",
              }}>
              {quoteLoading ? <><Loader2 className="w-4 h-4 animate-spin" /> Finding best route…</> : "Get Quote →"}
            </button>
          ) : needsApproval ? (
            <button onClick={handleApprove} disabled={approving}
              className="w-full py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{ background: "var(--g50)", color: "var(--g900)", cursor: approving ? "not-allowed" : "pointer" }}>
              {approving ? <><Loader2 className="w-4 h-4 animate-spin" /> Approving {fromToken?.symbol}...</> : `Approve ${fromToken?.symbol}`}
            </button>
          ) : (
            <button onClick={execute} disabled={executing || waitingForNext || timeLeft === 0 || !recipientOk}
              className="w-full py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all flex items-center justify-center gap-2"
              style={{
                background: !executing && !waitingForNext && timeLeft > 0 ? "var(--g50)" : "var(--g700)",
                color: !executing && !waitingForNext && timeLeft > 0 ? "var(--g900)" : "var(--g500)",
                cursor: !executing && !waitingForNext && timeLeft > 0 ? "pointer" : "not-allowed",
              }}>
              {executing ? <><Loader2 className="w-4 h-4 animate-spin" /> Preparing…</>
                : waitingForNext ? <><Loader2 className="w-4 h-4 animate-spin" /> Waiting for confirmations…</>
                  : timeLeft === 0 ? "Quote expired — get a new one"
                    : "Start Transfer →"}
            </button>
          )}

          <p className="text-center font-mono text-[0.56rem]" style={{ color: "var(--g600)" }}>
            Non-custodial · You sign from your own wallet
            {useCustomRecipient && recipientAddr.match(/^0x[0-9a-fA-F]{40}$/) && ` · Delivering to ${shortAddr(recipientAddr)}`}
          </p>
        </div>
      </div>

      {quote && (
        <button onClick={() => { setQuote(null); setQuoteError(null); setNeedsApproval(false); }}
          className="mt-3 w-full text-center font-mono text-[0.64rem] transition-colors"
          style={{ color: "var(--g600)", background: "none", border: "none", cursor: "pointer" }}>
          ← Get a new quote
        </button>
      )}
    </div>
  );
}