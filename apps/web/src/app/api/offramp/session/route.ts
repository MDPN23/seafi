import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { amount, bankName, accountName, accountNumber, walletAddress, targetCurrency = "IDR" } = body;

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      return NextResponse.json(
        { error: "Invalid amount. Must be greater than 0." },
        { status: 400 }
      );
    }

    if (!bankName || !accountName || !accountNumber) {
      return NextResponse.json(
        { error: "Missing bank account details." },
        { status: 400 }
      );
    }

    const usdcAmount = parseFloat(amount);
    
    // Currency Configurations
    const currencyConfigs: Record<string, { rate: number; symbol: string; flatFee: number; label: string }> = {
      IDR: { rate: 15250, symbol: "Rp", flatFee: 5000, label: "BI-FAST Bank Transfer" },
      PHP: { rate: 56.40, symbol: "₱", flatFee: 50, label: "InstaPay Transfer" },
      INR: { rate: 83.20, symbol: "₹", flatFee: 100, label: "IMPS Payout" },
      SGD: { rate: 1.34, symbol: "S$", flatFee: 2, label: "FAST Transfer" },
      VND: { rate: 24500, symbol: "₫", flatFee: 20000, label: "NAPAS Transfer" },
    };

    const config = currencyConfigs[targetCurrency] || currencyConfigs.IDR;
    
    const grossFiat = usdcAmount * config.rate;
    const platformFeeFiat = grossFiat * 0.005; // 0.5% gateway fee
    const bankFeeFiat = config.flatFee;
    const totalFeeFiat = platformFeeFiat + bankFeeFiat;
    const netReceiveFiat = grossFiat - totalFeeFiat;

    const payoutId = `po_${Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join("")}`;
    
    return NextResponse.json({
      success: true,
      payoutId,
      provider: "Bridge Payouts",
      sourceWallet: walletAddress,
      depositTargetAddress: "0x34293D6d017aBc646097150C361D4C617066C0bE",
      targetCurrency,
      quote: {
        usdcAmount: usdcAmount.toFixed(2),
        exchangeRate: config.rate.toString(),
        grossFiat: grossFiat.toFixed(0),
        currencySymbol: config.symbol,
        payoutMethodLabel: config.label,
        fees: {
          platformFeeFiat: platformFeeFiat.toFixed(0),
          bankFeeFiat: bankFeeFiat.toFixed(0),
          totalFeeFiat: totalFeeFiat.toFixed(0),
        },
        netReceiveFiat: netReceiveFiat.toFixed(0),
      },
      bankDetails: {
        bankName,
        accountName,
        accountNumber: accountNumber.replace(/.(?=.{4})/g, "*"),
      },
      status: "quote_generated",
    });

  } catch (error: any) {
    console.error("Error creating offramp quote:", error);
    return NextResponse.json(
      { error: "Failed to generate offramp quote" },
      { status: 500 }
    );
  }
}
