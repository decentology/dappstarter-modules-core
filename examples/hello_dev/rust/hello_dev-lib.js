const BN = require("bn.js");

class hellodev {



///(functions
      /*>>>>>>>>>>>>>>>>>>>>>>>>>>> EXAMPLES: HELLO DEV  <<<<<<<<<<<<<<<<<<<<<<<<<<*/
    
        static async countHellos(data) {
            let config = DappLib.getConfig();

            let result = await Blockchain.get({ config }, 'greeting');

            return {
                type: DappLib.DAPP_RESULT_BIG_NUMBER,
                label: 'Get Hello Count',
                result: result.callData.numGreets
            }
        }
        
        static async sayHello() {

            let config = DappLib.getConfig();

            let result = await Blockchain.put({ config }, 'greeting', Buffer.alloc(0));
            return {
                type: DappLib.DAPP_RESULT_OBJECT,
                label: 'Transaction Result',
                result                
            }
        }
///)
        static serverEvent() {
///(server-event
///)
        }
    }