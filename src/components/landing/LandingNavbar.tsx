"use client";

import { useEffect } from "react";
import Link from "next/link";

export function LandingNavbar() {
  useEffect(() => {
    const header = document.querySelector("header");
    const handleScroll = () => {
      if (window.scrollY > 40) header?.classList.add("scrolled");
      else header?.classList.remove("scrolled");
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const toggle = document.getElementById("menu-toggle");
    const mobileMenu = document.getElementById("mobile-menu");
    const body = document.body;

    const openMenu = () => {
      toggle?.classList.toggle("open");
      mobileMenu?.classList.toggle("open");
      body.style.overflow = mobileMenu?.classList.contains("open") ? "hidden" : "";
    };
    toggle?.addEventListener("click", openMenu);
    return () => toggle?.removeEventListener("click", openMenu);
  }, []);

  return (
    <>
      <header id="header">
        <div className="logo-wrap">
          <img src="/wordmark.png" alt="Swipass" className="logo-img" id="logo-img" />
          <span className="logo-alt">
            swi<b>pass</b>
          </span>
        </div>
        <nav>
          <div className="desktop-links">
            <a href="#how">how it works</a>
            <a href="#sdk">developers</a>
            <a href="#data">market data</a>
            <a href="#roadmap">roadmap</a>
            <Link href="/bridge" className="nav-btn">
              launch app →
            </Link>
          </div>
          <button className="nav-mobile-toggle" id="menu-toggle" aria-label="Menu">
            <span></span>
            <span></span>
            <span></span>
          </button>
        </nav>
      </header>
      <div className="mobile-menu" id="mobile-menu">
        <a href="#how" onClick={() => document.getElementById("menu-toggle")?.click()}>
          how it works
        </a>
        <a href="#sdk" onClick={() => document.getElementById("menu-toggle")?.click()}>
          developers
        </a>
        <a href="#data" onClick={() => document.getElementById("menu-toggle")?.click()}>
          market data
        </a>
        <a href="#roadmap" onClick={() => document.getElementById("menu-toggle")?.click()}>
          roadmap
        </a>
        <Link href="/bridge" onClick={() => document.getElementById("menu-toggle")?.click()}>
          launch app →
        </Link>
      </div>
    </>
  );
}