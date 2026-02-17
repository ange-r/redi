import { CrossmintWallets, createCrossmint, StellarWallet } from "@crossmint/wallets-sdk";
import { getServerEnv } from "@redi/config";

export type SupportedChain = "stellar-testnet" | "stellar";

export interface WalletSummary {
  address: string;
  chain: string;
  type: string;
}

export interface WalletBalance {
  address: string;
  chain: string;
  type: string;
  nativeToken: {
    amount: string;
    rawAmount: string;
  };
  customTokens: unknown[];
}

function getClient() {
  const env = getServerEnv();
  const crossmint = createCrossmint({ apiKey: env.CROSSMINT_API_KEY });
  return CrossmintWallets.from(crossmint);
}

function toSdkChain(_chain: SupportedChain): "stellar" {
  // wallets-sdk@0.19 only exposes "stellar" as chain identifier.
  return "stellar";
}

export async function getOrCreateWalletByEmail(
  email: string,
  chain: SupportedChain = "stellar-testnet",
): Promise<WalletSummary> {
  const client = getClient();
  const wallet = await client.getOrCreateWallet({
    chain: toSdkChain(chain),
    signer: { type: "email", email },
  });

  return {
    address: wallet.address,
    chain,
    type: "smart-wallet",
  };
}

export async function getWalletBalanceByEmail(
  email: string,
  chain: SupportedChain = "stellar-testnet",
): Promise<WalletBalance> {
  const client = getClient();
  const wallet = await client.getOrCreateWallet({
    chain: toSdkChain(chain),
    signer: { type: "email", email },
  });

  const balances = await wallet.balances();

  return {
    address: wallet.address,
    chain,
    type: "smart-wallet",
    nativeToken: {
      amount: balances.nativeToken?.amount ?? "0",
      rawAmount: balances.nativeToken?.rawAmount ?? "0",
    },
    customTokens: balances.tokens ?? [],
  };
}

  export async function createBridgePlan(
  email: string,
  params: {
    merchantAddress: string;
    totalAmount: string;
    installmentsCount: number;
    dueDates: number[];
  },
  chain: SupportedChain = "stellar-testnet",
): Promise<{ hash: string; explorerLink: string }> {
  const env = getServerEnv();
  const client = getClient();
  const wallet = await client.getOrCreateWallet({
    chain: toSdkChain(chain),
    signer: { type: "email", email },
  });
  const stellarWallet = StellarWallet.from(wallet);
  return stellarWallet.sendTransaction({
    contractId: env.SOROBAN_BRIDGE_CONTRACT_ID,
    method: "create_plan",
    args: {
      user: wallet.address,
      merchant: params.merchantAddress,
      total_amount: params.totalAmount,
      installments_count: params.installmentsCount,
      due_dates: params.dueDates,
    },
  });
}

export async function collectInstallment(
  email: string,
  params: {
    planId: string;
    installmentNumber: number;
    merchantAddress: string;
  },
  chain: SupportedChain = "stellar-testnet",
): Promise<{ hash: string; explorerLink: string }> {
  const env = getServerEnv();
  const client = getClient();
  const wallet = await client.getOrCreateWallet({
    chain: toSdkChain(chain),
    signer: { type: "email", email },
  });
  const stellarWallet = StellarWallet.from(wallet);
  return stellarWallet.sendTransaction({
    contractId: env.SOROBAN_BRIDGE_CONTRACT_ID,
    method: "collect_installment",
    args: {
      plan_id: params.planId,
      installment_number: params.installmentNumber,
      buffer_contract: env.SOROBAN_BUFFER_CONTRACT_ID,
      merchant_address: params.merchantAddress,
    },
  });
}

