// import { type EVMReadRequest, type EVMTransaction, type EVMTypedData, EVMWalletClient } from "@goat-sdk/wallet-evm";
import { Chain, WalletClientBase, Signature, Balance  } from "@goat-sdk/core";
import { ViemEVMWalletClient } from "@goat-sdk/wallet-viem";
import { type WalletClient as ViemWalletClient } from "viem";
import { Account, Wallet } from "@zilliqa-js/account";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { ViemOptions } from "@goat-sdk/wallet-viem";

// We need to encapsulate ViemEVMWalletClient so that we can report our chain type correctly.
export class ZilliqaWalletClient extends WalletClientBase {
  zilliqa: Zilliqa;
  viem: ViemEVMWalletClient;
  chainId: number = 0;

  constructor(client: ViemWalletClient, node: string, account: Account, chainId: number, options?: ViemOptions) {
    super();
    this.viem = new ViemEVMWalletClient(client, options);
    this.zilliqa = new Zilliqa(node);
    this.zilliqa.wallet.addByPrivateKey(account.privateKey);
    this.chainId = chainId;
    console.log(`Zilliqa wallet connected to chain id {chainId}`);
  }

  getZilliqaChainId(): number {
    return this.chainId;
  }

  getAddress(): string {
    // This is a vexed issue in Zilliqa! we'll give the EVM address, as it's
    // more canonical
    return this.viem.getAddress()
  }

  // We have to return "evm" here because that is what getChain()
  // requires and it is necessary to enable plugins that expect us
  // to be evm.
  override getChain() : Chain {
    return {
      type: "zilliqa" as const,
      id: this.chainId,
      evmId: (this.chainId | 0x8000)
    }
  }

  signMessage(message: string): Promise<Signature> {
    return this.viem.signMessage(message);
  }

  balanceOf(address: string): Promise<Balance> {
    return this.viem.balanceOf(address);
  }

  getZilliqa(): Zilliqa {
    return this.zilliqa;
  }

  getViemClient(): ViemEVMWalletClient {
    return this.viem;
  }
}


export async function zilliqaChainId(node: string) {
  const tempZil = new Zilliqa(node);
  return parseInt((await tempZil.network.GetNetworkId())?.result);
}

export function zilliqaWallet(client: ViemWalletClient, node: string, account: Account, chainId: number, options?: ViemOptions) {
  return new ZilliqaWalletClient(client, node, account, chainId, options);
}
