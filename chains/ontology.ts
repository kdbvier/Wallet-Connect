import axios from "axios";
import Web3 from "web3";
import {
  RestClient,
  CONST,
  Crypto,
  OntAssetTxBuilder,
  TransactionBuilder,
} from "ontology-ts-sdk";
// import { Address } from "ontology-ts-sdk/lib/types/crypto";
import CoinInterface from "../CoinInterface";

const rest = new RestClient(CONST.MAIN_ONT_URL.REST_URL);

/**
 * Make network URL for the provided network
 * @param network
 * @returns
 */

/**
 * XRP Logic config interface
 */
const { Address, PrivateKey } = Crypto;
interface OntologyLogicConfig {
  network: string | undefined;
}

export default class OntologyLogic extends CoinInterface {
  /**
   * Constructor of XRPLogic class
   * @param config network configuration
   */
  constructor(config: OntologyLogicConfig) {
    super();
  }
  /**
   * Set configuration for the XRP logic class
   * @param config
   */

  /**
   * Get balance of provided address
   * @param address
   * @returns amount or error
   */
  async getBalance(address: string): Promise<number | string | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const newaddress = new Address(address);
        let balance = await rest.getBalance(newaddress);
        resolve(balance.Result.ont);
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one XRP address to others
   *
   * @param senderAddress     sender's address
   * @param senderPrivateKey  sender's private key
   * @param receiverAddress   receiver's address
   * @param amount            amount in Ehtereum to transfer
   * @returns                 result in string
   */
  async transferFunds(
    senderAddress: string,
    senderPrivateKey: string,
    receiverAddress: string,
    amount: number
  ): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const privateKey = new PrivateKey(senderPrivateKey);
        const from = new Address(senderAddress);
        const to = new Address(receiverAddress);
        const assetType = "ONT";
        const gasPrice = "500";
        const gasLimit = "20000";
        const payer = from;
        const tx = OntAssetTxBuilder.makeTransferTx(
          assetType,
          from,
          to,
          amount,
          gasPrice,
          gasLimit,
          payer
        );
        TransactionBuilder.signTransaction(tx, privateKey);
        rest.sendRawTransaction(tx.serialize()).then((res) => {
          console.log("transactionHash", res);
        });
      } catch (err) {
        console.log("errorCatched: ", err);
        reject(err);
      }
    });
  }
  /**
   * Get networks list
   *
   * @returns List of supported networks for this coin type
   */
  // getNetworksList() {
  // return NETWORKS_LIST.map((v) => {
  //   return { val: v, text: v };
  // });
  // }
  /**
   * Get current network
   *
   * @returns currently selected network name
   */
  // getCurrentNetwork() {
  // return this.network;
  // }

  /**
   * Get custom functions
   *
   * @returns an object containing custom functions
   */
  getCustomFunctions(): Object {
    return {};
  }
}
