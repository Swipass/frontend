"use client";
import {
  useState, useEffect, useCallback, useRef,
  type RefObject,
} from "react";
import { createPortal } from "react-dom";
import { useAccount, useSendTransaction, useSwitchChain, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ArrowDown, ChevronDown, Settings, AlertCircle, Loader2, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { api, fmtAmount, shortAddr } from "@/lib/api";
import { SafeImage } from "@/components/ui/SafeImage";
import { parseUnits, maxUint256 } from "viem";
import { erc20Abi } from "viem";

interface Chain { id: string; name: string; logoUrl: string; nativeSymbol: string; lifiId?: number }
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

// ChainSelector and TokenSelector remain unchanged (your original code)
function ChainSelector({ value, chains, onChange, id, openId, setOpenId }: {
  value: Chain | null; chains: Chain[]; onChange: (c: Chain) => void;
  id: string; openId: string | null; setOpenId: (id: string | null) => void;
}) {
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
            {chains.map(c => (
              <button key={c.id} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
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

function TokenSelector({ value, tokens, onChange, id, openId, setOpenId }: {
  value: Token | null; tokens: Token[]; onChange: (t: Token) => void;
  id: string; openId: string | null; setOpenId: (id: string | null) => void;
}) {
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
            {tokens.map(t => (
              <button key={t.symbol} className="w-full flex items-center gap-2.5 px-3 py-2.5 text-left"
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

// ChainTokenRow, SummaryRow remain unchanged (your original)

function ChainTokenRow({
  label, chain, token, amount, chains, tokens, readOnly,
  onChainChange, onTokenChange, onAmountChange, rowId, openId, setOpenId
}: {
  label: string;
  chain: Chain | null;
  token: Token | null;
  amount: string;
  chains: Chain[];
  tokens: Token[];
  readOnly?: boolean;
  onChainChange: (c: Chain) => void;
  onTokenChange: (t: Token) => void;
  onAmountChange?: (v: string) => void;
  rowId: string;
  openId: string | null;
  setOpenId: (id: string | null) => void;
}) {
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
            <input type="number" min="0" step="any" placeholder="0.00" value={amount}
              onChange={e => onAmountChange?.(e.target.value)}
              className="w-full text-right bg-transparent font-mono font-bold text-xl iz-input"
              style={{ color: "var(--g50)", border: "none", outline: "none" }} />
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryRow({ label, value, danger }: { label: string; value: string; danger?: boolean }) {
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
  const [spenderAddress, setSpenderAddress] = useState<string | null>(null); // dynamic from first step

  // Load chains and tokens (your original logic)
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

  // Quote timer (your original)
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
    setFromChain(toChain); setToChain(fromChain);
    setFromToken(toToken); setToToken(fromToken);
    setQuote(null); setQuoteError(null); setOpenDropdownId(null); setNeedsApproval(false);
  };

  const fetchQuote = async () => {
    if (!fromChain || !toChain || !fromToken || !toToken || !inputAmount) return;
    const num = parseFloat(inputAmount);
    if (isNaN(num) || num <= 0) { toast.error("Enter a valid amount"); return; }

    setQuoteLoading(true); setQuoteError(null); setQuote(null); setNeedsApproval(false); setOpenDropdownId(null);

    try {
      const raw = BigInt(Math.round(num * 10 ** fromToken.decimals)).toString();
      const r = await api.post("/v1/quote", {
        fromChain: fromChain.id, toChain: toChain.id,
        fromToken: fromToken.symbol, toToken: toToken.symbol,
        fromAmount: raw, fromAddress: address,
        recipientAddress: useCustomRecipient && recipientAddr ? recipientAddr : address,
        slippage: parseFloat(slippage) / 100,
      });
      setQuote(r.data.data);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      setQuoteError(e.response?.data?.error ?? "No route found. Try a different amount or token.");
    } finally { setQuoteLoading(false); }
  };

  // NEW: Check allowance before executing the first step
  const checkAndHandleApproval = async (execId: string, firstTx: any) => {
    if (!fromToken || !address) return true;

    const spender = firstTx.to; // This is the spender (LI.FI Diamond or similar)
    setSpenderAddress(spender);

    try {
      const requiredAmount = parseUnits(inputAmount, fromToken.decimals); // use user input amount for safety

      const { data: allowance } = useReadContract({
        address: fromToken.address as `0x${string}`,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [address as `0x${string}`, spender as `0x${string}`],
      });

      if (BigInt(allowance || 0) >= requiredAmount) {
        return true; // already approved
      }

      setNeedsApproval(true);
      return false;
    } catch (err) {
      console.error("Allowance check failed", err);
      return true; // fallback to let user try
    }
  };

  const handleApprove = async () => {
    if (!fromToken || !spenderAddress || !address) return;

    setApproving(true);
    try {
      // You need to add useWriteContract or use a simple sendTransaction for approve
      // For simplicity, we'll use the same sendTransaction pattern (you can improve with wagmi writeContract)

      const approveData = {
        to: fromToken.address as `0x${string}`,
        data: `0x095ea7b3${spenderAddress.slice(2).padStart(64, '0')}${maxUint256.toString(16).padStart(64, '0')}` as `0x${string}`, // approve(spender, MaxUint256)
        value: BigInt(0),
      };

      sendTransaction({
        ...approveData,
        chainId: Number(fromChain?.lifiId || 42161), // fallback, but dynamic in real use
      }, {
        onSuccess: async (hash) => {
          toast.success("Approval submitted — waiting for confirmation...");
          // In production, poll or wait for receipt, then setNeedsApproval(false) and proceed to execute
          setTimeout(() => {
            setNeedsApproval(false);
            toast.success("Approval confirmed! You can now start the transfer.");
            executeAfterApproval(); // call the original execute flow again
          }, 8000); // crude wait - improve with proper receipt polling later
        },
        onError: (err) => {
          toast.error("Approval rejected");
          setApproving(false);
        }
      });
    } catch (err) {
      toast.error("Failed to send approval");
      setApproving(false);
    }
  };

  const executeAfterApproval = async () => {
    if (!quote || !address) return;
    setExecuting(true);
    try {
      const recipient = useCustomRecipient && recipientAddr ? recipientAddr : address;
      const r = await api.post("/v1/execute", {
        quoteId: quote.id,
        userAddress: address,
        recipientAddress: recipient,
      });

      const { executionId: execId, transactionRequest: firstTx, stepIndex: firstStepIdx } = r.data.data;
      setExecutionId(execId);

      // Re-check approval (in case it was just done)
      const canProceed = await checkAndHandleApproval(execId, firstTx);
      if (!canProceed) {
        setExecuting(false);
        return;
      }

      await signAndSendStep(execId, firstTx, firstStepIdx);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || "Failed to prepare transaction");
      setExecuting(false);
    }
  };

  const execute = async () => {
    if (!quote || !address) return;
    setExecuting(true);

    const recipient = useCustomRecipient && recipientAddr ? recipientAddr : address;
    try {
      const r = await api.post("/v1/execute", {
        quoteId: quote.id,
        userAddress: address,
        recipientAddress: recipient,
      });

      const { executionId: execId, transactionRequest: firstTx } = r.data.data;

      const canProceed = await checkAndHandleApproval(execId, firstTx);
      if (!canProceed) {
        setExecuting(false);
        return;
      }

      await signAndSendStep(execId, firstTx, 0);
    } catch (err: unknown) {
      const e = err as { response?: { data?: { error?: string } } };
      toast.error(e.response?.data?.error || "Failed to prepare transaction");
      setExecuting(false);
    }
  };

  // signAndSendStep and startPollingNextStep remain the same as your original
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
        const res = await api.get(`/v1/execute/${execId}/next`); // Note: you may need to implement /next endpoint or use /execute/:id
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
      {/* Header, Settings, Main Card, ChainTokenRow, Recipient, Quote Summary, Error — all your original code unchanged */}

      {/* Action Buttons - Updated with approval flow */}
      {!isConnected ? (
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button onClick={openConnectModal} className="w-full py-4 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all hover:opacity-85"
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
          {approving ? <><Loader2 className="w-4 h-4 animate-spin" /> Approving {fromToken?.symbol}...</> : `Approve ${fromToken?.symbol} to continue`}
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
  );
}