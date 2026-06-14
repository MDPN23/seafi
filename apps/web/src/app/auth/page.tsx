"use client";

import React, { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import { useRouter } from "next/navigation";

export default function AuthPage() {
  const { ready, authenticated, user, login } = usePrivy();
  const router = useRouter();

  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // If user is already connected via Privy, offer to redirect to payroll service
  if (ready && authenticated && user) {
    router.push("/service/payroll");
  }

  const handleTraditionalAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      setMessage("Please fill out all fields.");
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    // Simulate database delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    setIsSubmitting(false);
    setMessage(
      mode === "login"
        ? "Successfully logged in! Redirecting..."
        : "Account created successfully! Redirecting..."
    );

    setTimeout(() => {
      router.push("/service/payroll");
    }, 1000);
  };

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-6 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] bg-brand-start/15 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-white border border-divider rounded-[32px] p-8 shadow-xl relative z-10 card-shadow">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-2xl font-extrabold text-text-primary">
            {mode === "login" ? "Welcome Back" : "Create Account"}
          </h1>
          <p className="text-xs text-text-secondary">
            Access your secure auto-yielding smart wallet dashboard.
          </p>
        </div>

        {/* Web3 Button */}
        <button
          onClick={login}
          className="w-full py-3 px-4 mb-6 rounded-xl bg-gradient-to-r from-brand-start to-brand-end hover:opacity-95 text-white font-bold text-sm shadow-md shadow-brand-end/10 flex items-center justify-center gap-2 cursor-pointer transition-all"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          Connect Web3 Smart Wallet
        </button>

        <div className="relative flex py-2 items-center mb-6">
          <div className="flex-grow border-t border-divider"></div>
          <span className="flex-shrink mx-4 text-[10px] text-text-secondary uppercase font-bold tracking-wider">Or continue with</span>
          <div className="flex-grow border-t border-divider"></div>
        </div>

        {/* Credentials Form */}
        <form onSubmit={handleTraditionalAuth} className="space-y-4">
          {mode === "signup" && (
            <div>
              <label className="text-xs text-text-secondary block font-semibold mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-text-secondary block font-semibold mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@company.com"
              className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
            />
          </div>

          <div>
            <label className="text-xs text-text-secondary block font-semibold mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-surface-card border border-divider rounded-xl py-3 px-4 text-text-primary text-sm focus:outline-none focus:border-brand-end"
            />
          </div>

          {message && (
            <div className={`p-3 rounded-xl text-xs font-semibold text-center ${
              message.includes("Success") ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-rose-50 text-rose-600 border border-rose-100"
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 px-4 rounded-xl bg-surface-card border border-divider hover:bg-divider text-text-primary font-bold text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 text-text-secondary" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Processing...
              </>
            ) : mode === "login" ? (
              "Sign In"
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="text-center mt-6">
          <button
            onClick={() => setMode(mode === "login" ? "signup" : "login")}
            className="text-xs font-bold text-brand-end hover:underline cursor-pointer"
          >
            {mode === "login"
              ? "Don't have an account? Sign Up"
              : "Already have an account? Sign In"}
          </button>
        </div>
      </div>
    </div>
  );
}
