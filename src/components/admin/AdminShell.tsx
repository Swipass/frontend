"use client";

import { useState } from "react";
import Link from "next/link";
import { useAdmin } from "@/app/providers";
import { api } from "@/lib/api";
import {
  LayoutDashboard, ArrowLeftRight, Percent,
  Shield, LogOut, Zap, Eye, EyeOff,
} from "lucide-react";
import toast from "react-hot-toast";

const NAV = [
  { id: "overview",      label: "Overview",       href: "/admin",              icon: LayoutDashboard },
  { id: "transactions",  label: "Transactions",   href: "/admin/transactions", icon: ArrowLeftRight },
  { id: "fees",          label: "Fee Config",      href: "/admin/fees",         icon: Percent },
  { id: "bridges",       label: "Bridges",         href: "/admin/bridges",      icon: Shield },
];

function AdminLogin() {
  const { login } = useAdmin();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setLoading(true);
    try {
      const r = await api.post("/admin/auth/login", { email, password });
      login(r.data.data.token);
      toast.success("Welcome back");
    } catch {
      toast.error("Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--g900)" }}>
      <div className="w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: "var(--g50)" }}>
            <Zap className="w-4 h-4" style={{ color: "var(--g900)" }} />
          </div>
          <span className="font-display font-black text-lg" style={{ color: "var(--g50)", letterSpacing: "-0.035em" }}>
            Swipass <span className="font-mono text-xs font-normal opacity-40">admin</span>
          </span>
        </div>

        <div className="rounded-2xl overflow-hidden" style={{ background: "var(--g800)", border: "1px solid var(--g700)", boxShadow: "0 4px 32px rgba(0,0,0,0.5)" }}>
          <div className="px-6 py-5" style={{ borderBottom: "1px solid var(--g700)" }}>
            <h1 className="font-display font-black text-xl" style={{ color: "var(--g50)", letterSpacing: "-0.03em" }}>Admin sign in</h1>
            <p className="font-mono text-[0.65rem] mt-1" style={{ color: "var(--g500)" }}>Access the control panel</p>
          </div>
          <form onSubmit={submit} className="p-6 space-y-4">
            <div>
              <label className="font-mono text-[0.6rem] tracking-widest uppercase block mb-1.5" style={{ color: "var(--g500)" }}>Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="admin@swipass.com" required
                className="w-full px-4 py-3 rounded-xl font-sans text-sm iz-input"
                style={{ background: "var(--g900)", border: "1px solid var(--g700)", color: "var(--g50)", outline: "none" }} />
            </div>
            <div>
              <label className="font-mono text-[0.6rem] tracking-widest uppercase block mb-1.5" style={{ color: "var(--g500)" }}>Password</label>
              <div className="relative">
                <input type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" required
                  className="w-full px-4 py-3 pr-11 rounded-xl font-sans text-sm iz-input"
                  style={{ background: "var(--g900)", border: "1px solid var(--g700)", color: "var(--g50)", outline: "none" }} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2" style={{ color: "var(--g500)", background: "none", border: "none", cursor: "pointer" }}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-xl font-display font-black text-sm tracking-widest uppercase transition-all mt-2"
              style={{ background: loading ? "var(--g700)" : "var(--g50)", color: loading ? "var(--g500)" : "var(--g900)", cursor: loading ? "not-allowed" : "pointer" }}>
              {loading ? "Signing in…" : "Sign in →"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminShell({ children, active }: { children: React.ReactNode; active: string }) {
  const { token, logout } = useAdmin();

  if (!token) return <AdminLogin />;

  return (
    <div className="min-h-screen" style={{ background: "var(--g900)" }}>
      <aside className="fixed inset-y-0 left-0 w-52 flex flex-col z-40" style={{ background: "var(--g800)", borderRight: "1px solid var(--g700)" }}>
        
        {/* Logo - fixed height, left-aligned content */}
        <div className="flex items-center gap-2.5 px-5 h-16 shrink-0" style={{ borderBottom: "1px solid var(--g700)" }}>
          <div className="w-6 h-6 rounded-md flex items-center justify-center" style={{ background: "var(--g50)" }}>
            <Zap className="w-3.5 h-3.5" style={{ color: "var(--g900)" }} />
          </div>
          <span className="font-display font-black text-sm" style={{ color: "var(--g50)", letterSpacing: "-0.03em" }}>Swipass</span>
          <span className="font-mono text-[0.58rem] ml-auto" style={{ color: "var(--g600)" }}>admin</span>
        </div>

        {/* Navigation - vertical, left-aligned links */}
        <nav className="flex-1 py-4 overflow-y-auto flex flex-col">
          {NAV.map(({ id, label, href, icon: Icon }) => {
            const isActive = active === id;
            return (
              <Link key={id} href={href}
                className="flex items-center gap-3 py-2.5 transition-all text-sm w-full"
                style={{
                  background: isActive ? "var(--g900)" : "transparent",
                  color: isActive ? "var(--g50)" : "var(--g500)",
                  textDecoration: "none",
                  borderLeft: isActive ? `3px solid var(--g50)` : "3px solid transparent",
                  paddingLeft: isActive ? "17px" : "20px",
                  paddingRight: "20px",
                  fontWeight: isActive ? 600 : 400,
                  justifyContent: "flex-start",
                }}>
                <Icon className="w-4 h-4 shrink-0" />
                <span className="font-sans text-left">{label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer links - left-aligned */}
        <div className="px-5 py-4 shrink-0" style={{ borderTop: "1px solid var(--g700)" }}>
          <Link href="/bridge" className="flex items-center gap-2 text-xs font-mono mb-3 transition-colors w-full"
            style={{ color: "var(--g500)", textDecoration: "none", justifyContent: "flex-start" }}>
            ← Back to bridge
          </Link>
          <button onClick={() => { logout(); }} className="flex items-center gap-2 text-xs font-mono w-full transition-colors"
            style={{ color: "var(--g500)", background: "none", border: "none", cursor: "pointer", padding: 0, justifyContent: "flex-start" }}>
            <LogOut className="w-3.5 h-3.5" /> Sign out
          </button>
        </div>
      </aside>

      <main className="ml-52 p-8 min-h-screen overflow-y-auto">
        {children}
      </main>
    </div>
  );
}