"use client";

import { Cursor } from "@/components/landing/Cursor";
import { RevealObserver } from "@/components/landing/RevealObserver";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { MarqueeTicker } from "@/components/landing/MarqueeTicker";
import { WhatSection } from "@/components/landing/WhatSection";
import { HowSection } from "@/components/landing/HowSection";
import { SDKSection } from "@/components/landing/SDKSection";
import { DataSection } from "@/components/landing/DataSection";
import { ArchitectureSection } from "@/components/landing/ArchitectureSection";
import { RoadmapSection } from "@/components/landing/RoadmapSection";
import { NumbersSection } from "@/components/landing/NumbersSection";
import { FAQSection } from "@/components/landing/FAQSection";
import { FinaleSection } from "@/components/landing/FinaleSection";
import { LandingFooter } from "@/components/landing/LandingFooter";

export default function HomePage() {
  return (
    <>
      <Cursor />
      <RevealObserver />
      <LandingNavbar />
      <HeroSection />
      <MarqueeTicker />
      <WhatSection />
      <hr className="hr-section" />
      <HowSection />
      <hr className="hr-section" />
      <SDKSection />
      <hr className="hr-section" />
      <DataSection />
      <hr className="hr-section" />
      <ArchitectureSection />
      <hr className="hr-section" />
      <RoadmapSection />
      <hr className="hr-section" />
      <NumbersSection />
      <hr className="hr-section" />
      <FAQSection />
      <hr className="hr-section" />
      <FinaleSection />
      <LandingFooter />
    </>
  );
}