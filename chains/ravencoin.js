/**
 * Tron logic module
 *
 */

import CoinInterface from "../CoinInterface";
import TronWeb from "tronweb";
import axios from "axios";

/**
 * Get the chain id for network type
 * @param networkType
 * @returns
 */

const NETWORKS_LIST = ["mainnet grid", "mainnet stack", "shasta", "nile"];
const DEFAULT_NETWORK = "mainnet grid";
/**
 * Make network URL for the provided network
 * @param network
 * @returns
 */
function getFullNode(network) {
  switch (network) {
    case "mainnet grid":
      return "https://api.trongrid.io/";
    case "mainnet stack":
      return "https://api.tronstack.io";
    case "shasta":
      return "https://api.shasta.io";
    case "nile":
      return "https://api.nileex.io";
    default:
      return "https://api.trongrid.io/";
  }
}

function getSolidityNode(network) {
  switch (network) {
    case "mainnet grid":
      return "https://api.trongrid.io/";
    case "mainnet stack":
      return "https://api.tronstack.io";
    case "shasta":
      return "https://api.shasta.io";
    case "nile":
      return "https://api.nileex.io";
    default:
      return "https://api.trongrid.io/";
  }
}

function getEventServer(network) {
  switch (network) {
    case "mainnet grid":
      return "https://api.trongrid.io/";
    case "mainnet stack":
      return "https://api.tronstack.io";
    case "shasta":
      return "https://api.shasta.io";
    case "nile":
      return "https://event.nileex.io";
    default:
      return "https://api.trongrid.io/";
  }
}

function getBlockExploer(network) {
  switch (network) {
    case "mainnet grid":
      return "https://tronscan.org/";
    case "mainnet stack":
      return "https://tronscan.org/";
    case "shasta":
      return "https://shasta.tronscan.org/";
    case "nile":
      return "https://nile.tronscan.org/";
    default:
      return "https://tronscan.org/";
  }
}

/**
 * Tron Logic config interface
 */
/**
 * TronLogic to handle the balance request and funds transfer to Tron network
 * @class TronLogic
 * {@link CoinInterface}
 *
 */
export default class TronLogic extends CoinInterface {
  network = "mainnet";
  fullNode = getFullNode(this.network);
  solidityNode = getSolidityNode(this.network);
  eventServer = getEventServer(this.network);
  tronWeb = new TronWeb({
    fullHost: this.fullNode,
  });
  /**
   * Constructor of TronLogic class
   * @param config network configuration
   */
  constructor(config) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Tron logic class
   * @param config
   */
  setConfig(config) {
    this.network = config && config.network ? config.network : DEFAULT_NETWORK;
    this.fullNode = getFullNode(this.network);
    this.eventServer = getEventServer(this.network);
    this.tronWeb = new TronWeb({
      fullHost: this.fullNode,
    });
  }
  /**
   * Get balance of provided address
   * @param address
   * @returns amount or error
   */
  async getBalance(address) {
    return new Promise((resolve, reject) => {
      this.tronWeb.trx
        .getBalance(address)
        .then((result) => {
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  }
  /**
   * Transfer funds from one Tron address to others
   *
   * @param senderAddress     sender's address
   * @param senderPrivateKey  sender's private key
   * @param receiverAddress   receiver's address
   * @param amount            amount in Ehtereum to transfer
   * @returns                 result in string
   */
  async transferFunds(
    senderAddress,
    senderPrivateKey,
    receiverAddress,
    amount
  ) {
    return new Promise(async (resolve, reject) => {
      let balance = 0;
      try {
        let ret = await this.getBalance(senderAddress);
        if (ret instanceof Error) throw ret;

        balance = ret;
      } catch (e) {
        console.log("getBalance.error:", e);
        reject(e);
      }

      if (balance < amount) {
        console.log("transferFunds.error: amount < balance");
        return reject("not enough balance");
      }

      const transaction = await this.tronWeb.trx.sendTransaction(
        receiverAddress,
        amount * 10 ** 6,
        senderPrivateKey
      );

      if (transaction.txid) {
        resolve(
          `Transaction: ${getBlockExploer(this.network)}/#/transaction/${
            transaction.txid
          }`
        );
      } else {
        reject(Error("No Raw Transaction"));
      }
    });
  }
  /**
   * Get networks list
   *
   * @returns List of supported networks for this coin type
   */
  getNetworksList() {
    return NETWORKS_LIST.map((v) => {
      return { val: v, text: v };
    });
  }
  /**
   * Get current network
   *
   * @returns currently selected network name
   */
  getCurrentNetwork() {
    return this.network;
  }

  /**
   * Get custom functions
   *
   * @returns an object containing custom functions
   */
  getCustomFunctions() {
    return {};
  }
}
