/** 
 * Polkadot logic module
 * 
 */

import CoinInterface from "../CoinInterface";
const { ApiPromise, WsProvider } = require('@polkadot/api');

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet'];
const DEFAULT_NETWORK = 'mainnet';
/**
 * Make network URL for the provided network
 * @param network 
 * @returns 
 */
function MAKE_NETOWRK_URL(network: string) {
    switch (network) {
        case 'mainnet':
            return 'wss://rpc.polkadot.io';
        default:
            return 'wss://rpc.polkadot.io';
    }
}

/**
 * Polkadot Logic config interface
 */
interface PolkadotLogicConfig {
    network: string | undefined,
};
/**
 * PolkadotLogic to handle the balance request and funds transfer to Polkadot network
 * @class PolkadotLogic
 * {@link CoinInterface} 
 * 
 */
export default class PolkadotLogic extends CoinInterface {
    private networkEndPoint: string = DEFAULT_NETWORK;
    private network: string = MAKE_NETOWRK_URL(DEFAULT_NETWORK);
    private wsProvider = new WsProvider('wss://rpc.polkadot.io');
    private api: any;
    /**
     * Constructor of PolkadotLogic class
     * @param config network configuration
     */
    constructor(config: PolkadotLogicConfig) {
        super();
        this.setConfig(config);
    }
    /**
     * Set configuration for the Polkadot logic class
     * @param config 
     */
    setConfig(config: PolkadotLogicConfig) {
        this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
        this.network = MAKE_NETOWRK_URL(this.networkEndPoint);
        this.wsProvider = new WsProvider('wss://rpc.polkadot.io');
    }
    /**
     * Get balance of provided address
     * @param address 
     * @returns amount or error
     */
    async getBalance(address: string): Promise<number | string | Error> {
        return new Promise(async (resolve, reject) => {
            try {
                const api = await ApiPromise.create({ provider: this.wsProvider });
                const { nonce, data: balance } = await api.query.system.account(address);
                resolve(balance.free);
            } catch (err) {
                reject(err);
            }
        });
    }
    /**
     * Transfer funds from one Polkadot address to others
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
                const api = await ApiPromise.create({ provider: this.wsProvider });
                const txHash = await api.tx.balances
                    .transfer(receiverAddress, amount)
                    .signAndSend(senderAddress);
                // Show the hash
                resolve(`Submitted with hash ${txHash}`);
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
