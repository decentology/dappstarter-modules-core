///(import
const fcl = require('@onflow/fcl');
const t = require('@onflow/types');
///)

class basic_nft {

    ///(functions
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> NFT: BASIC  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    /*>>>>> TRANSACTIONS <<<<<*/
    static async setupAccount(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
            config: config,
            roles: {
                proposer: data.acct,
            }
        },
            'setup_account'
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }
    }

    static async mintNFT(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.post({
            config: config,
            roles: {
                proposer: config.accounts[0],
            }
        },
            'mint_nft',
            {
                recipient: { value: data.recipient, type: t.Address }
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
                proposer: data.acct,
            }
        },
            'transfer_nft',
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

    /*>>>>> SCRIPTS <<<<<*/
    static async readCollectionIDs(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
            config: config,
            roles: {
            }
        },
            'read_collection_ids',
            {
                account: { value: data.account, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'Collection IDs',
            result: result.callData
        }
    }

    static async readCollectionLength(data) {

        let config = DappLib.getConfig();
        let result = await Blockchain.get({
            config: config,
            roles: {
            }
        },
            'read_collection_length',
            {
                account: { value: data.account, type: t.Address }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_BIG_NUMBER,
            label: 'Collection Length',
            result: result.callData
        }
    }

    ///)
}