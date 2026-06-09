"use client";

import React, { useState, useEffect } from "react";
import { useUser, useAuthModal, useLogout } from "@account-kit/react";

export default function Home() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();

  // Mock interactive state for demo
  const [streamRate, setStreamRate] = useState("0.05"); // USDC per second
  const [accruedWage, setAccruedWage] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(1250.0);
  const [aaveApy] = useState(5.42); // Mock Aave APY
  const [yieldEarned, setYieldEarned] = useState(12.45);
  const [isStreaming, setIsStreaming] = useState(true);

  // Real-time counter for accrued wages and yield
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Stream wages
      setAccruedWage((prev) => prev + parseFloat(streamRate));
      
      // Accrue yield on staked balance: yield = principal * (apy/100) / (seconds in a year)
      const secondsInYear = 31536000;
      const yieldPerSec = (stakedBalance * (aaveApy / 100)) / secondsInYear;
      setYieldEarned((prev) => prev + yieldPerSec);
    }, 1000);

    return () => clearInterval(interval);
  }, [isStreaming, streamRate, stakedBalance, aaveApy]);

  const handleToggleStream = () => {
    setIsStreaming(!isStreaming);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-slate-900">
      {/* Header */}
      <header className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
              <span className="font-bold text-slate-950 text-xl tracking-tighter">S</span>
            </div>
            <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              SEAFI
            </span>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-3 bg-slate-900 border border-slate-800 rounded-full py-1.5 pl-4 pr-1.5">
                <span className="text-xs font-semibold text-slate-400">
                  {user.address ? truncateAddress(user.address) : "Connected"}
                </span>
                <button
                  onClick={() => logout()}
                  className="bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white px-4 py-1.5 rounded-full text-xs font-medium transition-all"
                >
                  Disconnect
                </button>
              </div>
            ) : (
              <button
                onClick={openAuthModal}
                className="relative group overflow-hidden px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 font-semibold text-slate-950 text-sm shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0"
              >
                <span className="relative z-10">Connect Smart Wallet</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto px-6 py-12 w-full grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left column: Hero & Overview */}
        <section className="lg:col-span-5 flex flex-col justify-center gap-8">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/30 bg-cyan-950/20 text-cyan-400 text-xs font-medium">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-400 animate-pulse" />
              Powered by Arbitrum Stylus & ERC-4337
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
              Real-Time Salary{" "}
              <span className="bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 bg-clip-text text-transparent">
                Streaming
              </span>{" "}
              & Yield Protocol
            </h1>
            <p className="text-slate-400 text-base md:text-lg leading-relaxed">
              Ensure continuous payment for workers while idle capital automatically accumulates high-yield returns in Aave V3. Set up streams instantly with zero gas friction.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">STYLUS GAS EFFICIENCY</span>
              <span className="text-2xl font-bold text-slate-100">~98.4%</span>
              <span className="text-[10px] text-cyan-400 block mt-1">Saves gas compared to EVM</span>
            </div>
            <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800">
              <span className="text-xs text-slate-500 block mb-1">AAVE INTEGRATION</span>
              <span className="text-2xl font-bold text-slate-100">Automatic</span>
              <span className="text-[10px] text-blue-400 block mt-1">No manual staking required</span>
            </div>
          </div>
        </section>

        {/* Right column: Interactive Dashboard Mockup */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="p-6 md:p-8 rounded-3xl bg-slate-900/40 border border-slate-800/80 backdrop-blur-xl shadow-2xl relative overflow-hidden">
            {/* Ambient Background Glow */}
            <div className="absolute top-0 right-0 -mt-16 -mr-16 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl" />
            <div className="absolute bottom-0 left-0 -mb-16 -ml-16 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl" />

            <div className="relative space-y-8">
              
              {/* Wallet Info Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
                <div>
                  <h3 className="font-bold text-lg">Employee Dashboard</h3>
                  <p className="text-xs text-slate-500">Real-time salary allocations</p>
                </div>
                {user ? (
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Smart Account</span>
                    <span className="text-xs font-mono text-cyan-400 font-medium">
                      {user.address}
                    </span>
                  </div>
                ) : (
                  <div className="text-left sm:text-right">
                    <span className="text-xs text-slate-500 block">Status</span>
                    <span className="text-xs text-amber-500 font-medium">Demo Mode</span>
                  </div>
                )}
              </div>

              {/* Streaming Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Active Payroll Stream
                    </span>
                  </div>
                  <button
                    onClick={handleToggleStream}
                    className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all ${
                      isStreaming
                        ? "bg-emerald-950/30 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/30"
                        : "bg-slate-800 border-slate-700 text-slate-400 hover:bg-slate-700"
                    }`}
                  >
                    {isStreaming ? "Streaming Active" : "Stream Paused"}
                  </button>
                </div>

                <div className="p-6 rounded-2xl bg-slate-950/80 border border-slate-800/60 relative overflow-hidden">
                  <div className="flex flex-col items-center py-4 text-center">
                    <span className="text-sm text-slate-400 mb-1">Accrued Wage Balance</span>
                    <span className="text-4xl md:text-5xl font-mono font-bold tracking-tight text-transparent bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text">
                      ${accruedWage.toFixed(4)}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-2 block">
                      Receiving {streamRate} USDC per second
                    </span>
                  </div>

                  {/* Range Slider for Rate Adjustment */}
                  <div className="mt-4 pt-4 border-t border-slate-900">
                    <label className="text-xs text-slate-500 flex justify-between mb-2">
                      <span>Adjust Stream Rate (Employer Controls)</span>
                      <span className="font-mono text-cyan-400 font-bold">{streamRate} USDC/sec</span>
                    </label>
                    <input
                      type="range"
                      min="0.01"
                      max="0.25"
                      step="0.01"
                      value={streamRate}
                      onChange={(e) => setStreamRate(e.target.value)}
                      className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-500"
                    />
                  </div>
                </div>
              </div>

              {/* Yield/Aave Staking Section */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                
                {/* Vault Principal */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60">
                  <span className="text-xs text-slate-500 block mb-1">Staking Principal (aUSDC)</span>
                  <div className="flex items-baseline gap-2">
                    <span className="text-xl font-bold">${stakedBalance.toFixed(2)}</span>
                    <span className="text-xs text-cyan-400">+{aaveApy}% APY</span>
                  </div>
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => setStakedBalance((prev) => prev + 100)}
                      className="flex-1 bg-slate-900 border border-slate-800 hover:border-cyan-500/50 hover:text-cyan-400 text-xs py-2 rounded-lg font-medium transition-all"
                    >
                      Deposit $100
                    </button>
                    <button
                      onClick={() => stakedBalance > 100 && setStakedBalance((prev) => prev - 100)}
                      className="flex-1 bg-slate-900 border border-slate-800 hover:border-red-500/50 hover:text-red-400 text-xs py-2 rounded-lg font-medium transition-all"
                    >
                      Withdraw
                    </button>
                  </div>
                </div>

                {/* Accrued Yield */}
                <div className="p-5 rounded-2xl bg-slate-950/60 border border-slate-800/60 flex flex-col justify-between">
                  <div>
                    <span className="text-xs text-slate-500 block mb-1">Aave V3 Accrued Yield</span>
                    <span className="text-2xl font-mono font-bold text-cyan-400">
                      ${yieldEarned.toFixed(6)}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      setStakedBalance((prev) => prev + yieldEarned);
                      setYieldEarned(0);
                    }}
                    className="w-full bg-gradient-to-r from-cyan-500/10 to-blue-600/10 hover:from-cyan-500/20 hover:to-blue-600/20 border border-cyan-500/30 text-cyan-400 text-xs py-2 rounded-lg font-medium transition-all mt-4"
                  >
                    Compound Yield
                  </button>
                </div>

              </div>

              {/* Action Button */}
              {user ? (
                <div className="flex gap-4">
                  <button className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-sm shadow-lg shadow-cyan-500/10 transition-all duration-200">
                    Withdraw Accumulated Wages
                  </button>
                </div>
              ) : (
                <button
                  onClick={openAuthModal}
                  className="w-full py-4 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 font-bold text-sm text-slate-200 transition-all flex items-center justify-center gap-2 shadow-inner"
                >
                  <svg className="h-4 w-4 text-cyan-400 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Connect Wallet to Interact
                </button>
              )}

            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 py-8 text-center text-xs text-slate-500">
        <p>© 2026 SEAFI Protocol. All rights reserved.</p>
      </footer>
    </div>
  );
}
