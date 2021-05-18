///(import

const bs58 = require('bs58');
const { Solana } = require('./solana');
const { Token, TOKEN_PROGRAM_ID } = require('@solana/spl-token');

///)
class token {

///(functions
  /*>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> ASSET VALUE TRACKING: TOKEN  <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<*/

  // Source: https://github.com/solana-labs/solana-program-library/blob/8555f2d2226d318aa6b78eb8c8fdef8984a15dac/token/js/client/token.js#L383
  static async createFT(data) {
    // Required Properties:
    //      data.mintAuthority
    //      data.freezeAuthority
    //      data.decimals          

    let config = DappLib.getConfig();
    let solana = new Solana(config);

    // Explicitly make each parameter a variable to make debugging easier
    let payer = Solana.getSigningAccount(bs58.decode(config.programInfo.programAccounts['payer'].privateKey));
    let mintAuthority = Solana.getPublicKey(data.mintAuthority); 
    let freezeAuthority = null;
    let decimals = parseInt(data.decimals) || 10;

    let token = await Token.createMint(
                                        solana.connection,
                                        payer,
                                        mintAuthority,
                                        freezeAuthority,
                                        decimals,
                                        TOKEN_PROGRAM_ID
                                    );
  let network = config.httpUri.indexOf('devnet') ? 'devnet' : 'mainnet';
  return {
        type: DappLib.DAPP_RESULT_OBJECT,
        label: 'Token PublicKey',
        result: {
          publicKey: token.publicKey.toString(),
          explorer: `<a href="https://explorer.solana.com/address/${token.publicKey.toString()}?cluster=${network}" target="_new" style="text-decoration:underline;">View Address</a>`
        }
    }
  }
  
  // Source: https://github.com/solana-labs/solana-program-library/blob/26560daae234bc3e00c08a2f2c8d81d1c2f41498/token/js/client/token.js#L1026
  static async mintFT(data) {
    // Required Properties:
    //      data.mintAuthority
    //      data.tokenAccount
    //      data.recipientAccount
    //      data.amount          

    let config = DappLib.getConfig();
    let solana = new Solana(config);

    // Explicitly make each parameter a variable to make debugging easier
    let payer = Solana.getSigningAccount(bs58.decode(config.programInfo.programAccounts['payer'].privateKey));
    let tokenPublicKey = Solana.getPublicKey(data.tokenAccount);
    let signingAccount = config.wallets.find(w => w.publicKey === data.mintAuthority);
    if (signingAccount.length === 0) {
        throw 'Invalid Mint Authority';
    }
    let authority =  Solana.getSigningAccount(bs58.decode(signingAccount.privateKey)); 
    let recipientPublicKey = Solana.getPublicKey(data.recipientAccount);
    let amount = parseInt(data.amount) || 1000; 
    
    let token = new Token(
                            solana.connection, 
                            tokenPublicKey,
                            TOKEN_PROGRAM_ID,
                            payer);

    await token.mintTo(
                          recipientPublicKey,
                          authority,
                          [],
                          amount
                      );

    let network = config.httpUri.indexOf('devnet') ? 'devnet' : 'mainnet';
    return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Token PublicKey',
          result: {
            token: tokenPublicKey.toString(),
            explorer: `<a href="https://explorer.solana.com/address/${recipientPublicKey.toString()}?cluster=${network}" target="_new" style="text-decoration:underline;">View Address</a>`
          }
      }
    }


    static async getCounter(data) {
      let config = DappLib.getConfig();

      let result = await Blockchain.get({ config }, 'counter');

      return {
          type: DappLib.DAPP_RESULT_BIG_NUMBER,
          label: 'Get Counter',
          result: result.callData.sampleCounter
        }
    }
    
    static async incrementCounter() {

      let config = DappLib.getConfig();

      let result = await Blockchain.put({ config }, 'counter', Buffer.alloc(0));
      return {
          type: DappLib.DAPP_RESULT_OBJECT,
          label: 'Transaction Result',
          result                
      }
    }

///)

}
