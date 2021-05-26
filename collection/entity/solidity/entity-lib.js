const BN = require("bn.js");

class entity {

///(functions
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COLLECTION: ENTITY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    
        static async getEntity(data) {
            let result = await Blockchain.get({
                    config: DappLib.getConfig(),
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: null
                    }
                },
                'getEntity',
                DappLib.fromAscii(data.id, 32)
            ); 

            if (result.callData) {
                result.callData.title = DappLib.toAscii(result.callData.title);
                result.callData.count = (new BN(result.callData.count)).toString(10);
            }
            return {
                type: DappLib.DAPP_RESULT_OBJECT,
                label: 'Get Entity',
                result: result.callData
            }
        }
        
        static async getEntityCount() {
            let result = await Blockchain.get({
                    config: DappLib.getConfig(),
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: null
                    }
                },
                'getEntityCount'
            ); 
            if (result.callData) {
                result.callData = (new BN(result.callData)).toString(10);
            }
            return {
                type: DappLib.DAPP_RESULT_BIG_NUMBER,
                label: 'Get Entity Count',
                result: result.callData
            }
        }

        static async getEntitiesByCreator(data) {
            let result = await Blockchain.get({
                    config: DappLib.getConfig(),
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: null
                    }
                },
                'getEntitiesByCreator',
                data.account
            );

            let resultArray = [];
            if (result.callData && Array.isArray(result.callData)) {
                result.callData.forEach((item) => {
                    resultArray.push(DappLib.toAscii(item));
                });
            }
            return {
                type: DappLib.DAPP_RESULT_ARRAY,
                label: 'Entities',
                result: resultArray,
                formatter: ['Text-20-5'] 
            }
        }

        static async getEntitiesByPage(data) {
            let result = await Blockchain.get({
                config: DappLib.getConfig(),
                contract: DappLib.DAPP_STATE_CONTRACT,
                params: {
                    from: null
                }
            },
            'getEntitiesByPage',
            data.page,
            data.resultsPerPage
            );

            let resultArray = [];
            result.callData.forEach((item) => {
                if(item != "0x0000000000000000000000000000000000000000000000000000000000000000"){
                    resultArray.push(item);
                };
            });

            return {
                type: DappLib.DAPP_RESULT_ARRAY,
                label: 'Entities By Page',
                result: resultArray,
                formatter: ['Text-20-5']
            }

        }
    
    
        static async setEntity(data) {
            let id = data.id ? data.id : DappLib.getUniqueId();
            let result = await Blockchain.post({
                    config: DappLib.getConfig(),
                    contract: DappLib.DAPP_STATE_CONTRACT,
                    params: {
                        from: data.from,
                        gas: 2000000
                    }
                },
                'setEntity',
                DappLib.fromAscii(id, 32),
                DappLib.fromAscii(data.title, 32),
                new BN(data.count)
            );
            return {
                type: DappLib.DAPP_RESULT_OBJECT,
                label: 'Transaction Hash',
                result: {
                    transactionHash: DappLib.getTransactionHash(result.callData),
                    id: id
                },
                hint: `Verify Entity was added by using "Get Entity."`
            }
        }
///)
        static serverEvent() {
///(server-event
    /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> COLLECTION: ENTITY  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/
    // DappLib.onApproval((result) => {
    //         console.log(result);
    // });
    
    // DappLib.onTransfer((result) => {
    //     console.log(result);
    // });
///)
        }
    }