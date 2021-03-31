///(import:language:cadence
const t = require('@onflow/types');
///)

class nft_studio {

///(functions
  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: COMPOSER  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
///)

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
  static async getURI(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "getURI",
      data.id
    );
    return {
      type: DappLib.DAPP_RESULT_STRING,
      label: "Result is",
      result: result.callData,
      hint: null,
    };
  }

  static async supportsInterface(data) {
    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "supportsInterface",
      data.interfaceId
    );
    return {
      type: DappLib.DAPP_RESULT_BOOLEAN,
      label: "Is supported",
      result: result.callData,
      hint: null,
    };
  }

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
      data.amount,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData),
      raw: result.callData,
      hint: `Verify transfer by using "Balance for Account" to check the balance of ${DappLib.formatAccount(
        data.to
      )}.`,
    };
  }

  static async safeBatchTransferFrom(data) {
    let idsArray = [data.id1, data.id2, data.id3];
    let amountsArray = [data.amount1, data.amount2, data.amount3];

    if (typeof data.ids === "undefined") {
      data.ids = idsArray;
    }

    if (typeof data.amounts === "undefined") {
      data.amounts = amountsArray;
    }

    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
          gas: 2000000
        },
      },
      "safeBatchTransferFrom",
      data.from,
      data.to,
      data.ids,
      data.amounts,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      raw: result.callData,
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
      data.account,
      data.id
    );
    let balance = result.callData;
    return {
      type: DappLib.DAPP_RESULT_STRING,
      label: "Result is",
      result: result.callData,
      hint: null,
    };
  }

  static async balanceOfBatch(data) {
    let accountsArray = [data.account1, data.account2, data.account3];
    let idsArray = [data.id1, data.id2, data.id3];

    if (typeof data.ids === "undefined") {
      data.ids = idsArray;
    }

    if (typeof data.accounts === "undefined") {
      data.accounts = accountsArray;
    }

    let result = await Blockchain.get(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.from,
        },
      },
      "balanceOfBatch",
      data.accounts,
      data.ids
    );
    return {
      type: DappLib.DAPP_RESULT_ARRAY,
      label: 'Batch balances',
      result: result.callData
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
      raw: result.callData,
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
      data.account,
      data.operator
    );
    return {
      type: DappLib.DAPP_RESULT_BOOLEAN,
      label: "Is approved for all",
      result: result.callData,
      hint: null,
    };
  }

  static async setURI(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "setURI",
      data.newURI
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async mint(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "mint",
      data.account,
      data.id,
      data.amount,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      raw: result.callData,
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async mintBatch(data) {

    let idsArray = [data.id1, data.id2, data.id3];
    let amountsArray = [data.amount1, data.amount2, data.amount3];

    if (typeof data.ids === "undefined") {
      data.ids = idsArray;
    }

    if (typeof data.amounts === "undefined") {
      data.amounts= amountsArray;
    }

    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
          gas: 2000000
        },
      },
      "mintBatch",
      data.account,
      data.ids,
      data.amounts,
      data.data
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      raw: result.callData,
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async burn(data) {
    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
        },
      },
      "burn",
      data.account,
      data.id,
      data.amount
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      raw: result.callData,
      result: DappLib.getTransactionHash(result.callData)
    };
  }

  static async burnBatch(data) {
    let idsArray = [data.id1, data.id2, data.id3];
    let amountsArray = [data.amount1, data.amount2, data.amount3];

    if (typeof data.ids === "undefined") {
      data.ids = idsArray;
    }

    if (typeof data.amounts === "undefined") {
      data.amounts = amountsArray;
    }

    let result = await Blockchain.post(
      {
        config: DappLib.getConfig(),
        contract: DappLib.DAPP_STATE_CONTRACT,
        params: {
          from: data.authorized,
          gas: 2000000
        },
      },
      "burnBatch",
      data.account,
      data.ids,
      data.amounts
    );
    return {
      type: DappLib.DAPP_RESULT_TX_HASH,
      label: "Transaction Hash",
      raw: result.callData,
      result: DappLib.getTransactionHash(result.callData)
    };
  }
  ///)
}