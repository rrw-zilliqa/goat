import { type Chain, PluginBase } from "@goat-sdk/core";
import type { ZilliqaWalletClient } from "@goat-sdk/wallet-zilliqa";
import { ZilliqaService } from "./zilliqa.service";
import { ZilliqaPluginParams } from "./types";


export class ZilliqaPlugin extends PluginBase<ZilliqaWalletClient> {
  constructor(params: ZilliqaPluginParams) {
    super("zilliqa", [new ZilliqaService(params)]);
  }

  supportsChain = (chain: Chain) => chain.type == "zilliqa";
}

export function zilliqa(params: ZilliqaPluginParams) {
  return new ZilliqaPlugin(params)
}
