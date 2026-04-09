"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "@/app/providers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Moon, Sun, Menu, X } from "lucide-react";

const NAV_LINKS = [
  { href: "/#why",        label: "Why Izipass" },
  { href: "/#how",        label: "How it works" },
  { href: "/#chains",     label: "Chains"       },
  { href: "/#principles", label: "Our approach" },
  { href: "/#faq",        label: "FAQ"          },
];

export function Navbar() {
  const { isDark, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const onBridge = pathname.startsWith("/bridge");
  const onAdmin  = pathname.startsWith("/admin");

  return (
    <>
      <nav
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16"
        style={{ 
          background: "var(--bg)", 
          borderBottom: "1px solid var(--border)", 
          transition: "background 0.3s" 
        }}
      >
        {/* Logo - Matching your old clean style */}
        <Link href="/" className="flex items-center gap-2.5 no-underline shrink-0">
          <img
            src="/wordmark.png"
            alt="izipass"
            height="32"
            style={{
              height: '32px',
              width: 'auto',
              filter: isDark ? 'invert(1)' : 'none',
              transition: 'filter 0.3s',
            }}
          />
          <span 
            className="hidden sm:block font-mono text-[0.65rem] tracking-widest px-2 py-0.5 rounded-sm"
            style={{
              color: "var(--ink-4)",
              border: "1px solid var(--border)",
            }}
          >
            v0.1
          </span>
        </Link>

        {/* Desktop links — show only on landing page */}
        {!onBridge && !onAdmin && (
          <div className="hidden lg:flex items-center gap-6">
            {NAV_LINKS.map(({ href, label }) => (
              <Link 
                key={href} 
                href={href}
                className="font-sans text-sm transition-colors"
                style={{ color: "var(--ink-3)", textDecoration: "none" }}
                onMouseEnter={e => ((e.target as HTMLElement).style.color = "var(--ink-0)")}
                onMouseLeave={e => ((e.target as HTMLElement).style.color = "var(--ink-3)")}
              >
                {label}
              </Link>
            ))}
          </div>
        )}

        {/* Actions */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Theme toggle */}
          <button 
            onClick={toggle} 
            aria-label="Toggle theme"
            className="w-9 h-9 flex items-center justify-center rounded-lg transition-all cursor-pointer"
            style={{ 
              background: "none", 
              border: "1px solid var(--border)", 
              color: "var(--ink-3)" 
            }}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Wallet connect (desktop) */}
          <div className="hidden md:block">
            <ConnectButton chainStatus="icon" showBalance={false} />
          </div>

          {/* Launch bridge CTA */}
          <Link 
            href="/bridge"
            className="hidden md:flex items-center gap-1.5 font-display font-bold text-xs tracking-widest uppercase px-4 py-2.5 rounded-lg transition-all hover:opacity-80"
            style={{ 
              background: "var(--ink-0)", 
              color: "var(--bg)", 
              textDecoration: "none" 
            }}
          >
            Launch App
          </Link>

          {/* Mobile hamburger */}
          <button
            className="flex md:hidden w-9 h-9 items-center justify-center rounded-lg"
            style={{ 
              background: "none", 
              border: "1px solid var(--border)", 
              color: "var(--ink-3)" 
            }}
            onClick={() => setOpen(!open)}
          >
            {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {open && (
        <div 
          className="fixed top-16 left-0 right-0 z-40 flex flex-col gap-1 p-4 md:hidden"
          style={{ 
            background: "var(--bg)", 
            borderBottom: "1px solid var(--border)" 
          }}
        >
          {NAV_LINKS.map(({ href, label }) => (
            <Link 
              key={href} 
              href={href}
              className="px-3 py-2.5 rounded-lg text-sm font-sans"
              style={{ color: "var(--ink-2)", textDecoration: "none" }}
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          
          <div className="mt-2 pt-3 flex flex-col gap-2.5" style={{ borderTop: "1px solid var(--border)" }}>
            <ConnectButton />
            <Link 
              href="/bridge"
              className="text-center font-display font-bold text-xs tracking-widest uppercase px-4 py-3 rounded-xl"
              style={{ 
                background: "var(--ink-0)", 
                color: "var(--bg)", 
                textDecoration: "none" 
              }}
              onClick={() => setOpen(false)}
            >
              Launch App
            </Link>
          </div>
        </div>
      )}
    </>
  );
}