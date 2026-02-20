import { 
  Contract,
  rpc,
  TransactionBuilder,
  Networks,
  BASE_FEE,
  xdr,
} from '@stellar/stellar-sdk';
// Network configuration
const NETWORKS = {
testnet: {
rpc: 'https://soroban-testnet.stellar.org',
passphrase: Networks.TESTNET,
  },
mainnet: {
rpc: 'https://soroban-mainnet.stellar.org', 
passphrase: Networks.PUBLIC,
  },
} as const;
type NetworkType = keyof typeof NETWORKS;
// Types matching Buffer Contract
export interface BufferBalance {
available_shares: bigint;
protected_shares: bigint;
total_deposited: bigint;
last_deposit_ts: bigint;
version: bigint;
}
export interface BufferValues {
available: number;    
protected: number;    
total: number;       
}
export class BufferClient {
private contract: Contract;
private server: rpc.Server;
private network: NetworkType;
constructor(contractId: string, network: NetworkType = 'testnet') {
this.network = network;
this.server = new rpc.Server(NETWORKS[network].rpc);
this.contract = new Contract(contractId);
  }
/**
   * Get balance in shares from Buffer Contract
   */
async getBalance(userAddress: string): Promise<BufferBalance> {
const result = await this.simulateCall('get_balance', [
xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(
xdr.PublicKey.publicKeyTypeEd25519(Buffer.from(userAddress, 'hex'))
      ))
    ]);
return this.parseBalanceResult(result);
  }
/**
   * Get values in tokens (frontend use this for display, conerts from sares to token amounts)
   */
async getValues(userAddress: string): Promise<BufferValues> {
const result = await this.simulateCall('get_values', [
xdr.ScVal.scvAddress(xdr.ScAddress.scAddressTypeAccount(
xdr.PublicKey.publicKeyTypeEd25519(Buffer.from(userAddress, 'hex'))
      ))
    ]);
// get_values returns (available, protected, total) as tuple
const values = this.parseTupleResult(result);
return {
available: Number(values[0]) / 1e7,  // convert from stroops
protected: Number(values[1]) / 1e7,
total: Number(values[2]) / 1e7,
    };
  }
/**
   * Simulate a contract call (read-only, no transaction)
   */
private async simulateCall(method: string, args: xdr.ScVal[]): Promise<xdr.ScVal> {
const account = await this.server.getAccount(
'GAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWHF' // dummy account for simulation
    );
const tx = new TransactionBuilder(account, {
fee: BASE_FEE,
networkPassphrase: NETWORKS[this.network].passphrase,
    })
      .addOperation(this.contract.call(method, ...args))
      .setTimeout(30)
      .build();
const simulation = await this.server.simulateTransaction(tx);
if (rpc.Api.isSimulationSuccess(simulation)) {
return simulation.result!.retval;
    }
throw new Error(`Simulation failed: ${JSON.stringify(simulation)}`);
  }
/**
   * Parse BufferBalance result
   */
private parseBalanceResult(result: xdr.ScVal): BufferBalance {
const struct = result.value() as any;
return {
available_shares: BigInt(struct.available_shares.toString()),
protected_shares: BigInt(struct.protected_shares.toString()),
total_deposited: BigInt(struct.total_deposited.toString()),
last_deposit_ts: BigInt(struct.last_deposit_ts.toString()),
version: BigInt(struct.version.toString()),
    };
  }
/**
   * Parse tuple result (for get_values)
   */
private parseTupleResult(result: xdr.ScVal): bigint[] {
const vec = result.vec();
if (!vec) throw new Error('Expected vector result');
return vec.map(v => BigInt(v.i128().toString()));
  }
}
// Helper function to create client from env vars
export function createBufferClient(): BufferClient {
const contractId = process.env.SOROBAN_BUFFER_CONTRACT_ID;
const network = process.env.STELLAR_NETWORK === 'mainnet' ? 'mainnet' : 'testnet';
if (!contractId) {
throw new Error('SOROBAN_BUFFER_CONTRACT_ID not configured');
  }
return new BufferClient(contractId, network);
}