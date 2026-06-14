"use client";

import React, { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";

interface Invoice {
  id: string;
  payerName: string;
  payerWallet: string;
  amount: number;
  description: string;
  status: "pending" | "paid";
  date: string;
}

export default function MakeInvoicePage() {
  const { ready, authenticated, user } = usePrivy();
  const [payerName, setPayerName] = useState("");
  const [payerWallet, setPayerWallet] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Invoices List
  const [invoices, setInvoices] = useState<Invoice[]>([
    {
      id: "INV-2026-001",
      payerName: "Acme Corp",
      payerWallet: "0x71C7...7431",
      amount: 450.00,
      description: "Smart Contract Auditing Service",
      status: "paid",
      date: "2026-06-08",
    },
    {
      id: "INV-2026-002",
      payerName: "Stellar Devs",
      payerWallet: "0x89A4...2849",
      amount: 800.00,
      description: "Frontend Redesign Consultation",
      status: "pending",
      date: "2026-06-10",
    },
  ]);

  // Live Aave Staked Balance Mockup
  const [stakedBalance, setStakedBalance] = useState(1250.0);
  const [aaveApy] = useState(5.42);
  const [yieldEarned, setYieldEarned] = useState(12.45);

  useEffect(() => {
    const interval = setInterval(() => {
      // Yield formula per second
      const secondsInYear = 31536000;
      const yieldPerSec = (stakedBalance * (aaveApy / 100)) / secondsInYear;
      setYieldEarned((prev) => prev + yieldPerSec);
    }, 1000);
    return () => clearInterval(interval);
  }, [stakedBalance, aaveApy]);

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!payerName || !payerWallet || !amount || !description) return;

    setIsSubmitting(true);
    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    const newInvoice: Invoice = {
      id: `INV-2026-00${invoices.length + 1}`,
      payerName,
      payerWallet: payerWallet.slice(0, 6) + "..." + payerWallet.slice(-4),
      amount: parseFloat(amount),
      description,
      status: "pending",
      date: new Date().toISOString().split("T")[0],
    };

    setInvoices([newInvoice, ...invoices]);
    setPayerName("");
    setPayerWallet("");
    setAmount("");
    setDescription("");
    setIsSubmitting(false);
  };

  const handlePayInvoice = (id: string, amountVal: number) => {
    // Settle invoice and stake the funds immediately
    setInvoices((prev) =>
      prev.map((inv) => (inv.id === id ? { ...inv, status: "paid" } : inv))
    );
    setStakedBalance((prev) => prev + amountVal);
  };

  return (
    <div className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full space-y-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-start/10 rounded-full blur-3xl pointer-events-none" />

      <div className="space-y-2 relative z-10">
        <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
          Smart Invoicing
        </h1>
        <p className="text-xs text-text-secondary">
          Request business payouts. Paid invoices instantly route to your yield-optimized wallet.
        </p>
      </div>

      {/* Aave Autostaking Alert */}
      <div className="bg-gradient-to-r from-brand-start/10 to-brand-end/10 border border-brand-end/20 rounded-[24px] p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 relative z-10 card-shadow">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-brand-end font-bold text-sm">
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span>Automated Aave V3 Staking Enabled</span>
          </div>
          <p className="text-xs text-text-secondary max-w-2xl leading-relaxed">
            Funds received from settled invoices do not stay idle. They are instantly staked in Aave pool reserves to generate passive yield, compounding block-by-block.
          </p>
        </div>
        <div className="flex gap-4 items-center">
          <div className="text-right">
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider block">Yield APY</span>
            <span className="text-base font-extrabold text-emerald-600">{aaveApy}%</span>
          </div>
          <div className="text-right border-l border-divider pl-4">
            <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider block">Live Yield</span>
            <span className="text-base font-extrabold text-brand-end font-mono">+${yieldEarned.toFixed(6)}</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 relative z-10">
        {/* Left column: Create Invoice Form */}
        <div className="lg:col-span-5 bg-white border border-divider rounded-[32px] p-8 shadow-xl card-shadow">
          <h3 className="font-bold text-text-primary text-lg mb-6">Generate Business Invoice</h3>
          <form onSubmit={handleCreateInvoice} className="space-y-5">
            <div>
              <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Payer Name / Business</label>
              <input
                type="text"
                required
                value={payerName}
                onChange={(e) => setPayerName(e.target.value)}
                placeholder="E.g. Acme Corporation"
                className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Payer Wallet Address</label>
              <input
                type="text"
                required
                value={payerWallet}
                onChange={(e) => setPayerWallet(e.target.value)}
                placeholder="0x..."
                className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm font-mono focus:outline-none focus:border-brand-end"
              />
            </div>

            <div>
              <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Amount Requested (USDC)</label>
              <div className="relative">
                <input
                  type="number"
                  required
                  min="1"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0.00"
                  className="w-full bg-surface-card border border-divider rounded-xl py-3 pl-10 pr-4 text-text-primary text-sm font-semibold focus:outline-none focus:border-brand-end"
                />
                <span className="absolute left-4 top-3 text-text-secondary font-bold">$</span>
              </div>
            </div>

            <div>
              <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Item Description / Memo</label>
              <textarea
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Detail the services or goods delivered..."
                rows={3}
                className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-lg shadow-brand-end/10 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Publishing Invoice...
                </>
              ) : (
                "Create & Send Invoice"
              )}
            </button>
          </form>
        </div>

        {/* Right column: Invoices Tracker & Simulator */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white border border-divider rounded-[32px] p-8 shadow-sm card-shadow">
            <h3 className="font-bold text-text-primary text-lg mb-6">Invoices Ledger</h3>

            <div className="space-y-4">
              {invoices.map((inv) => (
                <div
                  key={inv.id}
                  className="p-5 border border-divider rounded-[20px] bg-surface-card/10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:border-brand-start transition-all"
                >
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-brand-end">{inv.id}</span>
                      <span className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${
                        inv.status === "paid"
                          ? "bg-emerald-50 text-emerald-600 border border-emerald-100"
                          : "bg-amber-50 text-amber-600 border border-amber-100"
                      }`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="text-sm font-bold text-text-primary">{inv.payerName}</div>
                    <p className="text-xs text-text-secondary">{inv.description}</p>
                    <span className="text-[10px] text-text-secondary font-mono block">Wallet: {inv.payerWallet}</span>
                  </div>

                  <div className="flex md:flex-col items-end gap-3 justify-between w-full md:w-auto pt-3 md:pt-0 border-t md:border-t-0 border-divider">
                    <div className="text-right">
                      <span className="text-[10px] text-text-secondary uppercase font-bold tracking-wider block">Total Due</span>
                      <span className="text-lg font-bold text-text-primary font-mono">${inv.amount.toFixed(2)} USDC</span>
                    </div>

                    {inv.status === "pending" && (
                      <button
                        onClick={() => handlePayInvoice(inv.id, inv.amount)}
                        className="px-4 py-2 bg-gradient-to-r from-brand-start to-brand-end hover:opacity-95 text-white font-bold text-xs rounded-xl shadow-md cursor-pointer transition-all"
                      >
                        Simulate Payment
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
