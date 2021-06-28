const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');

describe('Flow Dapp Tests', async () => {

    let config = null;
    before('setup contract', async () => {
        // Setup tasks for tests
        config = DappLib.getConfig();
    });

    beforeEach(done => setTimeout(done, 500));

    describe('Custom NFT', async () => {

        it(`provision two accounts`, async () => {
            let testData1 = {
                account: config.accounts[1]
            }

            let testData2 = {
                account: config.accounts[2]
            }

            await DappLib.provisionAccount(testData1);
            await DappLib.provisionAccount(testData2);
        });

        it(`no initial NFTs user`, async () => {
            let testData = {
                account: config.accounts[1]
            }
            let res = await DappLib.readNFTs(testData);
            assert.equal(res.result.length, 0, "Account provisioned incorrectly");
        });

        it(`can mint nft into account`, async () => {
            let testData = {
                recipient: config.accounts[1],
                metaData: { serial: "3" }
            }
            await DappLib.mintNFT(testData);
        });

        it(`has the nft`, async () => {
            let testData = {
                account: config.accounts[1]
            }
            let res = await DappLib.readNFTs(testData);

            assert.equal(res.result.length, 1, "Admin did not mint correctly or into the right account");
            assert.equal(res.result[0], 0, "Minted NFT has the wrong ID");
        });

        it(`has correct metadata`, async () => {
            let testData = {
                account: config.accounts[1],
                id: "0"
            }
            let res = await DappLib.readNFTMetadata(testData);

            assert.equal(res.result.serial, 3, "Metadata is incorrect");
        });

        it(`account 1 has 1 nft, account 2 has 0 nft`, async () => {
            let testData1 = {
                account: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[2]
            }

            let res1 = await DappLib.readNFTs(testData1);
            let res2 = await DappLib.readNFTs(testData2);

            assert.equal(res1.result.length, 1, "Account has wrong number of NFTs");
            assert.equal(res2.result.length, 0, "Account has wrong number of NFTs");

        });

        it(`transfer nft`, async () => {
            let testData = {
                accountGiver: config.accounts[1],
                accountReceiver: config.accounts[2],
                withdrawID: "0"
            }
            await DappLib.transfer(testData);
        });

        it(`account 1 has 0 nft, account 2 has 1 nft`, async () => {
            let testData1 = {
                account: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[2]
            }

            let res1 = await DappLib.readNFTs(testData1);

            let res2 = await DappLib.readNFTs(testData2);

            assert.equal(res1.result.length, 0, "Account has wrong number of NFTs");
            assert.equal(res2.result.length, 1, "Account has wrong number of NFTs");
        });
    });
});

