import { createBridgePlan } from "@redi/crossmint";
import { getServerEnv } from "@redi/config";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, merchantAddress, totalAmount, installmentsCount, dueDates } = body;

    if (!email || !merchantAddress || !totalAmount || !installmentsCount || !dueDates) {
      return NextResponse.json(
        { error: "Completar todos los campos requeridos." },
        { status: 400 }
      );
    }

    if (installmentsCount < 1 || installmentsCount > 12) {
      return NextResponse.json(
        { error: "Installments must be between 1 and 12" },
        { status: 400 }
      );
    }

    const env = getServerEnv();
    const result = await createBridgePlan(
      email,
      {
        merchantAddress,
        totalAmount: totalAmount.toString(),
        installmentsCount,
        dueDates,
      },
      env.STELLAR_NETWORK === "mainnet" ? "stellar" : "stellar-testnet"
    );

    return NextResponse.json({
      success: true,
      hash: result.hash,
      explorerLink: result.explorerLink,
    });

  } catch (error) {
    console.error("[/api/plans] error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}