import CoinInterface from "../CoinInterface";
 import axios from 'axios';
 
 const apiKey = 'c90d79867622f139e92679cbdd48de76e386b16f';
 
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
 
 /**
  * XRP Logic config interface
  */
 interface Bitcoin_CashCoinLogicConfig {
     network: string | undefined,
 };
 /**
  * XRPLogic to handle the balance request and funds transfer to XRP network
  * @class XRPLogic
  * {@link CoinInterface} 
  * 
  */
 export default class Bitcoin_CashCoinLogic extends CoinInterface {
     private networkEndPoint: string = DEFAULT_NETWORK;
     private network: string = DEFAULT_NETWORK;
     /**
      * Constructor of XRPLogic class
      * @param config network configuration
      */
     constructor(config: Bitcoin_CashCoinLogicConfig) {
         super();
         this.setConfig(config);
     }
     /**
      * Set configuration for the XRP logic class
      * @param config 
      */
     setConfig(config: Bitcoin_CashCoinLogicConfig) {
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
                 let networkPart = this.network ==='testnet' ? 'testnet': 'mainnet';
                 let url =  `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/address/${address}`;
                 let response = await axios.get(url, {headers: {"X-API-Key": apiKey}});
                 let balance = response.data.payload.balance;
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
     async transferFunds(senderAddress: string, senderPrivateKey: string, receiverAddress: string, amount: number): Promise<string> {
         return new Promise(async (resolve, reject) => {
             try {
                 let networkPart = this.network ==='testnet' ? 'testnet': 'mainnet';
                 let url =  `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/address/${senderAddress}`;
                 let response = await axios.get(url, {headers: {"X-API-Key": apiKey}});
                 let balance = response.data.payload.balance;
                 if (balance < amount) {
                     console.log('transferFunds.error: amount < balance');
                     return reject('not enough balance');
                 }
 
                 //Get transaction fee
                 let fee_url = `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/txs/fee`;
                 let fee_response = await axios.get(
                     fee_url, 
                     {headers: {"X-API-Key": apiKey}},
                 );
                 const fee = fee_response.data.payload.average;
                 
                 //Create new transaction
                 let create_url =  `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/txs/create`;
                 let data = {
                     inputs: 
                         [ { address: senderAddress,
                             value: amount } ],
                     outputs: 
                         [ { address: receiverAddress,
                             value: amount } ],
                     fee: { value: fee }
                 }
                 let create_response = await axios.post(
                     create_url, 
                     data,
                     {headers: {"X-API-Key": apiKey}},
                 );
                 const prepared = create_response.data.payload.hex;
 
                 //Sign created transaction
                 let sign_url =  `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/txs/sign`;
                 let sign_data = {
                     hex: prepared,
                     wifs: [senderPrivateKey]
                 }
                 let sign_response = await axios.post(
                     sign_url, 
                     sign_data,
                     {headers: {"X-API-Key": apiKey}},
                 );
                 const sign_hex = sign_response.data.payload.hex
 
                 //Send transaction
                 let send_url =  `https://api.cryptoapis.io/v1/bc/bch/${networkPart}/txs/send`;
                 let tx_data = {
                     hex: sign_hex
                 }
                 let send_response = await axios.post(
                     send_url, 
                     tx_data,
                     {headers: {"X-API-Key": apiKey}},
                 );
                 resolve(send_response.data.payload.view_in_explorer)
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