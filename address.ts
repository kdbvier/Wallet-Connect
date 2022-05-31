const addressList = {
  evmBased: {
    senderPubKey: "0x4E79CE57e980B059584f6a85206236327056DB06",
    senderPrivKey:
      "3a3ecc2e84bbd5f882e28c39465417071273b2ff4ee2d1d0e539a7009b2946d4",
    receiverPubKey: "0xe600696EB0555c93f2C391a1406726CeE239091D",
  },
  solana: {
    senderPubKey: "8ATKQkJVLjAKwZqZx679V3hffTHA4399bAva5m1x3XyS",
    senderPrivKey:
      "53gQpdNDDVCkoiT8QZ6oHsjQFYe6b7qGGM59dT57s3RbRUwnLJkFwsiuwTJX5HbYzxnFmYsuxsCGEcte5MR8ysGc",
    receiverPubKey: "GoNFprQFKZWevbcTnhUX2rAsk757HzXXhCbVFd5MB8ZD",
  },
  xrp: {
    senderPubKey: "rE4BngDcBCfroDVcg6U9WKrjBvkzjRPBp9",
    senderPrivKey: "shAQ8KcRM4qqFaipVBfBNhYFqLe4U",
    receiverPubKey: "rs4pS61bHXcLviwFDWu65zYYMMMgP1LFJE",
  },
  polkadot: {
    senderPubKey: "5DTestUPts3kjeXSTMyerHihn1uwMfLj8vU8sqF7qYrFabHE",
    senderPrivKey: "",
    receiverPubKey: "5Cqji54VJ8Purp47sECHfyiEVLTym6SJjmP4sRYXiMR2JgFy",
  },
  terra: {
    senderPubKey: "terra1lgngqzhttedxfsl4espm6jmkrvxx4yx0q22u05",
    senderPrivKey:
      "rib common health scrub since thank present scheme oyster robust arctic napkin scorpion weird soap verify ill record blind stumble tragic note mask combine",
    receiverPubKey: "terra12jfcp2tjhgydk7hnvhvp4tvz43ppz29c766shw",
  },
  dogecoin: {
    senderPubKey: "nbZWb6gC6YayrAEaTmscKBcL38TafTmipW",
    senderPrivKey: "chA84XrcqNRkV7kyfireZzwMRjYT6tfeNLU8s3P6uan9YiLHZr11",
    receiverPubKey: "2MtF65ZhrkqsHsNoFtA91e1AdveqXLMvS5M",
  },
  tron: {
    // senderPubKey: "TTSFjEG3Lu9WkHdp4JrWYhbGP6K1REqnGQ",
    senderPubKey: "TPZH51qpMTHbsMD2cbZ76en42sxDCYX7qq",
    senderPrivKey:
      "4c8e9c88802844ac3455c096d9441edb778fdfb1c0b39eeff1c819d1824af146",
    receiverPubKey: "TK3U64Gye5gFwhhVUs3gnxPjFGnRH2g2Yc",
  },
  stellar: {
    senderPubKey: "GARMCYGHOS6ILG5CQSP7GFFOJ6TKSANGBTWVAIMXTK2WKGBM564HZLZ4",
    senderPrivKey: "SCOSZ3LNH5TBI5HVX6FBHUPVEDYUMPTMFADCZ46VYZRLROUOXKTUAR76",
    receiverPubKey: "GARMCYGHOS6ILG5CQSP7GFFOJ6TKSANGBTWVAIMXTK2WKGBM564HZLZ4",
  },
  vechain: {
    senderPubKey: "0x269a9EE5910Efc19564280a59Ac9Dd811507333F",
    senderPrivKey:
      "fall acid barely tenant market twin you cat gather knee remind patrol",
    receiverPubKey: "0x7a5947496c27def807e28B1ca54aF1a6235b4BD5",
  },
  litecoin: {
    senderPubKey: "mpmH2qZAVQw2TJtjqdakSM3fajWe9fmoWT",
    senderPrivKey: "cMrSspYCFJBzZ2PNETpxDUHp1JkkcCo5W76CdWZsenuYgsbrWR87",
    receiverPubKey: "moDNtbPSHMxqYDJEj6S6iHj1y7gZyMj1cD",
  },
  dash: {
    senderPubKey: "yfxpdxenPHxuDr9NJNE7zVW2FysVbffhH8",
    senderPrivKey: "cQL7KTF9Tr4XaBDaeGmJxRyFCiw3ur55hxy3yiAZ8ZoEFFEaTkea",
    receiverPubKey: "yjEh1sFTZDehL7VHh6NoixmxA5K9ZbH3PZ",
  },
  zilliqa: {
    senderPubKey: "zil1ypcpzhhj37e23kquwweyan8sv0kn8qaahnyu28",
    senderPrivKey: "cQL7KTF9Tr4XaBDaeGmJxRyFCiw3ur55hxy3yiAZ8ZoEFFEaTkea",
    receiverPubKey: "yjEh1sFTZDehL7VHh6NoixmxA5K9ZbH3PZ",
  },
  bitcoin_cash: {
    senderPubKey: "mnusDv1vr4R2dHxDPsj5m5X728e8PVwqBG",
    senderPrivKey: "cV9YzdRiNf4o3o1fYy7VzaPoG1cUWYKzwhZ6N3EM2oU3wvLkqXpY",
    receiverPubKey: "mxXkfKjTZozsXaqbHjSHtZiLzwyFGX81ZM",
  },
  near: {
    senderPubKey: "test123fds.testnet",
    senderPrivKey:
      "5eVGgQW2UmVTBvu7HUnLBQ5vpapiTuQqBCSE6M5SgwHGTEsyKGoYwVyHf9w6s1DENWrwhiQrpkEM96TsN4WLmdTG",
    receiverPubKey: "test123.testnet",
  },
  hedera: {
    senderPubKey: "0.0.30846648",
    senderPrivKey:
      "302e020100300506032b657004220420a2c6f98dac48bdb2875174f06349dc30f37e5e0bd2508c0c3af77c1e873b14e9",
    receiverPubKey: "0.0.30846714",
  },
  ark: {
    senderPubKey: "0.0.30846648",
    senderPrivKey:
      "302e020100300506032b657004220420a2c6f98dac48bdb2875174f06349dc30f37e5e0bd2508c0c3af77c1e873b14e9",
    receiverPubKey: "0.0.30846714",
  },
  casper: {
    senderPubKey:
      "014f7d2856c315307e519e1923a091915466377bc513c4f8874a3a288b2ab825ac",
    senderPrivKey:
      "MC4CAQAwBQYDK2VwBCIEIDVaRcLgFVARbXc3Zhtme+UCCD4UkXG0mydgkFEhAmNb",
    receiverPubKey:
      "01b835431be41f14ed163660bdc3dc31977cf8742ba91ecd0143fceb12303044f9",
  },
  ontology: {
    senderPubKey: "AdEBQB8GMGnEoTGs15bE2UPPfRSztCtedA",
    senderPrivKey:
      "d70b46823e726659134477d5ee6fd5e3f6a4a235bd9bf7715ddf97c36db74812",
    receiverPubKey: "AHJvuuq7F3xjbVLFy4AMjCUV8GEgjkTJuT",
  },
};

export default addressList;
