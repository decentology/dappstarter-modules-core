///(import
const t = require('@onflow/types');
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

  static async mintNFTs(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0],
      }
    },
      'nft_mint_nft',
      {
        numberOfNFTs: { value: parseInt(data.numberOfNFTs), type: t.UInt64 }
      }
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

    let config = DappLib.getConfig();

    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0]
      }
    },
      'packs_add_pack_type',
      {
        packType: { value: parseInt(data.packType), type: t.UInt64 },
        numberOfNFTs: { value: parseInt(data.numberOfNFTs), type: t.UInt64 }
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

  ///)

}