"use client";

import { useState, useEffect, createContext, useContext, ReactNode } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiProvider } from "wagmi";
import { RainbowKitProvider, darkTheme, lightTheme } from "@rainbow-me/rainbowkit";
import { Toaster } from "react-hot-toast";
import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { mainnet, arbitrum, optimism, base, polygon, avalanche, bsc } from "wagmi/chains";
import "@rainbow-me/rainbowkit/styles.css";

// ── Wagmi config with correct app name and metadata for mobile ──
const wagmiConfig = getDefaultConfig({
  appName: "Swipass",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || "",
  chains: [mainnet, arbitrum, optimism, base, polygon, avalanche, bsc],
  ssr: true,
});

// ── Theme context ─────────────────────────────────────────────
interface ThemeCtx { isDark: boolean; toggle: () => void }
const ThemeContext = createContext<ThemeCtx>({ isDark: false, toggle: () => {} });
export const useTheme = () => useContext(ThemeContext);

function ThemeProvider({ children }: { children: ReactNode }) {
  const [isDark, setIsDark] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const stored = localStorage.getItem("swipass-theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const dark = stored ? stored === "dark" : sysDark;
    setIsDark(dark);
    document.documentElement.classList.toggle("dark", dark);
  }, []);

  const toggle = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("swipass-theme", next ? "dark" : "light");
  };

  if (!mounted) return <>{children}</>;
  return <ThemeContext.Provider value={{ isDark, toggle }}>{children}</ThemeContext.Provider>;
}

// ── Admin auth context ────────────────────────────────────────
interface AdminCtx { token: string | null; login: (t: string) => void; logout: () => void }
const AdminContext = createContext<AdminCtx>({ token: null, login: () => {}, logout: () => {} });
export const useAdmin = () => useContext(AdminContext);

function AdminProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const stored = sessionStorage.getItem("swipass-admin-token");
    if (stored) setToken(stored);
  }, []);

  const login = (t: string) => { setToken(t); sessionStorage.setItem("swipass-admin-token", t); };
  const logout = () => { setToken(null); sessionStorage.removeItem("swipass-admin-token"); };

  return <AdminContext.Provider value={{ token, login, logout }}>{children}</AdminContext.Provider>;
}

// ── React Query client ────────────────────────────────────────
const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false } },
});

// ── Root providers ────────────────────────────────────────────
export function Providers({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <AdminProvider>
        <WagmiProvider config={wagmiConfig}>
          <QueryClientProvider client={queryClient}>
            <RainbowKitProviderWrapper>
              {children}
              <Toaster
                position="bottom-right"
                toastOptions={{
                  style: {
                    background: "var(--g800)",
                    color: "var(--g50)",
                    border: "1px solid var(--g700)",
                    fontFamily: "var(--font-mono)",
                    fontSize: "0.875rem",
                    borderRadius: "8px",
                  },
                  success: { iconTheme: { primary: "#22c55e", secondary: "var(--g900)" } },
                  error: { iconTheme: { primary: "#e74c3c", secondary: "var(--g900)" } },
                }}
              />
            </RainbowKitProviderWrapper>
          </QueryClientProvider>
        </WagmiProvider>
      </AdminProvider>
    </ThemeProvider>
  );
}

function RainbowKitProviderWrapper({ children }: { children: ReactNode }) {
  const { isDark } = useTheme();
  return (
    <RainbowKitProvider
      theme={isDark
        ? darkTheme({ accentColor: "#f9f8f6", accentColorForeground: "#0d0d0b", borderRadius: "medium" })
        : lightTheme({ accentColor: "#0d0d0b", accentColorForeground: "#f9f8f6", borderRadius: "medium" })
      }
      modalSize="compact"
    >
      {children}
    </RainbowKitProvider>
  );
}