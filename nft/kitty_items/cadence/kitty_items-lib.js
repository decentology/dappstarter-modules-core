///(import
const t = require('@onflow/types');
///)

class kitty_items {

  ///(functions

  /********** KIBBLE **********/

  static async kibbleMintTokens(data) {

    let config = DappLib.getConfig()
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0]
      }
    },
      'kibble_mint_tokens',
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


  static async kibbleSetupAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kibble_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async kibbleTransferTokens(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kibble_transfer_tokens',
      {
        amount: { value: data.amount, type: t.UFix64 },
        to: { value: data.to, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async kibbleGetBalance(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kibble_get_balance',
      {
        address: { value: data.address, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kibble Balance',
      result: result.callData
    }

  }

  static async kibbleGetSupply(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kibble_get_supply'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kibble Supply',
      result: result.callData
    }
  }

  /********** KITTY ITEMS **********/

  static async kittyItemsMintKittyItem(data) {
    let config = DappLib.getConfig()
    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0]
      }
    },
      'kittyitem_mint_kitty_item',
      {
        recipient: { value: data.recipient, type: t.Address },
        typeID: { value: parseInt(data.typeID), type: t.UInt64 }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }


  static async kittyItemsSetupAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitem_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async kittyItemsTransferKittyItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitem_transfer_kitty_item',
      {
        recipient: { value: data.recipient, type: t.Address },
        withdrawID: { value: parseInt(data.withdrawID), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async kittyItemsReadCollectionIDs(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitem_read_collection_ids',
      {
        address: { value: data.address, type: t.Address }
      }
    );
    console.log("Tokens...", result)
    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Kitty Items IDs',
      result: result.callData
    }

  }

  static async kittyItemsReadCollectionLength(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitem_read_collection_length',
      {
        address: { value: data.address, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kitty Items Collection Length',
      result: result.callData
    }
  }

  static async kittyItemsReadKittyItemTypeID(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitem_read_kitty_item_type_id',
      {
        address: { value: data.address, type: t.Address },
        itemID: { value: parseInt(data.itemID), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kitty Items Type ID',
      result: result.callData
    }
  }

  static async kittyItemsReadKittyItemsSupply(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitem_read_kitty_items_supply'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kitty Items Supply',
      result: result.callData
    }
  }

  /********** MARKET **********/

  static async marketBuyMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'market_buy_market_item',
      {
        itemID: { value: parseInt(data.itemID), type: t.UInt64 },
        marketCollectionAddress: { value: data.marketCollectionAddress, type: t.Address }
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }


  static async marketRemoveMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'market_remove_market_item',
      {
        itemID: { value: parseInt(data.itemID), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async marketSellMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'market_sell_market_item',
      {
        itemID: { value: parseInt(data.itemID), type: t.UInt64 },
        price: { value: data.price, type: t.UFix64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async marketSetupAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'market_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async marketReadCollectionIDs(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'market_read_collection_ids',
      {
        address: { value: data.address, type: t.Address }
      }
    );
    console.log("Tokens...", result)
    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Market Collection IDs',
      result: result.callData
    }

  }

  static async marketReadCollectionLength(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'market_read_collection_length',
      {
        marketCollectionAddress: { value: data.marketCollectionAddress, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Market Collection Length',
      result: result.callData
    }
  }

  ///)

}