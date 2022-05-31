import CoinInterface from "../CoinInterface";
import axios from "axios";
const fs = require("fs");
const path = require("path");
const {
  CLPublicKey,
  CasperServiceByJsonRPC,
  Keys,
  CasperClient,
  DeployUtil,
} = require("casper-js-sdk");

const client = new CasperServiceByJsonRPC("http://3.136.227.9:7777/rpc"); //Only testnet
/**
 * Get the chain id for network type
 * @param networkType
 * @returns
 */
const NETWORKS_LIST = ["mainnet", "testnet"];
const DEFAULT_NETWORK = "mainnet";
/**
 * Make network URL for the provided network
 * @param network
 * @returns
 */

/**
 * XRP Logic config interface
 */
interface CasperLogicConfig {
  network: string | undefined;
}
/**
 * XRPLogic to handle the balance request and funds transfer to XRP network
 * @class XRPLogic
 * {@link CoinInterface}
 *
 */
function MAKE_EXPLORER_NETOWRK_URL(network: string) {
  if (network == "testnet") return `https://testnet.cspr.live/deploy/`;
  return "https://cspr.live/block/";
}
export default class CasperLogic extends CoinInterface {
  private networkEndPoint: string = DEFAULT_NETWORK;
  private network: string = DEFAULT_NETWORK;
  /**
   * Constructor of XRPLogic class
   * @param config network configuration
   */
  constructor(config: CasperLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the XRP logic class
   * @param config
   */
  setConfig(config: CasperLogicConfig) {
    this.network = config && config.network ? config.network : DEFAULT_NETWORK;
  }
  /**
   * Get balance of provided address
   * @param address
   * @returns amount or error
   */
  async getBalance(address: string): Promise<number | string | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        let _STATE_ROOT_HASH = await client.getStateRootHash();
        let _BLOCK_STATE = await client.getBlockState(
          _STATE_ROOT_HASH,
          CLPublicKey.fromHex(address).toAccountHashStr()
        );
        let balance = await client.getAccountBalance(
          _STATE_ROOT_HASH,
          _BLOCK_STATE.Account.mainPurse
        );
        resolve(Number(balance));
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
        let _STATE_ROOT_HASH = await client.getStateRootHash();
        let _BLOCK_STATE = await client.getBlockState(
          _STATE_ROOT_HASH,
          CLPublicKey.fromHex(senderAddress).toAccountHashStr()
        );
        let balance = await client.getAccountBalance(
          _STATE_ROOT_HASH,
          _BLOCK_STATE.Account.mainPurse
        );
        if (balance < amount) {
          console.log("transferFunds.error: amount < balance");
          return reject("not enough balance");
        }
        const casperClient = new CasperClient("http://3.136.227.9:7777/rpc");
        const folder = path.join("./", "casper_keys");
        const signKeyPair = Keys.Ed25519.parseKeyFiles(
          folder + "/" + senderAddress + "_public.pem",
          folder + "/" + senderAddress + "_private.pem"
        );
        const paymentAmount = 10000000000;
        const id = 187821;
        const gasPrice = 1;
        const ttl = 1800000;
        let deployParams = new DeployUtil.DeployParams(
          signKeyPair.publicKey,
          "casper-test",
          gasPrice,
          ttl
        );
        const toPublicKey = CLPublicKey.fromHex(receiverAddress);
        const session = DeployUtil.ExecutableDeployItem.newTransfer(
          amount,
          toPublicKey,
          null,
          id
        );
        const payment = DeployUtil.standardPayment(paymentAmount);
        const deploy = DeployUtil.makeDeploy(deployParams, session, payment);
        const signedDeploy = DeployUtil.signDeploy(deploy, signKeyPair);
        let transactionHash = await casperClient.putDeploy(signedDeploy);
        resolve(MAKE_EXPLORER_NETOWRK_URL(this.network) + transactionHash);
      } catch (err) {
        reject(err);
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
  getCustomFunctions(): Object {
    return {};
  }
}
