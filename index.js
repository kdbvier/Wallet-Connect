// import { coinFactory } from "./logicFactory";
// import addressList from "./address";

// async function testBalance() {
//   const chain = "ontology";
//   const network = "testnet";
//   const chainName = "ontology";
//   console.log(`Chain ${chain}`);

//   const address = addressList[chain];
//   let coinLogic = coinFactory(chainName, { network });

//   const networkList = await coinLogic.getNetworksList();
//   console.log(`Network List: ${networkList.map((net) => `${net.text}`)}`);

//   const currentNetwork = await coinLogic.getCurrentNetwork();
//   console.log(`Current Network: ${currentNetwork}`);

//   const balance = await coinLogic.getBalance(address.senderPubKey);

//   console.log(`Address ${address.senderPubKey}, balance: ${balance}`);

//   const result = await coinLogic.transferFunds(
//     address.senderPubKey,
//     address.senderPrivKey,
//     address.receiverPubKey,
//     10
//   );

//   console.log(`Transaction: ${result}`);
// }

// testBalance();

/*
  Create an HDNode wallet using RVNBOX. The mnemonic from this wallet
  will be used in future examples.
*/

import rvnboxLib from "rvnbox-sdk/lib/rvnbox-sdk";
const RVNBOXSDK = require(rvnboxLib).default;
const RVNBOX = new RVNBOXSDK({ restURL: "http://trest.ravencoin.online/v2/" });

const fs = require("fs");

const lang = "english"; // Set the language of the wallet.

// These objects used for writing wallet information out to a file.
let outStr = "";
const outObj = {};

// create 256 bit BIP39 mnemonic
const mnemonic = RVNBOXSDK.Mnemonic.generate(
  256,
  RVNBOXSDK.Mnemonic.wordLists()[lang]
);
console.log("BIP44 $RVN Wallet");
outStr += "BIP44 $RVN Wallet\n";
console.log(`256 bit ${lang} BIP39 Mnemonic: `, mnemonic);
outStr += `\n256 bit ${lang} BIP32 Mnemonic:\n${mnemonic}\n\n`;
outObj.mnemonic = mnemonic;

// root seed buffer
const rootSeed = RVNBOXSDK.Mnemonic.toSeed(mnemonic);

// master HDNode
const masterHDNode = RVNBOXSDK.HDNode.fromSeed(rootSeed, "testnet");

// HDNode of BIP44 account
console.log(`BIP44 Account: "m/44'/145'/0'"`);
outStr += `BIP44 Account: "m/44'/145'/0'"\n`;

// Generate the first 10 seed addresses.
for (let i = 0; i < 10; i++) {
  const childNode = masterHDNode.derivePath(`m/44'/145'/0'/0/${i}`);
  console.log(`m/44'/145'/0'/0/${i}: ${RVNBOXSDK.HDNode.toAddress(childNode)}`);
  outStr += `m/44'/145'/0'/0/${i}: ${RVNBOXSDK.HDNode.toAddress(childNode)}\n`;

  // Save the first seed address for use in the .json output file.
  if (i === 0) {
    outObj.Address = RVNBOXSDK.HDNode.toAddress(childNode);
    outObj.legacyAddress = RVNBOXSDK.HDNode.toLegacyAddress(childNode);
  }
}

// Write the extended wallet information into a text file.
fs.writeFile("wallet-info.txt", outStr, function (err) {
  if (err) return console.error(err);

  console.log(`wallet-info.txt written successfully.`);
});

// Write out the basic information into a json file for other example apps to use.
fs.writeFile("wallet.json", JSON.stringify(outObj, null, 2), function (err) {
  if (err) return console.error(err);
  console.log(`wallet.json written successfully.`);
});
