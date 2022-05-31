/** 
 * Terra logic module
 * 
 */

import CoinInterface from "../CoinInterface";
import {
  LCDClient,
  Dec,
  MsgExecuteContract,
  isTxError,
  Int,
  MnemonicKey,
  MsgSend
} from '@terra-money/terra.js';
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
      return 'https://lcd.terra.dev';
    case 'testnet':
      return 'https://bombay-lcd.terra.dev';
    default:
      return 'https://lcd.terra.dev';
  }
}

function CHAIN_ID(network: string) {
  switch (network) {
    case 'mainnet':
      return 'columbus-3';
    case 'testnet':
      return 'bombay-12';
    default:
      return 'columbus-3';
  }
}

/**
 * Terra Logic config interface
 */
interface TerraLogicConfig {
  network: string | undefined,
};
/**
 * TerraLogic to handle the balance request and funds transfer to Terra network
 * @class TerraLogic
 * {@link CoinInterface} 
 * 
 */
export default class TerraLogic extends CoinInterface {
  private networkEndPoint: string = DEFAULT_NETWORK;
  private network: string = MAKE_NETOWRK_URL(DEFAULT_NETWORK);
  private chainId: string = CHAIN_ID(DEFAULT_NETWORK);
  /**
   * Constructor of TerraLogic class
   * @param config network configuration
   */
  constructor(config: TerraLogicConfig) {
    super();
    this.setConfig(config);
  }
  /**
   * Set configuration for the Terra logic class
   * @param config 
   */
  setConfig(config: TerraLogicConfig) {
    this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
    this.network = MAKE_NETOWRK_URL(this.networkEndPoint);
    this.chainId = CHAIN_ID(this.networkEndPoint);
  }
  /**
   * Get balance of provided address
   * @param address 
   * @returns amount or error
   */
  async getBalance(address: string): Promise<number | string | Error> {
    return new Promise(async (resolve, reject) => {
      try {
        const lcd = new LCDClient({
          URL: this.network,
          chainID: this.chainId
        });
        const currentBalance = await lcd.bank.balance(address);

        // @ts-ignore
        const uusdAmount = currentBalance[0]._coins.uusd?.amount;
        if (uusdAmount) {
          resolve(new Dec(uusdAmount)
            .div(1000000)
            .toNumber())
        } else {
          return 0;
        }
      } catch (err) {
        reject(err);
      }
    });
  }
  /**
   * Transfer funds from one Terra address to others
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
        const balance = await this.getBalance(senderAddress);
        if (balance < amount) {
            console.log('transferFunds.error: amount < balance');
            return reject('not enough balance');
        }
        const lcd = new LCDClient({
          URL: this.network,
          chainID: this.chainId
        });
        // create a key out of a mnemonic
        const mk = new MnemonicKey({
          mnemonic: senderPrivateKey
        });

        const wallet = lcd.wallet(mk);

        // create a simple message that moves coin balances
        const send = new MsgSend(
          senderAddress,
          receiverAddress,
          { uusd: new Dec(amount).mul(1000000).toNumber() }
        );

        wallet
          .createAndSignTx({
            msgs: [send],
            memo: 'Terra Transfer',
          })
          .then(tx => lcd.tx.broadcast(tx))
          .then(result => {
            resolve(`https://finder.terra.money/${this.networkEndPoint}/tx/${result.txhash}`)
          });
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
