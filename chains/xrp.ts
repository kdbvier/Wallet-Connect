/** 
 * XRP logic module
 * 
 */

import CoinInterface from "../CoinInterface";
import * as xrpl from "xrpl";

/**
 * Get the chain id for network type
 * @param networkType 
 * @returns 
 */
const NETWORKS_LIST = ['mainnet', 'testnet', 'devnet'];
const DEFAULT_NETWORK = 'mainnet';
/**
 * Make network URL for the provided network
 * @param network 
 * @returns 
 */
function MAKE_NETOWRK_URL(network: string) {
    switch (network) {
        case 'mainnet':
            return 'wss://xrplcluster.com/';
        case 'testnet':
            return 'wss://s.altnet.rippletest.net:51233';
        case 'devnet':
            return 'wss://s.devnet.rippletest.net:51233';
        default:
            return 'wss://xrplcluster.com/';
    }
}

function MAKE_TRANSACTION_URL(network: string, signature: string) {
    switch (network) {
        case 'mainnet':
            return `https://xrpscan.com/ledger/${signature}`;
        case 'testnet':
            return `https://blockexplorer.one/xrp/testnet/tx/${signature}`;
        case 'devnet':
            return `https://blockexplorer.one/xrp/devnet/tx/${signature}`;
        default:
            return `https://xrpscan.com/ledger/${signature}`;
    }
}

/**
 * XRP Logic config interface
 */
interface XRPLogicConfig {
    network: string | undefined,
};
/**
 * XRPLogic to handle the balance request and funds transfer to XRP network
 * @class XRPLogic
 * {@link CoinInterface} 
 * 
 */
export default class XRPLogic extends CoinInterface {
    private networkEndPoint: string = DEFAULT_NETWORK;
    private network: string = MAKE_NETOWRK_URL(DEFAULT_NETWORK);
    private api = new xrpl.Client(this.network);
    /**
     * Constructor of XRPLogic class
     * @param config network configuration
     */
    constructor(config: XRPLogicConfig) {
        super();
        this.setConfig(config);
    }
    /**
     * Set configuration for the XRP logic class
     * @param config 
     */
    setConfig(config: XRPLogicConfig) {
        this.networkEndPoint = config && config.network ? config.network : DEFAULT_NETWORK;
        this.network = MAKE_NETOWRK_URL(this.networkEndPoint);
        this.api = new xrpl.Client(this.network);
    }
    /**
     * Get balance of provided address
     * @param address 
     * @returns amount or error
     */
    async getBalance(address: string): Promise<number | string | Error> {
        await this.api.connect()
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.api.request({
                    "command": "account_info",
                    "account": address,
                    "ledger_index": "validated"
                });
                this.api.disconnect()
                resolve(Number(response.result.account_data.Balance) / 1000000);
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
                // Generate a new random public key
                const from = xrpl.Wallet.fromSeed(senderPrivateKey)
                const balance = await this.getBalance(senderAddress);
                if (balance < amount) {
                    console.log('transferFunds.error: amount < balance');
                    return reject('not enough balance');
                }

                // Prepare transaction
                const prepared = await this.api.autofill({
                    "TransactionType": "Payment",
                    "Account": from.address,
                    "Amount": xrpl.xrpToDrops(amount),
                    "Destination": receiverAddress
                })

                // Sign prepared instructions
                const signed = from.sign(prepared)
                // Submit signed blob
                const tx = await this.api.submitAndWait(signed.tx_blob)

                // Get Transaction result
                let transaction: string;
                if (!tx.result.meta) {
                    return reject("no transaction")
                } else if (typeof (tx.result.meta) === 'string') {
                    transaction = tx.result.meta;
                } else {
                    transaction = tx.result.meta?.TransactionResult
                }
                resolve(MAKE_TRANSACTION_URL(this.networkEndPoint, transaction))
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
