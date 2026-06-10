"use client";

import React, { useState } from "react";
import { useUser } from "@account-kit/react";
import Link from "next/link";

export default function SendMoneyPage() {
  const user = useUser();
  const [recipient, setRecipient] = useState("");
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [txHash, setTxHash] = useState<string | null>(null);
  const [step, setStep] = useState<"input" | "success">("input");

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!recipient || !amount) return;

    setIsSending(true);
    // Simulate smart wallet transaction submission
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsSending(false);
    setTxHash(`0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`);
    setStep("success");
  };

  const handleReset = () => {
    setRecipient("");
    setAmount("");
    setNotes("");
    setTxHash(null);
    setStep("input");
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-start/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Main Send Form */}
        <div className="flex-1 bg-white border border-divider rounded-[32px] p-8 shadow-xl card-shadow">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-extrabold text-text-primary">Send Stablecoins Instantly</h1>
            <p className="text-xs text-text-secondary">
              Transfer funds cross-border via Arbitrum network. Zero gas fees for sponsored smart wallets.
            </p>
          </div>

          {step === "input" ? (
            <form onSubmit={handleSend} className="space-y-6">
              <div>
                <label className="text-xs text-text-secondary block font-semibold mb-2">Recipient Wallet Address or ENS</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={recipient}
                    onChange={(e) => setRecipient(e.target.value)}
                    placeholder="0x71C7... or recipient.eth"
                    className="w-full bg-surface-card border border-divider rounded-xl py-3.5 pl-11 pr-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
                  />
                  <div className="absolute left-4 top-4 text-text-secondary">
                    <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary block font-semibold mb-2">Amount to Send (USDC)</label>
                <div className="relative">
                  <input
                    type="number"
                    required
                    min="1"
                    step="0.01"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full bg-surface-card border border-divider rounded-xl py-3.5 pl-11 pr-16 text-text-primary text-lg font-bold focus:outline-none focus:border-brand-end"
                  />
                  <div className="absolute left-4 top-4.5 font-bold text-text-secondary">$</div>
                  <span className="absolute right-4 top-4 text-xs font-bold text-brand-end bg-brand-start/15 px-2.5 py-1 rounded-md">
                    USDC
                  </span>
                </div>
              </div>

              <div>
                <label className="text-xs text-text-secondary block font-semibold mb-2">Notes / Reference (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="E.g. Freelance Web Design payment"
                  rows={3}
                  className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={isSending}
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-lg shadow-brand-end/10 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                {isSending ? (
                  <>
                    <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Executing smart contract transfer...
                  </>
                ) : (
                  "Confirm & Send"
                )}
              </button>
            </form>
          ) : (
            <div className="py-8 flex flex-col items-center justify-center text-center space-y-6 animate-fade-in">
              <div className="h-16 w-16 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold text-text-primary">Transaction Completed</h3>
                <p className="text-xs text-text-secondary max-w-sm mx-auto">
                  Your payment of <strong className="text-text-primary">${amount} USDC</strong> has been securely routed and sent.
                </p>
              </div>

              <div className="w-full p-4 bg-surface-card rounded-[20px] border border-divider text-xs font-mono text-left space-y-2">
                <div className="flex justify-between">
                  <span className="text-text-secondary">To:</span>
                  <span className="text-text-primary font-semibold truncate max-w-[200px]">{recipient}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Amount:</span>
                  <span className="text-emerald-600 font-bold">{amount} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-text-secondary">Tx Hash:</span>
                  <span className="text-brand-end font-semibold text-[10px] truncate max-w-[200px]">{txHash}</span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-3 bg-surface-card hover:bg-divider text-text-primary font-bold text-xs rounded-xl transition-all cursor-pointer"
              >
                Send Another Transfer
              </button>
            </div>
          )}
        </div>

        {/* Sidebar Info Panel */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-surface-card border border-divider rounded-[24px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Aave Auto-Yield Reminder</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              Did you know? Unlike traditional bank transfers, any USDC remaining in your smart account is automatically deposited into Aave High-Yield pools.
            </p>
            <div className="p-4 bg-white border border-divider rounded-xl text-center space-y-1">
              <span className="block text-2xl font-extrabold text-brand-end">5.42%</span>
              <span className="text-[9px] text-text-secondary uppercase font-bold tracking-wider">Aave V3 APY</span>
            </div>
            <Link
              href="/service/payroll"
              className="block text-center py-2.5 rounded-xl bg-white border border-divider hover:bg-surface-card text-text-primary font-semibold text-xs transition-all"
            >
              Check My Staking Yield
            </Link>
          </div>

          <div className="bg-white border border-divider rounded-[24px] p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Supported Networks</h3>
            <div className="flex items-center gap-2 text-xs text-text-secondary">
              <div className="h-2.5 w-2.5 rounded-full bg-brand-end" />
              Arbitrum Sepolia (Testnet)
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary opacity-60">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              Optimism Mainnet (Soon)
            </div>
            <div className="flex items-center gap-2 text-xs text-text-secondary opacity-60">
              <div className="h-2.5 w-2.5 rounded-full bg-slate-300" />
              Arbitrum One (Soon)
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
