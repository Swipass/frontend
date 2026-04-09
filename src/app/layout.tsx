import type { Metadata } from "next";
import { DM_Sans, DM_Mono, Syne } from "next/font/google";
import "@/styles/globals.css";
import { Providers } from "./providers";

const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dm-sans", display: "swap" });
const dmMono = DM_Mono({ subsets: ["latin"], weight: ["300","400","500"], variable: "--font-dm-mono", display: "swap" });
const syne = Syne({ subsets: ["latin"], variable: "--font-syne", display: "swap" });

export const metadata: Metadata = {
  title: { default: "Swipass — Move value, any chain, one click", template: "%s | Swipass" },
  description: "Bridge any token to any wallet across any blockchain. Fast, non-custodial, with zero gas headaches.",
  keywords: ["bridge","cross-chain","DeFi","crypto","USDC","ETH","non-custodial"],
  openGraph: {
    title: "Swipass — Universal Bridge",
    description: "Move value, any chain, one click.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${dmSans.variable} ${dmMono.variable} ${syne.variable}`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
