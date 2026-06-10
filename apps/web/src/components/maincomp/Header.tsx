"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useUser, useAuthModal, useLogout } from "@account-kit/react";

export function Header() {
  const user = useUser();
  const { openAuthModal } = useAuthModal();
  const { logout } = useLogout();
  const pathname = usePathname();

  const truncateAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Send Money", path: "/service/sendmoney" },
    { name: "Receive", path: "/service/receive" },
    { name: "Payroll", path: "/service/payroll" },
    { name: "Invoices", path: "/service/make-invoice" },
  ];

  return (
    <header className="border-b border-divider bg-white/70 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 cursor-pointer">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-start to-brand-end flex items-center justify-center shadow-lg shadow-brand-end/20">
            <span className="font-bold text-white text-xl tracking-tighter">S</span>
          </div>
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-brand-start to-brand-end bg-clip-text text-transparent">
            SEAFI
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          {navLinks.map((link) => {
            const isActive = pathname === link.path;
            return (
              <Link
                key={link.path}
                href={link.path}
                className={`text-sm font-semibold transition-all ${
                  isActive
                    ? "text-brand-end font-bold"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-3 bg-surface-card border border-divider rounded-full py-1.5 pl-4 pr-1.5">
              <span className="text-xs font-semibold text-text-secondary font-mono">
                {user.address ? truncateAddress(user.address) : "Connected"}
              </span>
              <button
                onClick={() => logout()}
                className="bg-white border border-divider hover:bg-surface-card text-text-secondary hover:text-text-primary px-4 py-1.5 rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Disconnect
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                href="/auth"
                className="text-xs font-semibold text-text-secondary hover:text-text-primary px-4 py-2 rounded-full border border-transparent transition-all"
              >
                Login
              </Link>
              <button
                onClick={openAuthModal}
                className="relative group overflow-hidden px-5 py-2 rounded-full bg-gradient-to-r from-brand-start to-brand-end font-semibold text-white text-xs shadow-lg shadow-brand-end/20 hover:shadow-brand-end/30 transition-all duration-300 hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <span className="relative z-10">Connect Smart Wallet</span>
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity" />
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
