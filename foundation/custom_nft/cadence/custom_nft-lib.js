///(import
const t = require('@onflow/types');
const Metadata = require('../contracts/Project/imports/Metadata.js')
///)

class custom_nft {

  ///(functions
  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: COMPOSER  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  static async mintNFT(data) {
    if (data.account) {
      data.recipient = data.account
    }

    let config = DappLib.getConfig();
    let addressOfGenerator = config.accounts[0].replace('0x', '')

    let metadataStruct = Metadata.getCadenceType(data.metaData, addressOfGenerator)

    let result = await Blockchain.post({
      config: config,
      roles: {
        proposer: config.accounts[0],
      }
    },
      'mint_nft',
      {
        recipient: { value: data.recipient, type: t.Address },
        metadata: metadataStruct
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }
  }


  static async provisionAccount(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.account,
      }
    },
      'provision_account'
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async transfer(data) {

    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      roles: {
        proposer: data.accountGiver
      }
    },
      'transfer',
      {
        receiverAddr: { value: data.accountReceiver, type: t.Address },
        withdrawID: { value: parseInt(data.withdrawID), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async readNFTs(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'read_nfts',
      {
        account: { value: data.account, type: t.Address }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'NFT Array',
      result: result.callData
    }

  }

  static async readNFTMetadata(data) {

    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      roles: {
      }
    },
      'read_metadata',
      {
        account: { value: data.account, type: t.Address },
        id: { value: parseInt(data.id), type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_OBJECT,
      label: 'NFT Metadata',
      result: result.callData
    }
  }

  ///)

}