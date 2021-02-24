///(import
const t = require('@onflow/types');
///)

class nft_composer {

  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: COMPOSER  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  //TODO: Add NFT Composer library functions

  ///(functions:language:cadence
  static async mintNFT(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: config,
      imports: {
        DappState: config.contracts.DappState
      },
      roles: {
        proposer: config.contracts.DappState,
      }
    },
      'mint_nft',
      {
        recipient: { value: data.recipient, type: t.Address },
      }
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async provisionAccount(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      imports: {
        DappState: config.contracts.DappState
      },
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

    let config = DappLib.getConfig();
    let nftToGiveInt = parseInt(data.nftToGive)
    let result = await Blockchain.post({
      config: DappLib.getConfig(),
      imports: {
        DappState: config.contracts.DappState
      },
      roles: {
        proposer: data.accountGiver
      }
    },
      'transfer',
      {
        receiverAddr: { value: data.accountReceiver, type: t.Address },
        withdrawID: { value: nftToGiveInt, type: t.UInt64 }
      }
    );

    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: 'Transaction Hash',
      result: result.callData.transactionId
    }

  }

  static async readNFTs(data) {

    let config = DappLib.getConfig();
    let result = await Blockchain.get({
      config: DappLib.getConfig(),
      imports: {
        DappState: config.contracts.DappState
      },
      roles: {
      }
    },
      'read_nfts',
      {
        accountAddr: { value: data.account, type: t.Address }
      }
    );
    console.log("Tokens...", result)
    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'NFT Array',
      result: result.callData
    }

  }


  ///)

  ///(functions:language:solidity
  static async safeTransferFrom(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "safeTransferFrom",
      data.from,
      data.to,
      data.id,
      data.value,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData),
      hint: `Verify transfer by using "Balance for Account" to check the balance of ${DappLib.formatAccount(
        data.to
      )}.`,
    };
  }

  static async safeBatchTransferFrom(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "safeBatchTransferFrom",
      data.from,
      data.to,
      data.ids,
      data.values,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async balanceOf(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "balanceOf",
      data.owner,
      data.id
    );
    let balance = result.callData;
    return {
      type: DappLib.DAPP_RESULT_BIG_NUMBER,
      label: DappLib.formatAccount(result.callAccount) + " Account Balance",
      result: new BN(balance),
      unitResult: await DappLib._fromSmallestUnit(balance, data),
      hint: null,
    };
  }

  static async balanceOfBatch(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "balanceOfBatch",
      data.owners,
      data.ids
    );
    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Batch balances',
      result: result.callData,
      formatter: ['Text-20-5']
    }
  }

  static async setApprovalForAll(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "setApprovalForAll",
      data.operator,
      data.approved
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async isApprovedForAll(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "isApprovedForAll",
      data.owner,
      data.operator
    );
    return {
      type: DappLib.DAPP_RESULT_BOOLEAN,
      label: "Is approved for all",
      result: result.callData,
      hint: null,
    };
  }
  ///)
}