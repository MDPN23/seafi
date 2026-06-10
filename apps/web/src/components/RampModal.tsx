"use client";

import React, { useState, useEffect } from "react";

interface RampModalProps {
  isOpen: boolean;
  onClose: () => void;
  walletAddress?: string;
  onSuccess: (amount: number, type: "onramp" | "offramp") => void;
  initialTab?: "onramp" | "offramp";
}

export function RampModal({ isOpen, onClose, walletAddress, onSuccess, initialTab = "onramp" }: RampModalProps) {
  const [activeTab, setActiveTab] = useState<"onramp" | "offramp">(initialTab);

  // Sync activeTab when modal is opened or initialTab changes
  useEffect(() => {
    if (isOpen) {
      setActiveTab(initialTab);
    }
  }, [isOpen, initialTab]);
  
  // Onramp State
  const [onrampAmount, setOnrampAmount] = useState("100");
  const [onrampCurrency, setOnrampCurrency] = useState("USD");
  const [onrampQuote, setOnrampQuote] = useState<any>(null);
  const [onrampStep, setOnrampStep] = useState<"input" | "checkout" | "loading" | "success">("input");
  
  // Stripe Checkout Form Mock State
  const [cardNumber, setCardNumber] = useState("4242 4242 4242 4242");
  const [expiry, setExpiry] = useState("12/29");
  const [cvc, setCvc] = useState("420");

  // Offramp State
  const [offrampAmount, setOfframpAmount] = useState("50");
  const [targetCurrency, setTargetCurrency] = useState("IDR");
  const [bankName, setBankName] = useState("Bank Central Asia (BCA)");
  const [accountName, setAccountName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [offrampQuote, setOfframpQuote] = useState<any>(null);
  const [offrampStep, setOfframpStep] = useState<"input" | "quote" | "processing" | "success">("input");
  const [offrampProgress, setOfframpProgress] = useState<number>(0);
  const [offrampLogs, setOfframpLogs] = useState<string[]>([]);

  // Currency symbols & configurations for Onramp
  const onrampCurrencyConfigs: Record<string, { symbol: string; rateToUsdc: number }> = {
    USD: { symbol: "$", rateToUsdc: 1.0 },
    EUR: { symbol: "€", rateToUsdc: 1.08 },
    SGD: { symbol: "S$", rateToUsdc: 0.74 },
    IDR: { symbol: "Rp", rateToUsdc: 0.000065 },
  };

  // Dynamic Bank Options based on Target Currency
  const bankOptions: Record<string, string[]> = {
    IDR: [
      "Bank Central Asia (BCA)",
      "Bank Mandiri",
      "Bank Rakyat Indonesia (BRI)",
      "Bank Negara Indonesia (BNI)",
      "Bank Jago",
    ],
    PHP: [
      "BDO Unibank (BDO)",
      "Bank of the Philippine Islands (BPI)",
      "GCash Wallet",
      "Metrobank",
    ],
    INR: [
      "State Bank of India (SBI)",
      "HDFC Bank",
      "ICICI Bank",
      "Paytm Payments Bank",
    ],
    SGD: [
      "DBS Bank",
      "OCBC Bank",
      "UOB Bank",
    ],
    VND: [
      "Vietcombank",
      "Techcombank",
      "BIDV Bank",
    ],
  };

  // Reset states when closed/opened
  useEffect(() => {
    if (isOpen) {
      setOnrampStep("input");
      setOfframpStep("input");
      setOfframpProgress(0);
      setOfframpLogs([]);
    }
  }, [isOpen]);

  // Update default bank when target currency changes
  useEffect(() => {
    if (bankOptions[targetCurrency]) {
      setBankName(bankOptions[targetCurrency][0]);
    }
  }, [targetCurrency]);

  // Recalculate Onramp Quote
  useEffect(() => {
    const fetchOnrampQuote = async () => {
      if (!onrampAmount || isNaN(parseFloat(onrampAmount)) || parseFloat(onrampAmount) <= 0) return;
      
      const config = onrampCurrencyConfigs[onrampCurrency] || onrampCurrencyConfigs.USD;
      const usdValue = parseFloat(onrampAmount) * config.rateToUsdc;

      try {
        const res = await fetch("/api/onramp/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ amount: usdValue.toFixed(2), walletAddress: walletAddress || "0x95c73B691653fbfd254f59eB8bCcC27a1c0d48D7" }),
        });
        const data = await res.json();
        if (data.success) {
          setOnrampQuote({
            ...data,
            inputCurrency: onrampCurrency,
            inputSymbol: config.symbol,
            inputAmount: parseFloat(onrampAmount).toFixed(2),
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchOnrampQuote, 300);
    return () => clearTimeout(debounce);
  }, [onrampAmount, onrampCurrency, walletAddress]);

  // Recalculate Offramp Quote
  useEffect(() => {
    const fetchOfframpQuote = async () => {
      if (!offrampAmount || isNaN(parseFloat(offrampAmount)) || parseFloat(offrampAmount) <= 0 || !accountName || !accountNumber) return;
      try {
        const res = await fetch("/api/offramp/session", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            amount: offrampAmount,
            bankName,
            accountName,
            accountNumber,
            walletAddress: walletAddress || "0x95c73B691653fbfd254f59eB8bCcC27a1c0d48D7",
            targetCurrency,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setOfframpQuote(data);
        }
      } catch (err) {
        console.error(err);
      }
    };

    const debounce = setTimeout(fetchOfframpQuote, 300);
    return () => clearTimeout(debounce);
  }, [offrampAmount, targetCurrency, bankName, accountName, accountNumber, walletAddress]);

  if (!isOpen) return null;

  // Handle Stripe Onramp Checkout Submit
  const handleOnrampSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setOnrampStep("loading");
    
    // Simulate Stripe payment processing & on-chain minting delay
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setOnrampStep("success");
    
    // Credit wallet balance
    const recAmt = onrampQuote ? parseFloat(onrampQuote.pricing.receiveAmount) : parseFloat(onrampAmount);
    onSuccess(recAmt, "onramp");
  };

  // Handle Offramp Bridge payout initiation
  const handleOfframpSubmit = async () => {
    setOfframpStep("processing");
    setOfframpProgress(10);
    setOfframpLogs([`[Bridge] Connecting offramp payout gateway for ${targetCurrency}...`]);

    const symbol = offrampQuote?.quote.currencySymbol || "$";
    const exchangeRate = offrampQuote?.quote.exchangeRate || "1";
    const railsName = offrampQuote?.quote.payoutMethodLabel || "Local Bank rails";

    const steps = [
      { progress: 25, log: "[Blockchain] Approving smart contract signature for transaction..." },
      { progress: 45, log: "[Blockchain] Routing USDC transfer to Bridge Liquidation Address..." },
      { progress: 70, log: `[Bridge] Crypto received. Conversion complete at rate 1 USDC = ${symbol}${parseFloat(exchangeRate).toLocaleString()}...` },
      { progress: 85, log: `[${railsName}] Transfer initiated to ${bankName} account...` },
      { progress: 100, log: `[${railsName}] Settlement confirmed by recipient bank!` },
    ];

    for (const step of steps) {
      await new Promise((resolve) => setTimeout(resolve, 1200));
      setOfframpProgress(step.progress);
      setOfframpLogs((prev) => [...prev, step.log]);
    }

    await new Promise((resolve) => setTimeout(resolve, 800));
    setOfframpStep("success");
    
    // Deduct balance
    onSuccess(-parseFloat(offrampAmount), "offramp");
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-md bg-white border border-divider rounded-[32px] overflow-hidden shadow-2xl relative card-shadow">
        
        {/* Header tabs (only show in input mode) */}
        {(onrampStep === "input" && offrampStep === "input") && (
          <div className="flex border-b border-divider bg-surface-card/40">
            <button
              onClick={() => setActiveTab("onramp")}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "onramp"
                  ? "border-brand-end text-brand-end bg-brand-start/5"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              Deposit (On-Ramp)
            </button>
            <button
              onClick={() => setActiveTab("offramp")}
              className={`flex-1 py-4 text-sm font-bold border-b-2 transition-all cursor-pointer ${
                activeTab === "offramp"
                  ? "border-brand-end text-brand-end bg-brand-start/5"
                  : "border-transparent text-text-secondary hover:text-text-primary"
              }`}
            >
              Withdraw (Off-Ramp)
            </button>
          </div>
        )}

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-secondary hover:text-text-primary p-1 rounded-lg hover:bg-surface-card transition-all cursor-pointer z-50"
        >
          <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* ONRAMP TAB VIEW */}
        {activeTab === "onramp" && (
          <div className="p-6">
            
            {/* Step 1: Input Amount */}
            {onrampStep === "input" && (
              <div className="space-y-5">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Deposit Local Currency to USDC</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Select your local currency to fund your smart account. Crypto acts as the settlement bridge.
                  </p>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {Object.keys(onrampCurrencyConfigs).map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setOnrampCurrency(curr)}
                      className={`py-2 text-xs font-bold rounded-lg border transition-all cursor-pointer ${
                        onrampCurrency === curr
                          ? "border-brand-end bg-brand-start/10 text-brand-end"
                          : "border-divider bg-surface-card/50 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {curr} ({onrampCurrencyConfigs[curr].symbol})
                    </button>
                  ))}
                </div>

                <div className="space-y-2">
                  <label className="text-xs text-text-secondary block font-medium">Amount to Spend ({onrampCurrency})</label>
                  <div className="relative">
                    <input
                      type="number"
                      value={onrampAmount}
                      onChange={(e) => setOnrampAmount(e.target.value)}
                      placeholder="0.00"
                      min="10"
                      className="w-full bg-surface-card border border-divider rounded-xl py-3 pl-10 pr-4 text-text-primary text-lg font-semibold focus:outline-none focus:border-brand-end transition-colors"
                    />
                    <span className="absolute left-4 top-3.5 text-text-secondary font-bold">
                      {onrampCurrencyConfigs[onrampCurrency]?.symbol || "$"}
                    </span>
                  </div>
                </div>

                {onrampQuote && (
                  <div className="p-4 rounded-2xl bg-surface-card border border-divider text-xs space-y-2.5 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Stripe Processing Fee</span>
                      <span className="text-text-primary font-medium">
                        {onrampQuote.inputSymbol}{((parseFloat(onrampQuote.pricing.stripeFee) / onrampCurrencyConfigs[onrampCurrency].rateToUsdc)).toFixed(2)} {onrampCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Network / Gas Fee</span>
                      <span className="text-text-primary font-medium">Sponsored</span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-divider pt-2 text-brand-end text-sm">
                      <span>USDC Credited to Smart Account</span>
                      <span>{onrampQuote.pricing.receiveAmount} USDC</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOnrampStep("checkout")}
                  disabled={!onrampQuote}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-lg shadow-brand-end/10 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                >
                  Pay with Stripe
                </button>
              </div>
            )}

            {/* Step 2: Stripe Mock Form */}
            {onrampStep === "checkout" && (
              <form onSubmit={handleOnrampSubmit} className="space-y-5 pt-3">
                <div className="flex items-center gap-2 pb-2 border-b border-divider">
                  <div className="h-6 w-12 bg-purple-600 rounded flex items-center justify-center font-extrabold text-[10px] text-white">
                    stripe
                  </div>
                  <span className="text-xs font-bold text-text-secondary">Crypto Onramp Checkout</span>
                </div>

                <div className="p-4 rounded-xl bg-brand-start/10 border border-brand-end/25 text-xs text-brand-end flex items-center justify-between font-semibold">
                  <span>Funding Amount:</span>
                  <span className="font-bold font-mono text-sm">
                    {onrampCurrencyConfigs[onrampCurrency]?.symbol}{parseFloat(onrampAmount).toLocaleString()} {onrampCurrency}
                  </span>
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Card Number</label>
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full bg-surface-card border border-divider rounded-xl py-2 px-3 text-text-primary text-xs font-mono focus:outline-none focus:border-brand-end"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">Expiration</label>
                      <input
                        type="text"
                        value={expiry}
                        onChange={(e) => setExpiry(e.target.value)}
                        className="w-full bg-surface-card border border-divider rounded-xl py-2 px-3 text-text-primary text-xs font-mono focus:outline-none focus:border-brand-end"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-text-secondary uppercase font-bold block mb-1">CVC</label>
                      <input
                        type="text"
                        value={cvc}
                        onChange={(e) => setCvc(e.target.value)}
                        className="w-full bg-surface-card border border-divider rounded-xl py-2 px-3 text-text-primary text-xs font-mono focus:outline-none focus:border-brand-end"
                      />
                    </div>
                  </div>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setOnrampStep("input")}
                    className="flex-1 py-3 px-4 rounded-xl bg-surface-card hover:bg-divider text-text-secondary font-bold text-xs cursor-pointer transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs cursor-pointer shadow-lg shadow-emerald-600/10 transition-all"
                  >
                    Confirm & Authorize
                  </button>
                </div>
              </form>
            )}

            {/* Step 3: Loading */}
            {onrampStep === "loading" && (
              <div className="py-12 flex flex-col items-center justify-center text-center space-y-4">
                <svg className="animate-spin h-10 w-10 text-brand-end" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-text-primary">Processing Stripe Deposit</h4>
                  <p className="text-xs text-text-secondary">Minting and transferring USDC to smart account on-chain...</p>
                </div>
              </div>
            )}

            {/* Step 4: Success Receipt */}
            {onrampStep === "success" && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-text-primary">Deposit Successful!</h4>
                  <p className="text-xs text-text-secondary">
                    Fiat money converted and received as USDC on Arbitrum Sepolia.
                  </p>
                </div>
                
                <div className="w-full p-4 bg-surface-card rounded-[20px] border border-divider text-xs font-mono text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Paid Amount:</span>
                    <span className="text-text-primary font-bold">
                      {onrampCurrencyConfigs[onrampCurrency]?.symbol}{parseFloat(onrampAmount).toLocaleString()} {onrampCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Funded:</span>
                    <span className="text-emerald-600 font-extrabold">+{onrampQuote?.pricing.receiveAmount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary font-medium">Tx Hash:</span>
                    <span className="text-brand-end font-semibold text-[10px]">0x3ab8...83c9</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-surface-card hover:bg-divider text-text-primary font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Close Receipt
                </button>
              </div>
            )}

          </div>
        )}

        {/* OFFRAMP TAB VIEW */}
        {activeTab === "offramp" && (
          <div className="p-6">
            
            {/* Step 1: Input details */}
            {offrampStep === "input" && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Withdraw USDC to Bank</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Select your destination country. Crypto acts as the bridge to send local bank transfers instantly.
                  </p>
                </div>

                <div className="grid grid-cols-5 gap-1.5">
                  {["IDR", "PHP", "INR", "SGD", "VND"].map((curr) => (
                    <button
                      key={curr}
                      onClick={() => setTargetCurrency(curr)}
                      className={`py-1.5 text-[10px] font-bold rounded-md border transition-all cursor-pointer ${
                        targetCurrency === curr
                          ? "border-brand-end bg-brand-start/10 text-brand-end"
                          : "border-divider bg-surface-card/50 text-text-secondary hover:text-text-primary"
                      }`}
                    >
                      {curr}
                    </button>
                  ))}
                </div>

                <div className="space-y-3 text-xs">
                  <div>
                    <label className="text-text-secondary block mb-1 font-medium">Select Local Bank</label>
                    <select
                      value={bankName}
                      onChange={(e) => setBankName(e.target.value)}
                      className="w-full bg-surface-card border border-divider rounded-xl py-3 px-3 text-text-primary focus:outline-none focus:border-brand-end cursor-pointer"
                    >
                      {(bankOptions[targetCurrency] || bankOptions.IDR).map((opt) => (
                        <option key={opt}>{opt}</option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-text-secondary block mb-1 font-medium">Account Owner Name</label>
                      <input
                        type="text"
                        value={accountName}
                        onChange={(e) => setAccountName(e.target.value)}
                        placeholder="John Doe"
                        className="w-full bg-surface-card border border-divider rounded-xl py-3 px-3 text-text-primary focus:outline-none focus:border-brand-end"
                      />
                    </div>
                    <div>
                      <label className="text-text-secondary block mb-1 font-medium">Account Number</label>
                      <input
                        type="text"
                        value={accountNumber}
                        onChange={(e) => setAccountNumber(e.target.value)}
                        placeholder="0123456789"
                        className="w-full bg-surface-card border border-divider rounded-xl py-3 px-3 text-text-primary focus:outline-none focus:border-brand-end"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-text-secondary block mb-1 font-medium">Amount to Cash-Out (USDC)</label>
                    <input
                      type="number"
                      value={offrampAmount}
                      onChange={(e) => setOfframpAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full bg-surface-card border border-divider rounded-xl py-3 px-3 text-text-primary text-sm font-semibold focus:outline-none focus:border-brand-end"
                    />
                  </div>
                </div>

                {offrampQuote && (
                  <div className="p-4 rounded-2xl bg-surface-card border border-divider text-xs space-y-2.5 shadow-sm">
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Exchange Rate</span>
                      <span className="text-text-primary font-medium">
                        1 USDC = {offrampQuote.quote.currencySymbol}{parseFloat(offrampQuote.quote.exchangeRate).toLocaleString()} {targetCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">{offrampQuote.quote.payoutMethodLabel} Fee</span>
                      <span className="text-text-primary font-medium">
                        {offrampQuote.quote.currencySymbol}{parseFloat(offrampQuote.quote.fees.bankFeeFiat).toLocaleString()} {targetCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-text-secondary">Bridge Settlement Fee (0.5%)</span>
                      <span className="text-text-primary font-medium">
                        {offrampQuote.quote.currencySymbol}{parseFloat(offrampQuote.quote.fees.platformFeeFiat).toLocaleString()} {targetCurrency}
                      </span>
                    </div>
                    <div className="flex justify-between font-bold border-t border-divider pt-2 text-brand-end text-sm">
                      <span>Total Net Payout Received</span>
                      <span>
                        {offrampQuote.quote.currencySymbol}{parseFloat(offrampQuote.quote.netReceiveFiat).toLocaleString()} {targetCurrency}
                      </span>
                    </div>
                  </div>
                )}

                <button
                  onClick={() => setOfframpStep("quote")}
                  disabled={!offrampQuote}
                  className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-sm shadow-lg shadow-brand-end/10 cursor-pointer transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:opacity-90"
                >
                  Review Quote
                </button>
              </div>
            )}

            {/* Step 2: Confirm off-ramp */}
            {offrampStep === "quote" && (
              <div className="space-y-5 pt-2">
                <div>
                  <h3 className="text-lg font-bold text-text-primary">Confirm Cash-Out Quote</h3>
                  <p className="text-xs text-text-secondary mt-1">
                    Please verify your destination and bank credentials. Settlement is executed via Bridge rails.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-surface-card border border-divider text-xs space-y-3.5 shadow-sm">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Bank Name</span>
                    <span className="text-text-primary font-semibold">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Account Owner</span>
                    <span className="text-text-primary font-semibold">{accountName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Account Number</span>
                    <span className="text-text-primary font-mono font-semibold">{offrampQuote?.bankDetails.accountNumber}</span>
                  </div>
                  <div className="flex justify-between border-t border-divider pt-3">
                    <span className="text-text-secondary">Debited Crypto</span>
                    <span className="text-text-primary font-bold">{offrampAmount} USDC</span>
                  </div>
                  <div className="flex justify-between font-bold text-brand-end text-sm">
                    <span>Local Bank Payout</span>
                    <span>
                      {offrampQuote?.quote.currencySymbol}{parseFloat(offrampQuote?.quote.netReceiveFiat).toLocaleString()} {targetCurrency}
                    </span>
                  </div>
                </div>

                <div className="flex gap-2.5">
                  <button
                    onClick={() => setOfframpStep("input")}
                    className="flex-1 py-3 px-4 rounded-xl bg-surface-card hover:bg-divider text-text-secondary font-bold text-xs cursor-pointer transition-all"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleOfframpSubmit}
                    className="flex-1 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-start to-brand-end text-white font-bold text-xs cursor-pointer shadow-lg shadow-brand-end/10 hover:opacity-90 transition-all"
                  >
                    Authorize Payout
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payout progress logs */}
            {offrampStep === "processing" && (
              <div className="py-4 space-y-5">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-text-primary">Processing Bank Payout</h4>
                  <span className="text-xs font-mono text-brand-end font-bold">{offrampProgress}%</span>
                </div>
                
                {/* Progress bar */}
                <div className="w-full h-1.5 bg-surface-card rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-brand-start to-brand-end transition-all duration-500"
                    style={{ width: `${offrampProgress}%` }}
                  />
                </div>

                {/* Console logs */}
                <div className="bg-surface-card border border-divider p-4 rounded-2xl h-[180px] overflow-y-auto font-mono text-[10px] leading-relaxed flex flex-col gap-2 scrollbar-none text-text-primary">
                  {offrampLogs.map((log, index) => (
                    <div key={index} className="text-text-secondary flex items-start gap-1">
                      <span className="text-emerald-600 font-bold">✓</span>
                      <span>{log}</span>
                    </div>
                  ))}
                  <div className="animate-pulse text-brand-end flex items-center gap-1.5 mt-1">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-end" />
                    <span>Awaiting local bank routing...</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Success Receipt */}
            {offrampStep === "success" && (
              <div className="py-6 flex flex-col items-center justify-center text-center space-y-5 animate-fade-in">
                <div className="h-14 w-14 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 shadow-sm">
                  <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h4 className="text-lg font-bold text-text-primary">Payout Transferred!</h4>
                  <p className="text-xs text-text-secondary">
                    Your stablecoin has been converted and sent directly to your local bank account.
                  </p>
                </div>
                
                <div className="w-full p-4 bg-surface-card rounded-[20px] border border-divider text-xs font-mono text-left space-y-2">
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Provider:</span>
                    <span className="text-text-primary">Bridge Settlement Rails</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Paid Amount:</span>
                    <span className="text-emerald-600 font-extrabold">
                      {offrampQuote?.quote.currencySymbol}{parseFloat(offrampQuote?.quote.netReceiveFiat).toLocaleString()} {targetCurrency}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Debited Balance:</span>
                    <span className="text-text-secondary">-{offrampAmount} USDC</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Recipient Bank:</span>
                    <span className="text-text-primary">{bankName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-text-secondary">Payout ID:</span>
                    <span className="text-text-secondary text-[10px]">{offrampQuote?.payoutId}</span>
                  </div>
                </div>

                <button
                  onClick={onClose}
                  className="w-full py-3 bg-surface-card hover:bg-divider text-text-primary font-bold text-xs rounded-xl cursor-pointer transition-all"
                >
                  Close Receipt
                </button>
              </div>
            )}

          </div>
        )}

      </div>
    </div>
  );
}
