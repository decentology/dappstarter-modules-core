///(import
const t = require('@onflow/types');
const ipfsClient = require('ipfs-http-client');
const bs58 = require('bs58');
///)

class pack_nft {

  ///(functions
  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: PACK NFT  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  /********** Flow Token **********/

  static async mintFlowTokens(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: "0xf8d6e0586b0a20c7",
      }
    },
      'flowtoken_mint_flow_tokens',
      {
        recipient: { value: data.recipient, type: t.Address },
        amount: { value: data.amount, type: t.UFix64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getFlowBalance(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'flowtoken_get_flow_balance',
      {
        account: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  /********** NFT **********/

  static async provisionNFTs(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'nft_provision_nfts'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async transferNFT(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.giver,
      }
    },
      'nft_transfer_nft',
      {
        id: { value: parseInt(data.id), type: t.UInt64 },
        recipient: { value: data.recipient, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getNFTsInCollection(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'nft_get_nfts_in_collection',
      {
        acct: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  static async getNFTInfo(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'nft_get_nft_info',
      {
        acct: { value: data.account, type: t.Address },
        id: { value: parseInt(data.id), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  /********** Packs **********/

  static async provisionPacks(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'packs_provision_packs'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async addPackType(data) {

    let folder = true;
    let config = DappLib.getConfig();

    config.ipfs = {
      host: 'ipfs.infura.io',
      protocol: 'https',
      port: 5001
    }

    // Push files to IPFS
    let ipfsResult = await DappLib.ipfsUpload(config, data.files, folder, (bytes) => {
      console.log(bytes);
    });

    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0]
      }
    },
      'packs_add_pack_type',
      {
        packType: { value: parseInt(data.packType), type: t.UInt64 },
        numberOfNFTs: { value: parseInt(data.numberOfNFTs), type: t.UInt64 },
        ipfsHash: { value: ipfsResult[0].cid.string, type: t.String }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async mintPacks(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0],
      }
    },
      'packs_mint_pack',
      {
        packType: { value: parseInt(data.packType), type: t.UInt64 },
        numberOfPacks: { value: parseInt(data.numberOfPacks), type: t.UInt64 }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async transferPack(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.giver,
      }
    },
      'packs_transfer_pack',
      {
        id: { value: parseInt(data.id), type: t.UInt64 },
        recipient: { value: data.recipient, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async openPack(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0],
      }
    },
      'packs_open_pack',
      {
        id: { value: parseInt(data.id), type: t.UInt64 },
        recipient: { value: data.recipient, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async getPackInfo(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'packs_get_pack_info',
      {
        id: { value: parseInt(data.id), type: t.UInt64 },
        acct: { value: data.acct, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Pack Info',
      result: result.callData
    }
  }

  static async getPackTypeInfo(data) {

    let config = DappLib.getConfig();

    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'packs_get_pack_type_info',
      {
        packType: { value: parseInt(data.packType), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Pack Type Info',
      result: result.callData
    }
  }

  static async getOwnedPacks(data) {
    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'packs_get_owned_packs',
      {
        acct: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Collectible Type',
      result: result.callData
    }
  }

  /********** Marketplace **********/

  static async provisionMarketplace(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.account,
      }
    },
      'marketplace_provision_marketplace'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  static async listPacksForSale(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0],
      }
    },
      "marketplace_list_packs_for_sale",
      {
        ids: { value: [4, 5], type: t.Array(t.UInt64) },
        price: { value: data.price, type: t.UFix64 }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async getPacksAvailable(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: config,
      roles: {
      }
    },
      'marketplace_get_packs_available',
      {
        admin: { value: config.accounts[0], type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'Pack ID | Price',
      result: result.callData
    }
  }

  static async buyPack(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: data.recipient,
      }
    },
      'marketplace_buy_pack',
      {
        id: { value: parseInt(data.id), type: t.UInt64 },
        admin: { value: config.accounts[0], type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }

  /*
    data - an object of key value pairs
    ex. { number: 2, id: 15 }

    types - an object that holds the type of the key 
    and value using the FCL types
    ex. { key: t.String, value: t.Int }
  */
  static formatFlowDictionary(data, types) {
    let newData = []
    let dataKeys = Object.keys(data)

    for (let key of dataKeys) {
      if (types.key.label.includes("Int")) key = parseInt(key)
      else if (types.key == t.Bool) key = (key === 'true');

      if (types.value.label.includes("Int")) data[key] = parseInt(data[key])
      else if (types.value == t.Bool) data[key] = (data[key] === 'true');
      newData.push({ key: key, value: data[key] })
    }
    return { value: newData, type: t.Dictionary(types) }
  }

  /*
    data - an array of values
    ex. ["Hello", "World", "!"]
  
    type - the type of the values using the FCL type
    ex. t.String
  */
  static formatFlowArray(data, type) {
    if (type == t.String) return { value: data, type: t.Array(type) }

    let newData = []
    for (let element of data) {
      if (type.label.includes("Int")) element = parseInt(element)
      else if (type == t.Bool) element = (element === 'true');

      newData.push(element)
    }
    return { value: newData, type: t.Array(type) }
  }

  static async ipfsUpload(config, files, wrapWithDirectory, progressCallback) {

    let results = [];
    if (files.length < 1) {
      return results;
    }
    let ipfs = ipfsClient(config.ipfs);
    let filesToUpload = [];
    files.map((file) => {
      filesToUpload.push({
        path: file.name,
        content: file
      })
    });
    const options = {
      wrapWithDirectory: wrapWithDirectory,
      pin: true,
      progress: progressCallback
    }

    for await (const result of ipfs.add(filesToUpload, options)) {
      if (wrapWithDirectory && result.path !== "") {
        continue;
      }
      results.push(
        Object.assign({}, result, DappLib._decodeMultihash(result.cid.string))
      );
    }

    return results;
  }

  static formatIpfsHash(a) {
    let config = DappLib.getConfig();
    let url = `${config.ipfs.protocol}://${config.ipfs.host}/ipfs/${a}`;
    return `<strong class="teal lighten-5 p-1 black-text number copy-target" title="${url}"><a href="${url}" target="_new">${a.substr(0, 6)}...${a.substr(a.length - 4, 4)}</a></strong>${DappLib.addClippy(a)}`;
  }

  /**
   * Partition multihash string into object representing multihash
   * https://github.com/saurfang/ipfs-multihash-on-solidity/blob/master/src/multihash.js
   */
  static _decodeMultihash(multihash) {
    const decoded = bs58.decode(multihash);

    return {
      digest: `0x${decoded.slice(2).toString('hex')}`,
      hashFunction: decoded[0],
      digestLength: decoded[1],
    };
  }

  ///)

}