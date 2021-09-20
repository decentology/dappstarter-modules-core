///(import
const ipfsClient = require('ipfs-http-client');
const bs58 = require('bs58');
const t = require('@onflow/types');
///)

class ballot {

    ///(functions
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> VOTING: BALLOT  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

    static async initializeProposals(data) {

        let folder = false;
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

        let proposals = [];
        for (let f = 0; f < ipfsResult.length; f++) {
            let file = ipfsResult[f];
            console.log('IPFS file', file);
            proposals.push(file.cid.string);
        }

        let result = await Blockchain.post({
            config: config,
            roles: {
                proposer: data.admin,
            }
        },
            'ballot_initialize_proposals',
            {
                proposals: { value: proposals, type: t.Array(t.String) }
            }
        );
        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    static async issueBallot(data) {

        let result = await Blockchain.post({
            config: DappLib.getConfig(),
            roles: {
                proposer: data.admin,
                authorizers: [data.admin, data.voter]
            }
        },
            'ballot_issue_ballot'
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }


    static async vote(data) {

        let result = await Blockchain.post({
            config: DappLib.getConfig(),
            roles: {
                proposer: data.voter
            }
        },
            'ballot_vote',
            {
                proposalVote: { value: parseInt(data.proposalIndex), type: t.Int }
            }
        );

        return {
            type: DappLib.DAPP_RESULT_TX_HASH,
            label: 'Transaction Hash',
            result: result.callData.transactionId
        }

    }

    static async getProposalList(data) {

        let result = await Blockchain.get({
            config: DappLib.getConfig(),
            roles: {
            }
        },
            'ballot_proposal_list'
        );

        return {
            type: DappLib.DAPP_RESULT_ARRAY,
            label: 'Proposals',
            result: result.callData,
            formatter: ['Text-20-5']
        }
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

    ///)
}