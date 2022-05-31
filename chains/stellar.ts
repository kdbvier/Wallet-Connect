/** 
 * Stellar logic module
 * 
 */

import CoinInterface from "../CoinInterface";
import StellarSdk from "stellar-sdk";
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
      return 'https://horizon.stellar.org';
    case 'testnet':
      return 'https://horizon-testnet.stellar.org';
    default:
      return 'https://horizon.stellar.org';
  }
}

/**
 * Stellar Logic config interface
 */
interface StellarLogicConfig {
  network: string | undefined,
};
/**
 * StellarLogic to handle the balance request and funds transfer to Stellar network
 * @class StellarLogic
 * {@link CoinInterface} 
 * 
 */
export default class StellarLogic extends CoinInterface {
    private networkEndPoint = 'mainnet';
    private network: string = MAKE_NETOWRK_URL(DEFAULT_NETWORK);
    private server = new StellarSdk.Server(this.network);

  /**
   * Constructor of StellarLogic class
   * @param config network configuration
   */
  constructor(config: StellarLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Stellar logic class
   * @param config 
   */
  setConfig(config: StellarLogicConfig) {
    this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
    this.network = MAKE_NETOWRK_URL(this.networkEndPoint);
    this.server = new StellarSdk.Server(this.network)
  }
  /**
   * Get balance of provided address
   * @param address 
   * @returns amount or error
   */

  formatBalance = (account: any, currency: any): number => {
    let balance = 0;
    if (currency == 'XLM') {
        balance = Number.parseFloat(account.balances.find((b: any) => b.asset_type == 'native').balance);
    } else {
        balance = Number.parseFloat(account.balances.find((b: any) => b.asset_code == currency).balance);
    }
    return balance;
  }

  async getBalance(address: string): Promise<number | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        this.server.loadAccount(address)
        .then((account: any) => {
          const balance = this.formatBalance(account, 'XLM');
          resolve(balance)
        })
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Stellar address to others
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

      var sourceKeys = StellarSdk.Keypair.fromSecret(senderPrivateKey);
      // Transaction will hold a built transaction we can resubmit if the result is unknown.
      var transaction;
      
      // First, check to make sure that the destination account exists.
      // You could skip this, but if the account does not exist, you will be charged
      // the transaction fee when the transaction fails.
      this.server
        .loadAccount(receiverAddress)
        // If the account is not found, surface a nicer error message for logging.
        .catch((error: any) => {
          if (error instanceof StellarSdk.NotFoundError) {
            throw new Error("The destination account does not exist!");
          } else return error;
        })
        // If there was no error, load up-to-date information on your account.
        .then((): any => {
          return this.server.loadAccount(sourceKeys.publicKey());
        })
        .then((sourceAccount: any): any => {
          // Start building the transaction.
          transaction = new StellarSdk.TransactionBuilder(sourceAccount, {
            fee: StellarSdk.BASE_FEE,
            networkPassphrase: this.network === 'mainnet' ? 'Public Global Stellar Network ; September 2015': 'Test SDF Network ; September 2015'
          })
            .addOperation(
              StellarSdk.Operation.payment({
                destination: receiverAddress,
                // Because Stellar allows transaction in many currencies, you must
                // specify the asset type. The special "native" asset represents Lumens.
                asset: StellarSdk.Asset.native(),
                amount: amount.toString(),
              }),
            )
            // A memo allows you to add your own metadata to a transaction. It's
            // optional and does not affect how Stellar treats the transaction.
            .addMemo(StellarSdk.Memo.text("Transaction"))
            // Wait a maximum of three minutes for the transaction
            .setTimeout(0)
            .build();
          // Sign the transaction to prove you are actually the person sending it.
          transaction.sign(sourceKeys);
          // And finally, send it off to Stellar!
          return this.server.submitTransaction(transaction);
        })
        .then((result: any) => {
          resolve(result._links.transaction.href);
        })
        .catch((error: any) => {
          console.error("Something went wrong!", error, error.response?.data?.extras);
          // If the result is unknown (no response body, timeout etc.) we simply resubmit
          // already built transaction:
          // server.submitTransaction(transaction);
        });
      
      // if (transaction.txid) {
      //     resolve(`Transaction: ${getBlockExploer(this.network)}/#/transaction/${transaction.txid}`);
      // } else {
      //     reject(Error("No Raw Transaction"))
      // }
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
