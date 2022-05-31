/** 
 * Filecoin logic module
 * 
 */

import CoinInterface from "../CoinInterface";
let request = require("request")

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet', 'testnet'];
const DEFAULT_NETWORK = 'mainnet';

/**
 * Filecoin Logic config interface
 */
interface FilecoinLogicConfig {
  network: string | undefined,
};
/**
 * FilecoinLogic to handle the balance request and funds transfer to Filecoin network
 * @class FilecoinLogic
 * {@link CoinInterface} 
 * 
 */
export default class FilecoinLogic extends CoinInterface {
    private networkEndPoint = 'mainnet';

  /**
   * Constructor of FilecoinLogic class
   * @param config network configuration
   */

  constructor(config: FilecoinLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Filecoin logic class
   * @param config 
   */
  setConfig(config: FilecoinLogicConfig) {
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
        let options = {
          url: 'https://filecoin.infura.io',
          method: 'post',
          headers: {
            'content-type': 'application/json'
          },
          auth: {
            user: '25slTQwHkbR2VETLwCTkk6YA0CH',
            pass: '427c51d8c6b4089b539eda97674eb8c1'
          },
          body: `{
              "jsonrpc": "2.0", 
              "id": 0, 
              "method": "Filecoin.WalletBalance", 
              "params": ["f1ydrwynitbbfs5ckb7c3qna5cu25la2agmapkchi"]}`
        }
        request(options, (error: any, response: any, body: any) => {
          if (error) {
            console.error('Error: ', error)
          } else {
            console.log('Response: ', body)
          }
        })
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Filecoin address to others
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

  //     const { connect, keyStores, KeyPair, WalletConnection } = filecoinAPI;
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
  //     const filecoin = await connect(config);
  //     const account = await filecoin.account(senderAddress);

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
