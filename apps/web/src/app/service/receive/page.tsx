"use client";

import React, { useState } from "react";
import { useUser } from "@account-kit/react";
import Link from "next/link";

export default function ReceiveMoneyPage() {
  const user = useUser();
  const [amount, setAmount] = useState("");
  const [desc, setDesc] = useState("");
  const [isGenerated, setIsGenerated] = useState(false);
  const [requestLink, setRequestLink] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleGenerate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!amount) return;

    const randomId = Math.random().toString(36).substring(7);
    const link = `https://seafi.protocol/pay/${randomId}?amount=${amount}&to=${user?.address || "0x71C7...7431"}`;
    setRequestLink(link);
    setIsGenerated(true);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(requestLink);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="flex-1 max-w-4xl mx-auto px-6 py-12 w-full space-y-8 relative">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-brand-start/10 rounded-full blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row gap-8 relative z-10">
        {/* Main Request Generator */}
        <div className="flex-1 bg-white border border-divider rounded-[32px] p-8 shadow-xl card-shadow">
          <div className="space-y-2 mb-8">
            <h1 className="text-2xl font-extrabold text-text-primary">Request Stablecoins</h1>
            <p className="text-xs text-text-secondary">
              Create a direct payment request. The payer can pay with their card via Stripe or connect a wallet.
            </p>
          </div>

          {!isGenerated ? (
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label className="text-xs text-text-secondary block font-semibold mb-2">Requested Amount (USDC)</label>
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
                <label className="text-xs text-text-secondary block font-semibold mb-2">Description / Purpose</label>
                <input
                  type="text"
                  value={desc}
                  onChange={(e) => setDesc(e.target.value)}
                  placeholder="E.g. Invoice #2034, Consulting Fee"
                  className="w-full bg-surface-card border border-divider rounded-xl py-3.5 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
                />
              </div>

              <button
                type="submit"
                className="w-full py-4 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-lg shadow-brand-end/10 hover:opacity-95 transition-all cursor-pointer"
              >
                Generate Request Link & QR
              </button>
            </form>
          ) : (
            <div className="space-y-6 animate-fade-in">
              <div className="flex flex-col items-center justify-center p-6 border border-divider rounded-[24px] bg-surface-card/30 text-center space-y-4">
                {/* QR Mockup */}
                <div className="h-40 w-40 bg-white border border-divider rounded-2xl flex items-center justify-center shadow-sm relative overflow-hidden p-3">
                  <svg viewBox="0 0 100 100" className="h-full w-full text-text-primary">
                    <rect width="100" height="100" fill="none" />
                    {/* Fake QR pattern */}
                    <path d="M0 0h30v30H0zm70 0h30v30H70zM0 70h30v30H0z" fill="currentColor" />
                    <path d="M5 5h20v20H5zm70 5h20v20H75zm-70 65h20v20H5z" fill="white" />
                    <path d="M10 10h10v10H10zm70 10h10v10H80zm-70 60h10v10H10z" fill="currentColor" />
                    <path d="M35 10h5v15h-5zm0 25h10v5H35zm15-20h10v5H50zm10 15h5v10h-5zm0 15h15v5H60zm-20 5h5v5h-5zm15 15h10v5H55zm15-15h5v5h-5zm10 10h10v5H80zm-15 10h5v5h-5z" fill="currentColor" />
                  </svg>
                  {/* Small center logo */}
                  <div className="absolute inset-0 m-auto h-8 w-8 bg-gradient-to-tr from-brand-start to-brand-end rounded-lg flex items-center justify-center text-[10px] text-white font-bold border-2 border-white shadow">
                    S
                  </div>
                </div>

                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-text-primary">Scan QR to Pay</h3>
                  <p className="text-xs text-text-secondary">
                    Show this to the payer. They will pay <strong className="text-text-primary">${amount} USDC</strong>.
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-text-secondary block font-semibold">Shareable Payment Link</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    readOnly
                    value={requestLink}
                    className="flex-1 bg-surface-card border border-divider rounded-xl py-3 px-4 text-xs font-mono text-text-secondary focus:outline-none select-all"
                  />
                  <button
                    onClick={handleCopy}
                    className="px-4 py-3 rounded-xl border border-divider hover:bg-surface-card text-text-primary text-xs font-bold transition-all cursor-pointer whitespace-nowrap"
                  >
                    {isCopied ? "Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>

              <div className="flex justify-between items-center p-4 rounded-xl border border-dashed border-divider bg-brand-start/5 text-xs text-brand-end">
                <div className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full bg-brand-end animate-pulse" />
                  <span>Awaiting payment detection...</span>
                </div>
                <button
                  onClick={() => setIsGenerated(false)}
                  className="font-bold hover:underline cursor-pointer"
                >
                  Create New Request
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Info Panel */}
        <div className="w-full md:w-80 space-y-6">
          <div className="bg-surface-card border border-divider rounded-[24px] p-6 shadow-sm space-y-4">
            <h3 className="text-xs font-bold text-text-primary uppercase tracking-wider">Automated Staking Engine</h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              When a payer submits USDC via your request link, the protocol routes the payment directly to your non-custodial smart account. The funds are instantly staked in Aave V3.
            </p>
            <div className="pt-2 border-t border-divider flex items-center justify-between text-[10px] text-text-secondary font-mono">
              <span>Current Yield APY</span>
              <span className="text-emerald-600 font-bold">5.42%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
