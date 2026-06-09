"use client";

import React, { useState } from "react";
import { AlchemyAccountProvider } from "@account-kit/react";
import { QueryClient } from "@tanstack/react-query";
import { config } from "@/config/account-kit";

export function AccountKitProvider({ children }: { children: React.ReactNode }) {
  // Ensure QueryClient is instantiated only on the client and is stable across renders
  const [queryClient] = useState(() => new QueryClient());

  return (
    <AlchemyAccountProvider config={config} queryClient={queryClient}>
      {children}
    </AlchemyAccountProvider>
  );
}
