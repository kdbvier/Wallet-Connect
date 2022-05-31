import EthereumLogic from "./chains/ethereum";
import CoinInterface from "./CoinInterface";
import BitCoinLogic from "./chains/bitcoin";
import BSCLogic from "./chains/bsc";
import PolygonLogic from "./chains/polygon";
import AvalancheLogic from "./chains/avalanche";
import FantomLogic from "./chains/fantom";
import HarmonyLogic from "./chains/harmony";
import HuobiLogic from "./chains/huobi";
import KucoinLogic from "./chains/kucoin";
import SolanaLogic from "./chains/solana";
import XRPLogic from "./chains/xrp";
import PolkadotLogic from "./chains/polkadot";
import TerraLogic from "./chains/terra";
import TronLogic from "./chains/tron";
import StellarLogic from "./chains/stellar";
import DogeCoinLogic from "./chains/dogecoin";
import VechainLogic from "./chains/Vechain";
import LiteCoinLogic from "./chains/litecoin";
import DashLogic from "./chains/dash";
import ZilliqaLogic from "./chains/zilliqa";
import Bitcoin_CashLogic from "./chains/bitcoin_cash";
import NearLogic from "./chains/near";
import HederaLogic from "./chains/hedera";
import ArkLogic from "./chains/ark";
import CasperLogic from "./chains/casper";
import OntologyLogic from "./chains/ontology";
import SyscoinLogic from "./chains/syscoin";
/**
 * Coin Factory creates the coin logic handler
 *
 * @param coinType Coin type that logic handler is to be created
 * @param config   Configuration
 * @returns        Logic handler
 */
export function coinFactory(coinType: string, config: any) {
  switch (coinType) {
    case "ethereum":
      return new EthereumLogic(config);
    case "bitcoin":
      return new BitCoinLogic(config);
    case "bsc":
      return new BSCLogic(config);
    case "polygon":
      return new PolygonLogic(config);
    case "avalanche":
      return new AvalancheLogic(config);
    case "fantom":
      return new FantomLogic(config);
    case "harmony":
      return new HarmonyLogic(config);
    case "huobi":
      return new HuobiLogic(config);
    case "kucoin":
      return new KucoinLogic(config);
    case "solana":
      return new SolanaLogic(config);
    case "xrp":
      return new XRPLogic(config);
    case "polkadot":
      return new PolkadotLogic(config);
    case "terra":
      return new TerraLogic(config);
    case "tron":
      return new TronLogic(config);
    case "stellar":
      return new StellarLogic(config);
    case "dogecoin":
      return new DogeCoinLogic(config);
    case "vechain":
      return new VechainLogic(config);
    case "litecoin":
      return new LiteCoinLogic(config);
    case "dash":
      return new DashLogic(config);
    case "zilliqa":
      return new ZilliqaLogic(config);
    case "bitcoin_cash":
      return new Bitcoin_CashLogic(config);
    case "near":
      return new NearLogic(config);
    case "hedera":
      return new HederaLogic(config);
    case "ark":
      return new ArkLogic(config);
    case "casper":
      return new CasperLogic(config);
    case "ontology":
      return new OntologyLogic(config);
    case "syscoin":
      return new SyscoinLogic(config);
    default:
    // console.error('Not implemented coinType:', coinType);
    // throw
  }
  return new CoinInterface();
}
