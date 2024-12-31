import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ZilliqaPluginParams } from "./types";
import { SayHelloParameters } from "./parameters";

export class ZilliqaService {
  constructor(params: ZilliqaPluginParams) { }

  @Tool({
    description: "Says hello from Zilliqa"
  })
  async sayHello(walletClient: EVMWalletClient, parameters: SayHelloParameters) {
    return "Hello there " + parameters.greeting;
  }
}

