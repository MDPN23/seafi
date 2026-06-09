import { createConfig, AlchemyAccountsUIConfig } from "@account-kit/react";
import { arbitrumSepolia, alchemy } from "@account-kit/infra";

const apiKey = process.env.NEXT_PUBLIC_ALCHEMY_API_KEY || "";
const policyId = process.env.NEXT_PUBLIC_ALCHEMY_GAS_MANAGER_POLICY_ID || "";

const uiConfig: AlchemyAccountsUIConfig = {
  illustrationStyle: "linear",
  auth: {
    sections: [
      [{ type: "email" }],
      [{ type: "passkey" }],
      [{ type: "external_wallets" }]
    ],
    addPasskeyOnSignup: true,
  },
};

export const config = createConfig(
  {
    transport: alchemy({ apiKey }),
    chain: arbitrumSepolia,
    ssr: true,
    ...(policyId ? {
      gasManagerConfig: {
        policyId,
      }
    } : {}),
  },
  uiConfig
);
