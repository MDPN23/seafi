"use client";

import React, { useState, useEffect } from "react";
import { useUser, useAuthModal, useLogout } from "@account-kit/react";
import { X402Playground } from "@/components/X402Playground";
import { RampModal } from "@/components/RampModal";

export default function PayrollPage() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();

  // Role State (switch between Employee and Employer dashboard views)
  const [activeRole, setActiveRole] = useState<"employee" | "employer">("employee");

  // Mock interactive state for employee
  const [streamRate, setStreamRate] = useState("0.05"); // USDC per second
  const [accruedWage, setAccruedWage] = useState(0);
  const [stakedBalance, setStakedBalance] = useState(1250.0);
  const [aaveApy] = useState(5.42); // Mock Aave APY
  const [yieldEarned, setYieldEarned] = useState(12.45);
  const [isStreaming, setIsStreaming] = useState(true);

  // Employer active streams list state
  const [streams, setStreams] = useState([
    { id: 1, name: "Rian (Frontend)", address: "0x71C7...7431", rate: 0.05, accrued: 245.50, isStreaming: true },
    { id: 2, name: "Amanda (Designer)", address: "0x89A4...2849", rate: 0.04, accrued: 182.20, isStreaming: true },
  ]);

  // Employer Create Stream Form State
  const [newEmpAddress, setNewEmpAddress] = useState("");
  const [newEmpName, setNewEmpName] = useState("");
  const [newEmpRate, setNewEmpRate] = useState("0.05");
  const [isCreatingStream, setIsCreatingStream] = useState(false);

  // Employee transaction history state
  const [txHistory, setTxHistory] = useState([
    { id: 1, type: "On-Ramp", amount: "+$200.00", status: "Settled (Stripe)", date: "2026-06-10" },
    { id: 2, type: "Off-Ramp", amount: "-$120.00", status: "Paid Rp1,830,000 (BCA)", date: "2026-06-09" },
    { id: 3, type: "Off-Ramp", amount: "-$50.00", status: "Paid ₱2,820 (GCash)", date: "2026-06-08" },
  ]);

  // Orchestrator State
  const [isRebalancing, setIsRebalancing] = useState(false);
  const [rebalanceStatus, setRebalanceStatus] = useState<string | null>(null);

  // Ramp States
  const [rampOpen, setRampOpen] = useState(false);
  const [rampType, setRampType] = useState<"onramp" | "offramp">("onramp");

  const handleOpenRamp = (type: "onramp" | "offramp") => {
    setRampType(type);
    setRampOpen(true);
  };

  const handleRampSuccess = (amount: number, type: "onramp" | "offramp") => {
    if (type === "onramp") {
      setStakedBalance((prev) => prev + amount);
      setTxHistory((prev) => [
        {
          id: Date.now(),
          type: "On-Ramp",
          amount: `+$${amount.toFixed(2)}`,
          status: "Settled (Stripe)",
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    } else {
      setStakedBalance((prev) => Math.max(0, prev + amount));
      setAccruedWage((prev) => Math.max(0, prev + amount));
      setTxHistory((prev) => [
        {
          id: Date.now(),
          type: "Off-Ramp",
          amount: `-$${Math.abs(amount).toFixed(2)}`,
          status: "Paid (Bank Payout)",
          date: new Date().toISOString().split("T")[0],
        },
        ...prev,
      ]);
    }
  };

  const handleOrchestratorRebalance = async () => {
    setIsRebalancing(true);
    setRebalanceStatus("Initiating rebalance...");
    try {
      const response = await fetch("/api/orchestrator/rebalance", {
        method: "POST",
      });
      const data = await response.json();
      if (data.success) {
        setRebalanceStatus(`Success! Hash: ${data.txHash.slice(0, 10)}...`);
        if (data.mode === "simulation") {
          setStakedBalance((prev) => prev + 125);
        }
      } else {
        setRebalanceStatus(`Failed: ${data.error}`);
      }
    } catch (err: any) {
      setRebalanceStatus(`Error: ${err.message || err}`);
    } finally {
      setIsRebalancing(false);
      setTimeout(() => setRebalanceStatus(null), 4000);
    }
  };

  // Real-time counter for accrued wages, employee list streams, and yield
  useEffect(() => {
    if (!isStreaming) return;

    const interval = setInterval(() => {
      // Stream employee's own mock salary
      setAccruedWage((prev) => prev + parseFloat(streamRate));
      
      // Stream employer's worker salaries
      setStreams((prevStreams) =>
        prevStreams.map((s) =>
          s.isStreaming
            ? { ...s, accrued: s.accrued + s.rate }
            : s
        )
      );

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

  const handleCreateStream = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpAddress || !newEmpName || !newEmpRate) return;
    setIsCreatingStream(true);

    // Simulate smart contract stream deployment delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    const newStream = {
      id: Date.now(),
      name: newEmpName,
      address: newEmpAddress.slice(0, 6) + "..." + newEmpAddress.slice(-4),
      rate: parseFloat(newEmpRate),
      accrued: 0,
      isStreaming: true,
    };

    setStreams((prev) => [...prev, newStream]);
    setNewEmpAddress("");
    setNewEmpName("");
    setIsCreatingStream(false);
  };

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="flex-1 w-full max-w-7xl mx-auto px-6 py-8 flex flex-col font-sans antialiased selection:bg-brand-start selection:text-text-primary">
      {/* Content wrapper */}
      <div className="flex-1 space-y-8 py-4">
        {/* Page Title & Role Switcher */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-text-primary">
              Real-Time Streaming Payroll
            </h1>
            <p className="text-xs text-text-secondary mt-1">
              Smart contract streams running on Arbitrum Stylus. Resting assets are automatically staked in Aave V3.
            </p>
          </div>

          {/* Role selector tab styling */}
          <div className="flex bg-surface-card border border-divider rounded-full p-1 self-start md:self-auto">
            <button
              onClick={() => setActiveRole("employee")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRole === "employee"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Employee View
            </button>
            <button
              onClick={() => setActiveRole("employer")}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all cursor-pointer ${
                activeRole === "employer"
                  ? "bg-white text-text-primary shadow-sm"
                  : "text-text-secondary hover:text-text-primary"
              }`}
            >
              Employer Dashboard
            </button>
          </div>
        </div>

        {/* EMPLOYEE VIEW */}
        {activeRole === "employee" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Col: Main Stream Balance Card */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Accrued wage & yield panel */}
              <div className="bg-white border border-divider rounded-[32px] p-8 relative overflow-hidden shadow-sm card-shadow">
                <div className="absolute top-0 right-0 h-40 w-40 bg-brand-start/10 rounded-bl-full blur-2xl pointer-events-none" />
                
                <div className="flex flex-col md:flex-row justify-between gap-6">
                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest">Accrued Unclaimed Balance</span>
                    <div className="flex items-baseline gap-2">
                      <span className="text-5xl font-extrabold tracking-tight font-mono text-text-primary">
                        ${accruedWage.toFixed(4)}
                      </span>
                      <span className="text-sm font-bold text-brand-end">USDC</span>
                    </div>
                    <div className="flex items-center gap-1.5 pt-1.5">
                      <span className={`h-2.5 w-2.5 rounded-full ${isStreaming ? "bg-emerald-500 animate-ping" : "bg-rose-500"}`} />
                      <span className="text-xs font-bold text-text-secondary">
                        {isStreaming ? "Streaming active" : "Streaming paused"} (${streamRate} USDC/sec)
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-3 items-start md:self-center">
                    <button
                      onClick={handleToggleStream}
                      className={`px-6 py-3 rounded-full font-bold text-xs shadow-sm cursor-pointer transition-all ${
                        isStreaming
                          ? "bg-surface-card hover:bg-divider text-text-primary"
                          : "bg-gradient-to-r from-brand-start to-brand-end text-white hover:opacity-95"
                      }`}
                    >
                      {isStreaming ? "Pause Stream" : "Resume Stream"}
                    </button>
                    <button
                      onClick={() => handleOpenRamp("offramp")}
                      className="px-6 py-3 rounded-full bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-xs shadow-lg shadow-brand-end/10 hover:opacity-95 cursor-pointer transition-all"
                    >
                      Withdraw (Off-Ramp)
                    </button>
                  </div>
                </div>

                {/* Staking Yield Details (Aave Integration) */}
                <div className="mt-8 pt-6 border-t border-divider grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Auto-Staked (Aave)</span>
                    <span className="text-base font-bold text-text-primary font-mono">${stakedBalance.toFixed(2)} USDC</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Staking APY</span>
                    <span className="text-base font-bold text-emerald-600 font-mono">{aaveApy}% APY</span>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Yield Generated</span>
                    <span className="text-base font-extrabold text-emerald-600 font-mono">+${yieldEarned.toFixed(6)} USDC</span>
                  </div>
                  <div className="space-y-0.5 col-span-2 md:col-span-1">
                    <span className="text-[10px] text-text-secondary font-bold uppercase tracking-wider block">Smart Account Wallet</span>
                    <span className="text-xs font-semibold text-brand-end font-mono">Arbitrum Sepolia</span>
                  </div>
                </div>
              </div>

              {/* Transactions History */}
              <div className="bg-white border border-divider rounded-[32px] p-8 shadow-sm card-shadow">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-bold text-text-primary text-lg">Transaction Activity</h3>
                  <button
                    onClick={() => handleOpenRamp("onramp")}
                    className="text-xs font-bold text-brand-end hover:underline cursor-pointer"
                  >
                    + Add Funds (On-Ramp)
                  </button>
                </div>
                <div className="divide-y divide-divider">
                  {txHistory.map((tx) => (
                    <div key={tx.id} className="py-4 flex justify-between items-center text-xs">
                      <div className="space-y-1">
                        <span className="font-bold text-text-primary">{tx.type}</span>
                        <span className="text-[10px] text-text-secondary block font-mono">{tx.date}</span>
                      </div>
                      <div className="text-right space-y-1">
                        <span className={`font-bold font-mono ${tx.amount.startsWith("+") ? "text-emerald-600" : "text-text-primary"}`}>
                          {tx.amount}
                        </span>
                        <span className="text-[10px] text-text-secondary block font-semibold">{tx.status}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Col: AI-to-AI simulated playground */}
            <div className="lg:col-span-4 space-y-6">
              <X402Playground />
            </div>
          </div>
        )}

        {/* EMPLOYER VIEW */}
        {activeRole === "employer" && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* Left side: Streams management */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-white border border-divider rounded-[32px] p-8 shadow-sm card-shadow">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                  <h3 className="font-bold text-text-primary text-lg">Active Employee Salary Streams</h3>
                  <div className="flex gap-2">
                    <button
                      onClick={handleOrchestratorRebalance}
                      disabled={isRebalancing}
                      className={`px-4 py-2.5 rounded-full font-bold text-xs transition-all shadow-sm flex items-center gap-1.5 cursor-pointer ${
                        isRebalancing
                          ? "bg-surface-card text-text-secondary cursor-not-allowed"
                          : "bg-surface-card hover:bg-divider text-text-primary"
                      }`}
                    >
                      {isRebalancing ? "Rebalancing..." : "Trigger Rebalance"}
                    </button>
                  </div>
                </div>

                {rebalanceStatus && (
                  <div className="mb-4 p-3 rounded-xl bg-brand-start/10 text-brand-end text-xs font-semibold text-center border border-brand-end/20">
                    {rebalanceStatus}
                  </div>
                )}

                <div className="space-y-4">
                  {streams.map((s) => (
                    <div key={s.id} className="p-5 border border-divider rounded-[20px] bg-surface-card/20 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 hover:border-brand-start transition-all">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-text-primary text-sm">{s.name}</span>
                          <span className="text-[10px] font-bold text-text-secondary bg-surface-card py-0.5 px-2 rounded-full font-mono">{s.address}</span>
                        </div>
                        <div className="text-xs text-text-secondary font-medium">
                          Accrued: <strong className="text-text-primary font-mono">${s.accrued.toFixed(2)} USDC</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 self-end sm:self-auto">
                        <span className="text-xs font-bold text-emerald-600 font-mono">
                          {s.rate} USDC/s
                        </span>
                        <button
                          onClick={() => {
                            setStreams((prev) =>
                              prev.map((item) =>
                                item.id === s.id
                                  ? { ...item, isStreaming: !item.isStreaming }
                                  : item
                              )
                            );
                          }}
                          className={`px-4 py-2 rounded-full font-bold text-[10px] transition-all cursor-pointer ${
                            s.isStreaming
                              ? "bg-rose-50 hover:bg-rose-100 text-rose-600"
                              : "bg-emerald-50 hover:bg-emerald-100 text-emerald-600"
                          }`}
                        >
                          {s.isStreaming ? "Pause Stream" : "Resume Stream"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right side: Deploy new stream Form */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white border border-divider rounded-[32px] p-6 shadow-sm card-shadow">
                <h3 className="font-bold text-text-primary text-md mb-4">Create New Salary Stream</h3>
                <form onSubmit={handleCreateStream} className="space-y-4">
                  <div>
                    <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Employee Name</label>
                    <input
                      type="text"
                      required
                      value={newEmpName}
                      onChange={(e) => setNewEmpName(e.target.value)}
                      placeholder="E.g. Joshua"
                      className="w-full bg-surface-card border border-divider rounded-xl py-2.5 px-3 text-text-primary text-xs focus:outline-none focus:border-brand-end"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Smart Wallet Address</label>
                    <input
                      type="text"
                      required
                      value={newEmpAddress}
                      onChange={(e) => setNewEmpAddress(e.target.value)}
                      placeholder="0x..."
                      className="w-full bg-surface-card border border-divider rounded-xl py-2.5 px-3 text-text-primary text-xs font-mono focus:outline-none focus:border-brand-end"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Stream Rate (USDC/sec)</label>
                    <select
                      value={newEmpRate}
                      onChange={(e) => setNewEmpRate(e.target.value)}
                      className="w-full bg-surface-card border border-divider rounded-xl py-2.5 px-3 text-text-primary text-xs focus:outline-none focus:border-brand-end cursor-pointer"
                    >
                      <option value="0.02">0.02 USDC/sec ($72/hr)</option>
                      <option value="0.05">0.05 USDC/sec ($180/hr)</option>
                      <option value="0.10">0.10 USDC/sec ($360/hr)</option>
                    </select>
                  </div>
                  <button
                    type="submit"
                    disabled={isCreatingStream}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-xs shadow-md shadow-brand-end/10 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isCreatingStream ? (
                      <>
                        <svg className="animate-spin h-3.5 w-3.5 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Deploying stream...
                      </>
                    ) : (
                      "Authorize & Stream"
                    )}
                  </button>
                </form>
              </div>
            </div>

          </div>
        )}

      </div>

      {/* Ramp Modal integration */}
      {rampOpen && (
        <RampModal
          isOpen={rampOpen}
          onClose={() => setRampOpen(false)}
          initialTab={rampType}
          onSuccess={handleRampSuccess}
        />
      )}
    </div>
  );
}
