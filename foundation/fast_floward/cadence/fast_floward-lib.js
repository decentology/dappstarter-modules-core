///(import
const t = require('@onflow/types');
///)

class kitty_items {

  ///(functions

  /********** KIBBLE **********/

  // kibbleSetupAccount
  // calls transactions/kibble/setup_account.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
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

  // kibbleMintTokens
  // calls transactions/kibble/mint_tokens.cdc
  //
  // signer/proposer/authorizer: config.accounts[0]
  //
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

  // kibbleTransferTokens
  // calls transactions/kibble/transfer_tokens.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
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
        recipient: { value: data.recipient, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  // kibbleGetBalance
  // calls scripts/kibble/get_balance.cdc
  //
  // signer/proposer/authorizer: none
  //
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

  // kibbleGetSupply
  // calls scripts/kibble/get_supply.cdc
  //
  // signer/proposer/authorizer: none
  //
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

  // kittyItemsSetupAccount
  // calls transactions/kittyitems/setup_account.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  static async kittyItemsSetupAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitems_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  // TODO: kittyItemsMintKittyItem
  // calls transactions/kittyitems/mint_kitty_item.cdc
  // 
  // signer/proposer/authorizer: config.accounts[0]
  //
  // Note: mint_kitty_item.cdc takes in 2 parameters:
  // 1) recipient
  // 2) typeID
  // 
  // Note #2: the proposer is always `config.accounts[0]`
  // because that is the only account with the NFTMinter Resource
  //
  static async kittyItemsMintKittyItem(data) {

  }

  // TODO: kittyItemsTransferKittyItem
  // calls transactions/kittyitems/transfer_kitty_item.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  // Note: transfer_kitty_item.cdc takes in 2 parameters:
  // 1) recipient
  // 2) withdrawID
  //
  static async kittyItemsTransferKittyItem(data) {

  }

  // TODO: kittyItemsReadCollectionIDs
  // calls scripts/kittyitems/read_collection_ids.cdc
  //
  // signer/proposer/authorizer: none
  //
  // Note #1: there is no proposer here because it is
  // a script, not a transaction
  //
  // Note #2: the return type should be DAPP_RESULT_ARRAY
  //
  static async kittyItemsReadCollectionIDs(data) {

  }

  // kittyItemsReadCollectionLength
  // calls scripts/kittyitems/read_collection_length.cdc
  //
  // signer/proposer/authorizer: none
  //
  static async kittyItemsReadCollectionLength(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitems_read_collection_length',
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

  // kittyItemsReadKittyItemTypeID
  // calls scripts/kittyitems/read_kitty_item_type_id.cdc
  //
  // signer/proposer/authorizer: none
  //
  static async kittyItemsReadKittyItemTypeID(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitems_read_kitty_item_type_id',
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

  // kittyItemsReadKittyItemsSupply
  // calls scripts/kittyitems/read_kitty_items_supply.cdc
  //
  // signer/proposer/authorizer: none
  //
  static async kittyItemsReadKittyItemsSupply(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitems_read_kitty_items_supply'
    );

    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: 'Kitty Items Supply',
      result: result.callData
    }
  }

  /********** MARKET **********/

  // kittyItemsMarketSetupAccount
  // calls transactions/kittyitemsmarket/setup_account.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  static async kittyItemsMarketSetupAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitemsmarket_setup_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  // kittyItemsMarketBuyMarketItem
  // calls transactions/kittyitemsmarket/buy_market_item.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  static async kittyItemsMarketBuyMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitemsmarket_buy_market_item',
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

  // kittyItemsMarketRemoveMarketItem
  // calls transactions/kittyitemsmarket/remove_market_item.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  static async kittyItemsMarketRemoveMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitemsmarket_remove_market_item',
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

  // kittyItemsMarketSellMarketItem
  // calls transactions/kittyitemsmarket/sell_market_item.cdc
  //
  // signer/proposer/authorizer: data.signer
  //
  static async kittyItemsMarketSellMarketItem(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.signer
      }
    },
      'kittyitemsmarket_sell_market_item',
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

  // kittyItemsMarketReadSaleCollectionIDs
  // calls scripts/kittyitemsmarket/read_collection_ids.cdc
  //
  // signer/proposer/authorizer: none
  //
  static async kittyItemsMarketReadSaleCollectionIDs(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitemsmarket_read_collection_ids',
      {
        marketCollectionAddress: { value: data.marketCollectionAddress, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Market Collection IDs',
      result: result.callData
    }

  }

  // kittyItemsMarketReadSaleCollectionLength
  // calls scripts/kittyitemsmarket/read_collection_length.cdc
  //
  // signer/proposer/authorizer: none
  //
  static async kittyItemsMarketReadSaleCollectionLength(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'kittyitemsmarket_read_collection_length',
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