"use client";

import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-divider bg-surface-card/40 mt-auto py-12">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center">
              <span className="font-bold text-white text-md tracking-tighter">S</span>
            </div>
            <span className="text-md font-extrabold tracking-tight bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
              SEAFI
            </span>
          </div>
          <p className="text-xs text-text-secondary leading-relaxed">
            The next-generation Web3 payment rails for Southeast Asia. Automating cross-border payroll, real-time salary streaming, and Aave yield generation directly from smart contracts.
          </p>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">Services</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link href="/service/sendmoney" className="hover:text-brand-end transition-colors">
                Send Money
              </Link>
            </li>
            <li>
              <Link href="/service/receive" className="hover:text-brand-end transition-colors">
                Request Money
              </Link>
            </li>
            <li>
              <Link href="/service/payroll" className="hover:text-brand-end transition-colors">
                Real-time Payroll
              </Link>
            </li>
            <li>
              <Link href="/service/make-invoice" className="hover:text-brand-end transition-colors">
                Invoicing
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">Protocol</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>Arbitrum Sepolia Devnet</li>
            <li>Aave V3 High-Yield Staking</li>
            <li>X402 Payment Standard</li>
            <li>ERC-4337 Smart Accounts</li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-text-primary mb-4">Platform</h4>
          <ul className="space-y-2 text-xs text-text-secondary">
            <li>
              <Link href="/auth" className="hover:text-brand-end transition-colors">
                Sign In
              </Link>
            </li>
            <li>
              <Link href="/" className="hover:text-brand-end transition-colors">
                Landing Page
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 border-t border-divider mt-8 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-text-secondary">
        <span>&copy; {new Date().getFullYear()} SEAFI Protocol. All rights reserved.</span>
        <div className="flex gap-4 mt-4 md:mt-0">
          <span className="hover:text-text-primary cursor-pointer transition-colors">Terms</span>
          <span className="hover:text-text-primary cursor-pointer transition-colors">Privacy</span>
        </div>
      </div>
    </footer>
  );
}
