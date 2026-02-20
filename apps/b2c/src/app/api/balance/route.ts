import { getOrCreateWalletByEmail } from "@redi/crossmint";
import { getServerEnv } from "@redi/config";
import { createBufferClient } from "@redi/stellar-soroban";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const email = searchParams.get("email");

    if (!email) {
      return NextResponse.json(
        { error: "Se requiere un email." },
        { status: 400 }
      );
    }

    const env = getServerEnv();
    const wallet = await getOrCreateWalletByEmail(
      email,
      env.STELLAR_NETWORK === "mainnet" ? "stellar" : "stellar-testnet"
    );

    // Get balance from Buffer Contract
    const bufferClient = createBufferClient();
    const values = await bufferClient.getValues(wallet.address);

    return NextResponse.json({
      address: wallet.address,
      chain: wallet.chain,
      balance: {
        available: values.available,
        protected: values.protected,
        total: values.total,
      }
    });
  } catch (error) {
    console.error("[/api/balance] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}