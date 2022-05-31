/** 
 * Hedera logic module
 * 
 */

import CoinInterface from "../CoinInterface";
import {
  Client,
  PrivateKey,
  PublicKey,
  Hbar,
  AccountId,
  AccountBalanceQuery,
  AccountInfoQuery,
  TransferTransaction,
} from "@hashgraph/sdk";
import { toBN } from "web3-utils";

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet', 'testnet'];
const DEFAULT_NETWORK = 'mainnet';

/**
 * Hedera Logic config interface
 */
interface HederaLogicConfig {
  network: string | undefined,
};
/**
 * HederaLogic to handle the balance request and funds transfer to Hedera network
 * @class HederaLogic
 * {@link CoinInterface} 
 * 
 */
export default class HederaLogic extends CoinInterface {
    private networkEndPoint = 'mainnet';

  /**
   * Constructor of HederaLogic class
   * @param config network configuration
   */

  constructor(config: HederaLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Hedera logic class
   * @param config 
   */
  setConfig(config: HederaLogicConfig) {
    this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
  }
  /**
   * Get balance of provided address
   * @param address 
   * @returns amount or error
   */

  async getBalance(address: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const OPERATOR_ID = AccountId.fromString("0.0.96928");
        const OPERATOR_KEY = PrivateKey.fromString("302e020100300506032b657004220420b9c3ebac81a72aafa5490cc78111643d016d311e60869436fbb91c7330796928");
        console.log(OPERATOR_ID)
        // Pre-configured client for test network (testnet)
        const client = Client.forTestnet()

        //Set the operator with the operator ID and operator key
        client.setOperator(OPERATOR_ID, OPERATOR_KEY);
        
        const balance = await new AccountBalanceQuery()
          .setAccountId(OPERATOR_ID)
          .execute(client);

        console.log(
        // @ts-ignore
            `${client.operatorAccountId.toString()} balance = ${balance.hbars.toString()}`
        );
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Hedera address to others
   * 
   * @param senderAddress     sender's address
   * @param senderPrivateKey  sender's private key
   * @param receiverAddress   receiver's address
   * @param amount            amount in Ehtereum to transfer 
   * @returns                 result in string
   */
  // async transferFunds(senderAddress: string, senderPrivateKey: string, receiverAddress: string, amount: number): Promise<string> {
  //   return new Promise(async (resolve, reject) => {
  //     let balance = 0;
  //     try { 
  //       let ret = await this.getBalance(senderAddress);
  //       if(ret instanceof Error)
  //           throw ret;
  //       balance = ret;
  //     }
  //     catch(e) {
  //         console.log('getBalance.error:', e);
  //         reject(e);
  //     }

  //     if(balance < amount) {
  //         console.log('transferFunds.error: amount < balance');
  //         return reject('not enough balance');
  //     }

  //     const { connect, keyStores, KeyPair, WalletConnection } = hederaAPI;
  //     const keyStore = new keyStores.InMemoryKeyStore();
  //     const PRIVATE_KEY = senderPrivateKey;
  //     // creates a public / private key pair using the provided private key
  //     const keyPair = KeyPair.fromString(PRIVATE_KEY);
  //     // adds the keyPair you created to keyStore
  //     await keyStore.setKey(this.networkEndPoint, senderAddress, keyPair);
  //     const config = {
  //       headers: {
  //         test: 'test'
  //       },
  //       networkId: this.networkEndPoint,
  //       keyStore,
  //       nodeUrl: this.nodeUrl,
  //       walletUrl: this.walletUrl,
  //       helperUrl: this.helperUrl,
  //       explorerUrl: this.explorerUrl,
  //     };

  //     // connect to NEAR
  //     const hedera = await connect(config);
  //     const account = await hedera.account(senderAddress);

  //     const result = await account.sendMoney(
  //       receiverAddress, // receiver account
  //       toBN(amount * 10 ** this.decimal)
  //     );
  //     resolve(`${this.explorerUrl}/transactions/${result.transaction.hash}`)
  // });
  // }
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
  getCurrentNetwork() { return this.networkEndPoint }

  /**
   * Get custom functions
   * 
   * @returns an object containing custom functions
   */
  getCustomFunctions(): Object {
    return {};
  }

}
