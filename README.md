# 🌊 SEAFI (Send Everywhere Anywhere Finance)

**Arbitrum Open House London — Buildathon Submission**

SEAFI is a Web3 invoicing and cross-border payment gateway designed to eliminate friction for global freelancers and remote workers. By leveraging Arbitrum Stylus (Rust), SEAFI allows clients to pay invoices using familiar Web2 methods (Credit Cards/Fiat), settles them instantly on-chain via USDC, and enables workers to cash out directly to their local bank accounts within minutes.

---

## 🏆 Hackathon Judging Criteria Focus

### 1. 🌍 Product-Market Fit (Our Core Demo)
* **The Problem:** Freelancers in emerging markets (Southeast Asia, South Asia) wait 3-5 days for SWIFT invoice payments and lose up to 5-7% in forex and intermediary fees.
* **The SEAFI Solution (Borderless Invoicing):** 
  * Freelancers generate a USDC invoice link.
  * Clients pay using standard Web2 methods (e.g., Credit Card via Stripe On-ramp).
  * Funds are transported instantly via Arbitrum and arrive in the freelancer's Smart Wallet.
* **Instant Local Payouts (Off-ramp):** Through our integrated Bridge rails, users can instantly cash out their USDC balance directly to local bank accounts (e.g., IDR via BI-FAST, PHP via InstaPay) with a flat fee and mid-market rates.

### 2. 🛡️ Smart Contract Quality & Architecture
* **Powered by Arbitrum Stylus (Rust):** Our core engine (`packages/contracts`) is written in Rust compiled to WASM. This achieves up to a **98% gas reduction** compared to standard EVM execution.
* **Security & Best Practices:** 
  * Integration with **Privy** for seamless social/email logins, paired with **Alchemy's ERC-4337 Smart Wallets**, eliminates seed-phrase vulnerabilities and allows for sponsored, gasless transactions.
  * Rust's strict compiler guarantees memory safety for all on-chain transactions.

### 3. 💡 Innovation: Beyond the MVP (Roadmap & Vision)
While our hackathon MVP focuses on solving the immediate pain point of cross-border invoicing, our underlying smart contract infrastructure is designed for much more:
* **Real-Time Payroll Streaming:** Converting monthly salaries into per-second streams, allowing for "Earned Wage Access" where employees withdraw wages as they earn them.
* **Dynamic Yield Orchestration:** Automatically staking idle USDC into Aave V3 to generate yield for employers while funds await withdrawal.
* **X402 Machine Economy Protocol:** Enabling AI-to-AI transactions where AI agents pay for API access on-demand via micro-transactions, bypassing rigid Web2 subscriptions.

---

## 🛠️ Tech Stack

- **Smart Contracts:** Arbitrum Stylus (Rust), Arbitrum Sepolia/One
- **Frontend:** Next.js 16 (App Router), Tailwind CSS
- **Authentication & Smart Wallets:** Privy + Alchemy (ERC-4337 Account Abstraction)
- **Yield Strategy:** Aave V3 
- **Fiat Gateways:** Stripe Onramp, Bridge Offramp

## 🚀 Running the Project Locally

### 1. Environment & Configuration
To run the frontend, you'll need to set up your environment variables.
```bash
cp .env.example apps/web/.env.local
```

**Privy & Alchemy Smart Wallet Setup:**
1. Go to your [Privy Dashboard](https://dashboard.privy.io/) and grab your **App ID**. Set it in `apps/web/.env.local` as `NEXT_PUBLIC_PRIVY_APP_ID`.
2. In the Privy Dashboard, navigate to **Wallet Configuration > Smart Wallets**.
3. Enable **Smart Wallets** and select **Alchemy** as the provider.
4. **(Optional but Recommended)** To enable gasless transactions for users, enter your **Alchemy API Key** and **Alchemy Gas Manager Policy ID** in the Privy dashboard.

### 2. Web Application (Next.js)
```bash
cd apps/web
bun install
bun run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 2. Smart Contracts (Arbitrum Stylus)
```bash
cd packages/contracts
cargo stylus check
```

## 📜 License
MIT
