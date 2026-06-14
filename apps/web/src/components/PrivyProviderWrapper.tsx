"use client";

import React from "react";
import { PrivyProvider } from "@privy-io/react-auth";
import { SmartWalletsProvider } from "@privy-io/react-auth/smart-wallets";

export function PrivyProviderWrapper({ children }: { children: React.ReactNode }) {
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID || "your-privy-app-id";

  return (
    <PrivyProvider
      appId={appId}
      config={{
        loginMethods: ["email", "wallet", "google", "apple"],
        appearance: {
          theme: "light",
          accentColor: "#000000",
          logo: "https://seafi.app/logo.png",
        },
        embeddedWallets: {
          ethereum: {
            createOnLogin: "users-without-wallets",
          }
        },
      }}
    >
      <SmartWalletsProvider>
        {children}
      </SmartWalletsProvider>
    </PrivyProvider>
  );
}
