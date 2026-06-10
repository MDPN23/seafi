"use client";

import React from "react";
import Link from "next/link";
import { useUser } from "@account-kit/react";

export default function Home() {
  const user = useUser();

  const services = [
    {
      title: "Send Money",
      desc: "Instant cross-border stablecoin transfers with sponsored gas and auto-yielding capability.",
      link: "/service/sendmoney",
      icon: (
        <svg className="h-6 w-6 text-brand-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
        </svg>
      ),
    },
    {
      title: "Request Money",
      desc: "Receive stablecoins instantly by sharing a secure payment link or QR code.",
      link: "/service/receive",
      icon: (
        <svg className="h-6 w-6 text-brand-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      ),
    },
    {
      title: "Payroll Streaming",
      desc: "Stream salaries to employees per second. Capital efficiency unlocked via automated Aave staking.",
      link: "/service/payroll",
      icon: (
        <svg className="h-6 w-6 text-brand-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      title: "Smart Invoices",
      desc: "Create professional business invoices. Paid directly to your smart wallet and instantly optimized for yield.",
      link: "/service/make-invoice",
      icon: (
        <svg className="h-6 w-6 text-brand-end" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-center py-12 md:py-24">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 text-center space-y-8 relative">
        {/* Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-start/15 rounded-full blur-3xl pointer-events-none" />

        <div className="space-y-4 max-w-3xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-end/30 bg-brand-start/10 text-brand-end text-xs font-semibold">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-end animate-pulse" />
            Next-Gen Web3 Banking Rails
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-text-primary leading-tight">
            Seamless Cross-Border Payments,{" "}
            <span className="bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
              Auto-Staked for Yield
            </span>
          </h1>
          <p className="text-text-secondary text-base md:text-lg max-w-xl mx-auto leading-relaxed">
            Send, request, and stream money instantly across Southeast Asia. Any funds resting in your smart wallet are programmatically staked in Aave V3 to earn real-time yield.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 relative z-10">
          <Link
            href={user ? "/service/payroll" : "/auth"}
            className="px-8 py-3.5 rounded-full bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-xl shadow-brand-end/20 hover:shadow-brand-end/35 hover:opacity-95 transition-all cursor-pointer"
          >
            {user ? "Go to Dashboard" : "Get Started Now"}
          </Link>
          <a
            href="#features"
            className="px-8 py-3.5 rounded-full bg-white border border-divider hover:bg-surface-card text-text-primary font-bold text-sm transition-all cursor-pointer shadow-sm"
          >
            Explore Services
          </a>
        </div>
      </section>

      {/* Services Grid Section */}
      <section id="features" className="max-w-7xl mx-auto px-6 py-20 relative z-10">
        <div className="text-center max-w-lg mx-auto mb-16 space-y-2">
          <h2 className="text-3xl font-extrabold tracking-tight text-text-primary">
            Our Financial Services
          </h2>
          <p className="text-text-secondary text-sm">
            Everything you need for personal, business, or payroll needs, optimized for Web3.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((svc) => (
            <Link
              key={svc.link}
              href={svc.link}
              className="bg-white border border-divider hover:border-brand-start rounded-[32px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-64 group cursor-pointer card-shadow"
            >
              <div className="space-y-4">
                <div className="h-12 w-12 rounded-2xl bg-brand-start/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                  {svc.icon}
                </div>
                <div className="space-y-2">
                  <h3 className="font-bold text-text-primary text-lg group-hover:text-brand-end transition-colors">
                    {svc.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {svc.desc}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs font-bold text-brand-end group-hover:translate-x-1 transition-transform pt-4">
                Launch Service
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Yield & Aave Spotlight */}
      <section className="max-w-7xl mx-auto px-6 pb-20 relative z-10">
        <div className="bg-surface-card border border-divider rounded-[32px] p-8 md:p-12 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center card-shadow">
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-emerald-500/20 bg-emerald-50 text-emerald-600 text-xs font-bold">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600 animate-pulse" />
              Live Aave Yield Staking
            </div>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-text-primary">
              No Idle Cash. Your Capital Works for You.
            </h2>
            <p className="text-text-secondary text-sm leading-relaxed">
              When an invoice is paid or your salary is streamed, the funds wait in your ERC-4337 smart wallet. Normally, this cash sits idle. SEAFI automatically route all idle balances directly to Aave V3 pools, making sure every dollar gets high-yield staking interests generated block-by-block.
            </p>
            <div className="flex flex-wrap gap-6 pt-4 border-t border-divider">
              <div>
                <span className="block text-2xl font-bold text-brand-end">5.42%</span>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Mock APY</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-emerald-600">Real-Time</span>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Yield Accrual</span>
              </div>
              <div>
                <span className="block text-2xl font-bold text-text-primary">100%</span>
                <span className="text-[10px] text-text-secondary font-semibold uppercase tracking-wider">Non-Custodial</span>
              </div>
            </div>
          </div>
          <div className="lg:col-span-5 bg-white border border-divider rounded-[24px] p-6 space-y-4 shadow-sm">
            <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block">
              Active Yield Vault
            </span>
            <div className="space-y-3">
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Staked Asset</span>
                <span className="font-bold text-text-primary">aUSDC (Aave Arbitrum)</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Total Deposits</span>
                <span className="font-bold text-text-primary">$1,250.00 USDC</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-text-secondary">Yield Earned</span>
                <span className="font-extrabold text-emerald-600 font-mono">+$12.45 USDC</span>
              </div>
            </div>
            <div className="h-1.5 w-full bg-surface-card rounded-full overflow-hidden">
              <div className="h-full w-4/5 bg-gradient-to-r from-brand-start to-brand-end rounded-full" />
            </div>
            <Link
              href="/service/payroll"
              className="block text-center py-2.5 rounded-xl bg-surface-card hover:bg-divider text-text-primary font-bold text-xs transition-all"
            >
              View Yield Dashboard
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
