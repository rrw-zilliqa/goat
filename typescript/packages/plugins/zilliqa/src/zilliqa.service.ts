import { Tool } from "@goat-sdk/core";
import { EVMWalletClient } from "@goat-sdk/wallet-evm";
import { ZilliqaPluginParams } from "./types";
import { SayHelloParameters, AddressParameters, TransferParameters } from "./parameters";
import { Zilliqa } from "@zilliqa-js/zilliqa";
import { ZilliqaWalletClient } from "@goat-sdk/wallet-zilliqa";
import { toBech32Address, fromBech32Address, toChecksumAddress } from "@zilliqa-js/crypto";
import { BN, Long, units as ZilliqaUnits, validation as ZilliqaValidation } from "@zilliqa-js/util";
import * as viem from "viem";


export class ZilliqaService {

  constructor(params: ZilliqaPluginParams) {
  }

  @Tool({
    description: "Converts addresses from hex to bech32 format"
  })
  async convertToBech32(zilliqa: ZilliqaWalletClient, address: AddressParameters) : Promise<string> {
    console.log("FISH");
    return toBech32Address(address.address);
  }

  @Tool({
    description: "Converts addresses from bech32 to hex format"
  })
  async convertFromBech32(zilliqa: ZilliqaWalletClient, address: AddressParameters) : Promise<string> {
    console.log("SOUP");
    return fromBech32Address(address.address);
  }

  @Tool({
    description: "Transfers ZIL from an EVM address to another EVM or Zilliqa address, in either hex or bech32 format. Never use any other transfer functions when transferring funds from an EVM address"
  })
  async transferFromEvmAddress(zilliqa: ZilliqaWalletClient, transferParameters: TransferParameters): Promise<string> {
    try {
      let hexToAddress = ZilliqaValidation.isBech32(transferParameters.toAddress) ?
        fromBech32Address(transferParameters.toAddress) : transferParameters.toAddress;
      let summed = viem.getAddress(hexToAddress);
      const amount = viem.parseEther(transferParameters.amount);
      const tx = await zilliqa.viem.sendTransaction({
        to: summed,
        value: amount });
      return tx.hash;
    } catch (error) {
      throw new Error(`Failed to send ZIL: ${error}`);
    }
  }

  @Tool({
    description: "Transfers ZIL from a Zilliqa address to another EVM or Zilliqa address, in either hex or bech32 format. Never use any other transfer function when transferring fgunds from a Zilliqa address"
  })
  async transferFromZilliqaAddress(zilliqa: ZilliqaWalletClient, transferParameters: TransferParameters): Promise<any> {
    console.log(`### TRANSFER INIT 001`);

    // Make sure the toaddress is formatted correctly.
    let hexToAddress = ZilliqaValidation.isBech32(transferParameters.toAddress) ?
      fromBech32Address(transferParameters.toAddress) : transferParameters.toAddress;
    let summed = toChecksumAddress(hexToAddress);
    let api = zilliqa.getZilliqa();
    let chainId = zilliqa.getZilliqaChainId();
    let version = (chainId << 16) | 1;
    console.log(`### ChainId ${chainId} version ${version}`);
    try {
      const tx = await api.blockchain.createTransaction(
        api.transactions.new({
          toAddr: summed,
          amount: ZilliqaUnits.toQa(transferParameters.amount, ZilliqaUnits.Units.Zil),
          gasPrice: new BN("2000000000"),
          gasLimit: new Long(50),
          version:  version,
        }));
      console.log(`### result ${JSON.stringify(tx)}`);
      return {
        "transactionId": tx.id,
        "receipt": tx.getReceipt(),
        "succeeded" : tx.isConfirmed(),
        "rejected": tx.isRejected()
      }
    } catch (e) {
      console.log(`!!!! exception - ${JSON.stringify(e)}`);
      var ox = (e as Object);
      for (let [key,value] of Object.entries(ox)) {
        console.log(" --- " + key + ":" + value);
      }
      console.log("****");
      throw e;
    }
  }

  // @Tool({
  //   description: "Returns the Zilliqa address of this wallet, in bech32 encoding" })
  // async getZilliqaAddress(zilliqa: Zilliqa, empty: EmptyParameters) : Promise<string | undefined> {
  //   const defaultAddress = zilliqa.wallet.defaultAccount?.address;
  //   console.log(`defaultAddress = ${defaultAddress}`);
  //   return defaultAddress;
  // }

  @Tool({
    description: "Returns the balance of an account address, in ZIL. This works with both EVM and Zilliqa addresses and with both hex and bech32 encodings." })
  async getBalance(zilliqa: ZilliqaWalletClient, address: AddressParameters) : Promise<any> {
    let result = await zilliqa.getZilliqa().blockchain.getBalance(address.address);
    console.log(`Balance response - ${JSON.stringify(result)}`);
    return result;
  }
}

