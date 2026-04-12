"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Menu, X } from "lucide-react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const onBridge = pathname.startsWith("/bridge");
  const onAdmin = pathname.startsWith("/admin");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-10 h-16 transition-all duration-300 ${
          scrolled ? "bg-[rgba(23,23,23,0.85)] backdrop-blur-md border-b border-[var(--g700)]" : "bg-transparent"
        }`}
        style={{ transition: "background 0.3s, backdrop-filter 0.3s" }}
      >
        {/* Logo only */}
        <Link href="/" className="flex items-center shrink-0">
          <img
            src="/wordmark.png"
            alt="Swipass"
            height="28"
            style={{
              height: '28px',
              width: 'auto',
              filter: 'invert(1)',
              transition: 'filter 0.3s',
            }}
          />
        </Link>

        {/* Right side: only Connect Wallet */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Wallet connect */}
          <div className="hidden md:block">
            <ConnectButton chainStatus="icon" showBalance={false} />
          </div>

          {/* Mobile hamburger (only shows on bridge/admin if needed, but keep minimal) */}
          {(onBridge || onAdmin) && (
            <button
              className="flex md:hidden w-9 h-9 items-center justify-center rounded-lg"
              style={{
                background: "none",
                border: "1px solid var(--g700)",
                color: "var(--g500)",
              }}
              onClick={() => setOpen(!open)}
            >
              {open ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          )}
        </div>
      </nav>

      {/* Mobile menu (only for bridge/admin if needed) */}
      {open && (onBridge || onAdmin) && (
        <div
          className="fixed top-16 left-0 right-0 z-40 flex flex-col gap-1 p-4 md:hidden"
          style={{
            background: "var(--g900)",
            borderBottom: "1px solid var(--g700)",
          }}
        >
          <div className="pt-3 flex flex-col gap-2.5">
            <ConnectButton />
          </div>
        </div>
      )}
    </>
  );
}