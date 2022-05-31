/** 
 * Near logic module
 * 
 */

import CoinInterface from "../CoinInterface";
import * as nearAPI from "near-api-js";
import { ConnectConfig } from "near-api-js";
import { toBN } from "web3-utils";

const {connect} = nearAPI;

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet', 'testnet', 'betanet'];
const DEFAULT_NETWORK = 'mainnet';
/**
 * Make network URL for the provided network
 * @param network 
 * @returns 
 */
function MAKE_NODE_URL(network: string) {
  switch (network) {
    case 'mainnet':
      return 'https://rpc.mainnet.near.org';
    case 'testnet':
      return 'https://rpc.testnet.near.org';
    case 'betanet':
      return 'https://rpc.betanet.near.org';
    default:
      return 'https://rpc.mainnet.near.org';
  }
}

function MAKE_WALLET_URL(network: string) {
  switch (network) {
    case 'mainnet':
      return 'https://wallet.mainnet.near.org';
    case 'testnet':
      return 'https://wallet.testnet.near.org';
    case 'betanet':
      return 'https://wallet.betanet.near.org';
    default:
      return 'https://wallet.mainnet.near.org';
  }
}

function MAKE_HELPER_URL(network: string) {
  switch (network) {
    case 'mainnet':
      return 'https://helper.mainnet.near.org';
    case 'testnet':
      return 'https://helper.testnet.near.org';
    case 'betanet':
      return 'https://helper.betanet.near.org';
    default:
      return 'https://helper.mainnet.near.org';
  }
}

function MAKE_EXPLORER_URL(network: string) {
  switch (network) {
    case 'mainnet':
      return 'https://explorer.mainnet.near.org';
    case 'testnet':
      return 'https://explorer.testnet.near.org';
    case 'betanet':
      return 'https://explorer.betanet.near.org';
    default:
      return 'https://explorer.mainnet.near.org';
  }
}

/**
 * Near Logic config interface
 */
interface NearLogicConfig {
  network: string | undefined,
};
/**
 * NearLogic to handle the balance request and funds transfer to Near network
 * @class NearLogic
 * {@link CoinInterface} 
 * 
 */
export default class NearLogic extends CoinInterface {
    private networkEndPoint = 'mainnet';
    private nodeUrl: string = MAKE_NODE_URL(DEFAULT_NETWORK);
    private walletUrl: string = MAKE_WALLET_URL(DEFAULT_NETWORK);
    private helperUrl: string = MAKE_HELPER_URL(DEFAULT_NETWORK);
    private explorerUrl: string = MAKE_EXPLORER_URL(DEFAULT_NETWORK);
    private decimal: number = 24;
  /**
   * Constructor of NearLogic class
   * @param config network configuration
   */
  constructor(config: NearLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Near logic class
   * @param config 
   */
  setConfig(config: NearLogicConfig) {
    this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
    this.nodeUrl = MAKE_NODE_URL(this.networkEndPoint);
    this.walletUrl = MAKE_WALLET_URL(this.networkEndPoint);
    this.helperUrl = MAKE_HELPER_URL(this.networkEndPoint);
    this.explorerUrl = MAKE_EXPLORER_URL(this.networkEndPoint);
  }
  /**
   * Get balance of provided address
   * @param address 
   * @returns amount or error
   */

  async getBalance(address: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const { connect, keyStores, KeyPair, WalletConnection } = nearAPI;
        const keyStore = new keyStores.InMemoryKeyStore();
        const PRIVATE_KEY =
          "5eVGgQW2UmVTBvu7HUnLBQ5vpapiTuQqBCSE6M5SgwHGTEsyKGoYwVyHf9w6s1DENWrwhiQrpkEM96TsN4WLmdTG";
        // creates a public / private key pair using the provided private key
        const keyPair = KeyPair.fromString(PRIVATE_KEY);
        // adds the keyPair you created to keyStore
        await keyStore.setKey(this.networkEndPoint, address, keyPair);
        const config = {
          headers: {
            test: 'test'
          },
          networkId: this.networkEndPoint,
          keyStore,
          nodeUrl: this.nodeUrl,
          walletUrl: this.walletUrl,
          helperUrl: this.helperUrl,
          explorerUrl: this.explorerUrl,
        };

        // connect to NEAR
        const near = await connect(config);
        const account = await near.account(address)
        const result = await account.getAccountBalance()
        resolve(Number(result.total) / 10 ** this.decimal)
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Near address to others
   * 
   * @param senderAddress     sender's address
   * @param senderPrivateKey  sender's private key
   * @param receiverAddress   receiver's address
   * @param amount            amount in Ehtereum to transfer 
   * @returns                 result in string
   */
  async transferFunds(senderAddress: string, senderPrivateKey: string, receiverAddress: string, amount: number): Promise<string> {
    return new Promise(async (resolve, reject) => {
      let balance = 0;
      try { 
        let ret = await this.getBalance(senderAddress);
        if(ret instanceof Error)
            throw ret;
        balance = ret;
      }
      catch(e) {
          console.log('getBalance.error:', e);
          reject(e);
      }

      if(balance < amount) {
          console.log('transferFunds.error: amount < balance');
          return reject('not enough balance');
      }

      const { connect, keyStores, KeyPair, WalletConnection } = nearAPI;
      const keyStore = new keyStores.InMemoryKeyStore();
      const PRIVATE_KEY = senderPrivateKey;
      // creates a public / private key pair using the provided private key
      const keyPair = KeyPair.fromString(PRIVATE_KEY);
      // adds the keyPair you created to keyStore
      await keyStore.setKey(this.networkEndPoint, senderAddress, keyPair);
      const config = {
        headers: {
          test: 'test'
        },
        networkId: this.networkEndPoint,
        keyStore,
        nodeUrl: this.nodeUrl,
        walletUrl: this.walletUrl,
        helperUrl: this.helperUrl,
        explorerUrl: this.explorerUrl,
      };

      // connect to NEAR
      const near = await connect(config);
      const account = await near.account(senderAddress);

      const result = await account.sendMoney(
        receiverAddress, // receiver account
        toBN(amount * 10 ** this.decimal)
      );
      resolve(`${this.explorerUrl}/transactions/${result.transaction.hash}`)
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
  getCurrentNetwork() { return this.nodeUrl }

  /**
   * Get custom functions
   * 
   * @returns an object containing custom functions
   */
  getCustomFunctions(): Object {
    return {};
  }

}
