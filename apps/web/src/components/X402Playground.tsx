"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { createWalletClient, custom } from "viem";
import { arbitrumSepolia } from "viem/chains";

interface LogEntry {
  timestamp: string;
  type: "request" | "response" | "info" | "success" | "error";
  message: string;
  details?: any;
}

export function X402Playground() {
  const { ready, authenticated, user } = usePrivy();
  const [logs, setLogs] = useState<LogEntry[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [premiumData, setPremiumData] = useState<any>(null);
  const [step, setStep] = useState<number>(0);

  const addLog = (type: LogEntry["type"], message: string, details?: any) => {
    const time = new Date().toLocaleTimeString();
    setLogs((prev) => [...prev, { timestamp: time, type, message, details }]);
  };

  const clearLogs = () => {
    setLogs([]);
    setPremiumData(null);
    setStep(0);
  };

  const handleSimulateX402 = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setPremiumData(null);
    setLogs([]);
    setStep(1);

    try {
      // Step 1: Client agent calls the API without payment proof
      addLog("info", "AI Agent triggering request to premium financial advice endpoint...");
      addLog("request", "GET /api/x402 HTTP/1.1\nHost: seafi.protocol");
      
      await new Promise((resolve) => setTimeout(resolve, 1000));

      const initialResponse = await fetch("/api/x402", {
        method: "GET",
      });

      const responseHeaders: Record<string, string> = {};
      initialResponse.headers.forEach((val, key) => {
        responseHeaders[key] = val;
      });

      const body = await initialResponse.json();

      if (initialResponse.status === 402) {
        setStep(2);
        addLog("response", `HTTP/1.1 402 Payment Required\n` + JSON.stringify(responseHeaders, null, 2), body);
        addLog("info", `X402 Protocol activated! Server demands ${body.paymentInstructions.amountFormatted} USDC on chain ID ${body.paymentInstructions.chainId}.`);
        addLog("info", `Destination address: ${body.paymentInstructions.destination}`);
        
        await new Promise((resolve) => setTimeout(resolve, 1500));

        let txHash = "";

        // Step 2: Pay the protocol. Check if wallet is connected.
        if (user && window.ethereum) {
          setStep(3);
          addLog("info", "Smart wallet detected. Prompting user/agent for on-chain USDC transfer approval...");
          
          try {
            // Initiate actual transaction using viem custom wallet client
            const walletClient = createWalletClient({
              chain: arbitrumSepolia,
              transport: custom(window.ethereum),
            });
            
            // Request accounts
            const [address] = await walletClient.requestAddresses();
            
            addLog("info", `Sending 0.5 USDC to payment address from ${address}...`);
            
            // We transfer the mock USDC (ERC20) or Arb Sepolia ETH as fallback/simulated payment
            // For the demo we send a minimal value transfer or USDC if deployed.
            // Let's send a 0 ETH transaction to the payment address to get a valid real Tx Hash
            const hash = await walletClient.sendTransaction({
              account: address,
              to: body.paymentInstructions.destination as `0x${string}`,
              value: BigInt(0), // 0 ETH is fast and demonstrates the proof perfectly
            });

            txHash = hash;
            addLog("success", `Transaction submitted successfully! Hash: ${txHash}`);
            addLog("info", "Waiting for transaction to propagate on Arbitrum Sepolia...");
            await new Promise((resolve) => setTimeout(resolve, 3000)); // wait for indexing

          } catch (walletError: any) {
            addLog("error", `Wallet transaction rejected/failed: ${walletError.message || walletError}`);
            addLog("info", "Switching to Simulated Sandboxed Agent Mode to complete the demonstration.");
            await new Promise((resolve) => setTimeout(resolve, 1000));
            // Fallback to mock hash
            txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
            addLog("info", `Simulated agent transaction hash generated: ${txHash}`);
          }
        } else {
          setStep(3);
          addLog("info", "Running in Agent Sandbox Mode (no wallet connected).");
          addLog("info", "AI Agent automatically signing payment authorization and executing transfer...");
          
          await new Promise((resolve) => setTimeout(resolve, 1500));
          txHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
          
          addLog("success", `Mock on-chain transaction successful. Hash: ${txHash}`);
        }

        // Step 3: Re-submit request with transaction hash as proof
        setStep(4);
        addLog("info", "Resubmitting API request with payment proof header...");
        addLog(
          "request",
          `GET /api/x402 HTTP/1.1\n` +
          `Host: seafi.protocol\n` +
          `X-402-Payment-Proof: ${txHash}`
        );

        await new Promise((resolve) => setTimeout(resolve, 1200));

        const secondResponse = await fetch("/api/x402", {
          method: "GET",
          headers: {
            "X-402-Payment-Proof": txHash,
          },
        });

        const secondBody = await secondResponse.json();

        if (secondResponse.ok) {
          setStep(5);
          addLog("success", `HTTP/1.1 200 OK\n` + JSON.stringify(secondBody.content, null, 2));
          setPremiumData(secondBody.content);
        } else {
          addLog("error", `HTTP/1.1 ${secondResponse.status} ${secondResponse.statusText}\n` + JSON.stringify(secondBody, null, 2));
        }

      } else {
        addLog("error", `Unexpected response status: ${initialResponse.status}`);
      }

    } catch (err: any) {
      addLog("error", `Failed: ${err.message || err}`);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white border border-divider rounded-[32px] p-6 md:p-8 shadow-xl relative overflow-hidden card-shadow">
      {/* Glow Effect */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-brand-start/10 rounded-full blur-2xl pointer-events-none" />
      
      <div className="flex flex-col gap-6">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-brand-end/30 bg-brand-start/10 text-brand-end text-xs font-semibold mb-3">
            <span className="h-1.5 w-1.5 rounded-full bg-brand-end" />
            X402 Protocol Playground
          </div>
          <h2 className="text-2xl font-bold text-text-primary">AI-to-AI Machine Payments</h2>
          <p className="text-text-secondary text-sm mt-1 leading-relaxed">
            Experience how autonomous AI agents pay for real-time services on-demand. This panel simulates an AI model encountering an HTTP 402 (Payment Required) status code, processing an Arbitrum transaction, and resubmitting proof.
          </p>
        </div>

        {/* Steps indicator */}
        <div className="grid grid-cols-5 gap-2 text-center text-xs">
          {[
            "1. Call API",
            "2. Receive 402",
            "3. Pay Wallet",
            "4. Send Proof",
            "5. Access 200"
          ].map((s, idx) => (
            <div
              key={idx}
              className={`py-2 px-1 rounded-lg border font-semibold transition-all ${
                step === idx + 1
                  ? "bg-brand-start/10 border-brand-end text-brand-end shadow-sm"
                  : step > idx + 1
                  ? "bg-emerald-50 border-emerald-200 text-emerald-600"
                  : "bg-surface-card border-divider text-text-secondary"
              }`}
            >
              {s}
            </div>
          ))}
        </div>

        {/* Interactive panel split */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Logs console */}
          <div className="lg:col-span-7 flex flex-col gap-2">
            <div className="flex items-center justify-between text-xs text-text-secondary px-1 font-medium">
              <span>AGENT CONSOLE LOGS</span>
              <button
                onClick={clearLogs}
                className="hover:text-text-primary transition-colors cursor-pointer"
                disabled={isRunning}
              >
                Clear
              </button>
            </div>
            <div className="bg-surface-card border border-divider rounded-2xl p-4 h-[280px] overflow-y-auto font-mono text-[11px] leading-relaxed flex flex-col gap-3 text-text-primary">
              {logs.length === 0 ? (
                <div className="text-text-secondary italic h-full flex items-center justify-center">
                  Console idle. Press "Simulate Agent Request" below to begin...
                </div>
              ) : (
                logs.map((log, index) => (
                  <div
                    key={index}
                    className={`border-l-2 pl-3 py-0.5 rounded-r ${
                      log.type === "request"
                        ? "border-sky-500 text-sky-800 bg-sky-50/50"
                        : log.type === "response"
                        ? "border-amber-500 text-amber-800 bg-amber-50/50"
                        : log.type === "success"
                        ? "border-emerald-500 text-emerald-800 bg-emerald-50/50"
                        : log.type === "error"
                        ? "border-rose-500 text-rose-800 bg-rose-50/50"
                        : "border-divider text-text-secondary bg-surface-card/50"
                    }`}
                  >
                    <span className="text-[10px] text-text-secondary mr-2 font-semibold">[{log.timestamp}]</span>
                    <span className="font-bold block mb-0.5 text-[10px]">
                      {log.type === "request" && "➡️ REQUEST SENT"}
                      {log.type === "response" && "⬅️ RESPONSE RECEIVED"}
                      {log.type === "success" && "✅ SUCCESS"}
                      {log.type === "error" && "❌ ERROR"}
                      {log.type === "info" && "ℹ️ INFO"}
                    </span>
                    <pre className="whitespace-pre-wrap font-mono mt-1 text-[10px] bg-white/60 p-2 rounded border border-divider">
                      {log.message}
                    </pre>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Result view */}
          <div className="lg:col-span-5 flex flex-col gap-3 justify-between">
            <div className="bg-surface-card border border-divider rounded-2xl p-5 flex-1 flex flex-col justify-center shadow-sm">
              <span className="text-[10px] font-bold text-text-secondary uppercase tracking-widest block mb-2">
                Delivered Resource Content
              </span>
              
              {premiumData ? (
                <div className="space-y-3 animate-fade-in">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
                      {premiumData.adviceType}
                    </span>
                  </div>
                  <p className="text-xs text-text-primary italic leading-relaxed font-medium">
                    "{premiumData.insight}"
                  </p>
                  <div className="pt-2 border-t border-divider flex items-center justify-between text-[10px] text-text-secondary font-mono">
                    <span>ACTION: {premiumData.agentAction}</span>
                    <span>{new Date(premiumData.generatedAt).toLocaleTimeString()}</span>
                  </div>
                </div>
              ) : (
                <div className="text-center py-8 text-text-secondary text-xs">
                  <svg className="h-8 w-8 mx-auto text-text-secondary mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Locked. Waiting for payment verification.
                </div>
              )}
            </div>

            <button
              onClick={handleSimulateX402}
              disabled={isRunning}
              className={`w-full py-3.5 px-5 rounded-2xl font-bold text-xs transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                isRunning
                  ? "bg-surface-card text-text-secondary border border-divider cursor-not-allowed"
                  : "bg-gradient-to-r from-brand-start to-brand-end text-white shadow-brand-end/10 hover:shadow-brand-end/20 hover:opacity-90"
              }`}
            >
              {isRunning ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Processing Agent Payment...
                </>
              ) : (
                <>
                  <svg className="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Simulate Agent Request ($0.50 USDC)
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
