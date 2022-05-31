/** 
 * Vechain logic module
 * 
 */

import CoinInterface from "../CoinInterface";

import { Framework } from '@vechain/connex-framework'
import { Driver, SimpleNet, SimpleWallet  } from '@vechain/connex-driver'
import { mnemonic, secp256k1 } from 'thor-devkit'

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet', 'testnet'];
const DEFAULT_NETWORK = 'mainnet';
/**
 * Make network URL for the provided network
 * @param network 
 * @returns 
 */
function MAKE_NETOWRK_URL(network: string) {
  switch (network) {
    case 'mainnet':
      return 'https://mainnet.veblocks.net/';
    case 'testnet':
      return 'https://testnet.veblocks.net/';
    default:
      return 'https://mainnet.veblocks.net/';
  }
}

/**
 * Vechain Logic config interface
 */
interface VechainLogicConfig {
  network: string | undefined,
};
/**
 * VechainLogic to handle the balance request and funds transfer to Vechain network
 * @class VechainLogic
 * {@link CoinInterface} 
 * 
 */
export default class VechainLogic extends CoinInterface {
  private network: string = DEFAULT_NETWORK;
  private node: string = MAKE_NETOWRK_URL(DEFAULT_NETWORK);
  private net = new SimpleNet(this.node)
  /**
   * Constructor of VechainLogic class
   * @param config network configuration
   */
  constructor(config: VechainLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Vechain logic class
   * @param config 
   */
  setConfig(config: VechainLogicConfig) {
    this.network = config && config.network ? config.network : DEFAULT_NETWORK;
    this.node = MAKE_NETOWRK_URL(this.network);
    this.net = new SimpleNet(this.node);
  }
  /**
   * Get balance of provided address
   * @param address 
   * @returns amount or error
   */
  async getBalance(address: string): Promise<number | string | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const driver = await Driver.connect(this.net);
        const connex = new Framework(driver)
        const acc = connex.thor.account(address)
        acc.get().then(accInfo => {
          resolve(Number(accInfo.balance) / 10 ** 18)
        })
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Vechain address to others
   * 
   * @param senderAddress     sender's address
   * @param senderPrivateKey  sender's private key
   * @param receiverAddress   receiver's address
   * @param amount            amount in Ehtereum to transfer 
   * @returns                 result in string
   */
  async transferFunds(senderAddress: string, senderPrivateKey: string, receiverAddress: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      try {
        const wallet = new SimpleWallet()
        // add account by importing private key

        const words: string[] = senderPrivateKey.split(" ");
        console.log(words)
        const privKey = mnemonic.derivePrivateKey(words).toString('hex');

        wallet.import(privKey)

        const driver = await Driver.connect(this.net, wallet)
        const connex = new Framework(driver)
        const sendAmount = (amount * 10 ** 18).toString();

        connex.vendor.sign('tx', [
          {
            to: receiverAddress,
            value: sendAmount,
            data: '0x',
            comment: `Transfer ${amount} VET`
          }
        ])
          .signer(senderAddress) // Enforce signer
          .gas(200000) // Set maximum gas
          .link('https://connex.vecha.in/{txid}') // User will be back to the app by the url https://connex.vecha.in/0xffff....
          .comment('Donate 100 VET and 1000 VeThor to the author of connex')
          .request()
          .then((result: any) => {
            const url = this.network === "mainnet" ? "https://explore.vechain.org/blocks" : "https://explore-testnet.vechain.org/transactions"
            resolve(`${url}/${result.txid}`)
          })
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
  getNetworksList() { return NETWORKS_LIST.map(v => { return { val: v, text: v } }); }
  /**
   * Get current network
   * 
   * @returns currently selected network name
   */
  getCurrentNetwork() { return this.network }

  /**
   * Get custom functions
   * 
   * @returns an object containing custom functions
   */
  getCustomFunctions(): Object {
    return {};
  }

}
