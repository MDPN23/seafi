import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, walletAddress } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be greater than 0." },
        { status: 400 }
      );
    }

    if (!walletAddress || !/^0x[a-fA-F0-9]{40}$/.test(walletAddress)) {
      return NextResponse.json(
        { error: "Invalid wallet address." },
        { status: 400 }
      );
    }

    // Stripe Onramp Session Creation Mock for Demo
    const usdAmount = parseFloat(amount);
    const fee = usdAmount * 0.015 + 0.30; // 1.5% + $0.30 Stripe Fee
    const receiveAmount = usdAmount - fee;
    const sessionId = `cos_${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;

    return NextResponse.json({
      success: true,
      sessionId,
      clientSecret: `${sessionId}_secret_${Array.from({ length: 16 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`,
      provider: "Stripe Onramp",
      destinationWallet: walletAddress,
      pricing: {
        usdAmount: usdAmount.toFixed(2),
        networkFee: "0.05",
        stripeFee: fee.toFixed(2),
        receiveAmount: receiveAmount.toFixed(2),
        receiveCurrency: "USDC",
        network: "Arbitrum Sepolia",
      },
      status: "initialized",
    });

  } catch (error: any) {
    console.error("Error creating onramp session:", error);
    return NextResponse.json(
      { error: "Failed to generate onramp session" },
      { status: 500 }
    );
  }
}
