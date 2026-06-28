"use client";

import React from "react";
import Link from "next/link";
import { usePrivy } from "@privy-io/react-auth";
import { ArrowRight, Globe, FileCheck, Layers } from "lucide-react";
import { LazyMotion, domAnimation, m } from "framer-motion";

export default function Home() {
  const { ready, authenticated, user } = usePrivy();

  const services = [
    {
      title: "Cross-Border Invoicing",
      desc: "Create professional USDC invoices. Clients pay via Web2 methods, you receive funds instantly.",
      link: "/dashboard/invoicing",
      icon: <Globe className="h-5 w-5 text-ink" strokeWidth={1.5} />,
    },
    {
      title: "B2B Bulk Payouts",
      desc: "Upload a CSV and pay hundreds of global contractors simultaneously in a single, gas-efficient transaction.",
      link: "/dashboard/bulk",
      icon: <Layers className="h-5 w-5 text-ink" strokeWidth={1.5} />,
    },
    {
      title: "Smart Escrow",
      desc: "Trustless milestone payments. Funds are locked securely and released only when work is approved.",
      link: "/dashboard/escrow",
      icon: <FileCheck className="h-5 w-5 text-ink" strokeWidth={1.5} />,
    },
  ];

  return (
    <LazyMotion features={domAnimation}>
      <div className="flex-1 flex flex-col justify-center py-16 md:py-32">
        {/* Hero Section - NO ANIMATION FOR LCP OPTIMIZATION */}
        <section className="max-w-6xl mx-auto px-6 text-center space-y-10 relative w-full">
          <div className="space-y-6 max-w-4xl mx-auto">
            {/* Eyebrow Label */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-sm border border-primary bg-primary/5 text-primary text-[14px] font-semibold tracking-[2.52px] uppercase">
              <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
              Arbitrum Stylus Powered
            </div>

            {/* Hero Headline */}
            <h1 className="text-5xl md:text-[60px] font-normal tracking-[-0.65px] text-ink-strong leading-[1.1]">
              Engineered for Global B2B Payments
            </h1>
            
            {/* Subheadline */}
            <p className="text-body text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Execute cross-border stablecoin payouts, mass contractor distributions, and trustless escrows with up to 98% gas reduction.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href={ready && authenticated && user ? "/dashboard" : "/auth"}
              className="px-6 py-3 rounded-md bg-primary text-on-primary font-semibold text-base flex items-center gap-2 hover:bg-primary-soft transition-colors"
            >
              {ready && authenticated && user ? "Launch Dashboard" : "Start Transacting"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="#features"
              className="px-6 py-3 rounded-md bg-canvas text-ink border border-hairline font-semibold text-base hover:bg-canvas-soft transition-colors"
            >
              Read Documentation
            </a>
          </div>

          {/* Code Mockup - CSS Based Illustration */}
          <div className="mt-16 mx-auto max-w-3xl text-left border border-hairline rounded-md bg-canvas-soft overflow-hidden shadow-sm">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-hairline bg-canvas">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-primary" />
              </div>
              <span className="text-xs text-mute font-mono ml-2">seafi-cli payout --execute</span>
            </div>
            <div className="p-6 font-mono text-[13px] leading-[18px] text-canvas-text-soft">
              <div className="text-mute"># Batch paying 152 contractors via Stylus...</div>
              <div><span className="text-primary">❯</span> Connecting to Arbitrum Sepolia RPC... <span className="text-emerald-500">2ms</span></div>
              <div><span className="text-primary">❯</span> Executing bulk_payout.rs WASM binary...</div>
              <div className="mt-4 border-l-2 border-hairline pl-4">
                <div>Contract: 0x8A9...4F12</div>
                <div>Method: batchPay(address[],uint256[])</div>
                <div>Gas Estimated: 42,100 (EVM equiv: ~1.2M)</div>
              </div>
              <div className="mt-4 text-ink-strong font-medium">✓ Transaction Confirmed. Block 1599201.</div>
            </div>
          </div>
        </section>

        {/* Services Grid Section - Animated Below Fold */}
        <section id="features" className="max-w-6xl mx-auto px-6 py-32 w-full">
          <m.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-4"
          >
            <h2 className="text-3xl md:text-[36px] font-normal tracking-[-0.9px] text-ink-strong">
              Financial Infrastructure
            </h2>
            <p className="text-body text-base">
              Precision-engineered smart contracts designed to eliminate intermediaries and drastically reduce cross-border settlement costs.
            </p>
          </m.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {services.map((svc, i) => (
              <m.div
                key={svc.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
              >
                <Link
                  href={svc.link}
                  className="block bg-canvas border border-hairline rounded-md p-8 hover:border-primary/50 hover:bg-canvas-soft transition-colors h-full group"
                >
                  <div className="space-y-5">
                    <div className="h-10 w-10 rounded-sm bg-canvas-soft border border-hairline flex items-center justify-center group-hover:bg-primary/10 group-hover:border-primary/20 transition-colors">
                      {svc.icon}
                    </div>
                    <div className="space-y-3">
                      <h3 className="font-bold text-ink-strong text-[20px] tracking-tight">
                        {svc.title}
                      </h3>
                      <p className="text-sm text-body leading-relaxed">
                        {svc.desc}
                      </p>
                    </div>
                  </div>
                  <div className="mt-8 flex items-center gap-2 text-sm font-semibold text-ink group-hover:text-primary transition-colors">
                    Explore API
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </Link>
              </m.div>
            ))}
          </div>
        </section>
      </div>
    </LazyMotion>
  );
}
