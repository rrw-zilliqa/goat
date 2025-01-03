import { type Chain, PluginBase } from "@goat-sdk/core";
import type { ZilliqaWalletClient } from "@goat-sdk/wallet-zilliqa";
import { ZilliqaPluginParams } from "./types";
import { ZilliqaService } from "./zilliqa.service";

export class ZilliqaPlugin extends PluginBase<ZilliqaWalletClient> {
    constructor(params: ZilliqaPluginParams) {
        super("zilliqa", [new ZilliqaService()]);
    }

    supportsChain = (chain: Chain) => chain.type === "zilliqa";
}

export function zilliqa(params: ZilliqaPluginParams) {
    return new ZilliqaPlugin(params);
}
