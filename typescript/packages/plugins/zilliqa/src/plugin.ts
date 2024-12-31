import { type Chain, PluginBase } from "@goat-sdk/core";
import type { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ZilliqaService } from "./zilliqa.service";
import { ZilliqaPluginParams } from "./types";


export class ZilliqaPlugin extends PluginBase<EVMWalletClient> {
  constructor(params: ZilliqaPluginParams) {
    super("zilliqa", [new ZilliqaService(params)]);
    console.log("**** *CONSTRUCTING");
  }

  // @todo Make this Zilliqa only
  supportsChain = (chain: Chain) => chain.type == "evm";
}

export function zilliqa(params: ZilliqaPluginParams) {
  return new ZilliqaPlugin(params)
}
