const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async () => {

    let config = null;
    before('setup contract', async () => {
        // Setup tasks for tests
        config = DappLib.getConfig();
        let testData1 = {
            account: config.accounts[1]
        }

        let testData2 = {
            account: config.accounts[2]
        }

        await DappLib.provisionAccount(testData1);
        await DappLib.provisionAccount(testData2);
    });

    after(() => {
        fkill(':3570');
    });

    describe('Custom NFT', async () => {

        it(`user has no NFTs`, async () => {
            let testData = {
                account: config.accounts[1]
            }
            let res = await DappLib.readNFTs(testData);
            assert.equal(res.result.length, 0, "Account provisioned incorrectly");
        });

        it(`mints NFT into user account`, async () => {
            let testData = {
                recipient: config.accounts[1],
                metaData: { serial: "3" }
            }
            await DappLib.mintNFT(testData);

            testData = {
                account: config.accounts[1]
            }
            let res = await DappLib.readNFTs(testData);

            assert.equal(res.result.length, 1, "NFT did not mint correctly");
            assert.equal(res.result[0], 0, "Minted NFT has the wrong ID");
        });

        it(`minted NFT has correct metadata`, async () => {
            let testData = {
                account: config.accounts[1],
                id: "0"
            }
            let res = await DappLib.readNFTMetadata(testData);

            assert.equal(res.result.serial, 3, "Metadata is incorrect");
        });

        it(`accounts have correct number of NFTs`, async () => {
            let testData1 = {
                account: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[2]
            }

            let res1 = await DappLib.readNFTs(testData1);
            let res2 = await DappLib.readNFTs(testData2);

            assert.equal(res1.result.length, 1, "Account 1 has wrong number of NFTs");
            assert.equal(res2.result.length, 0, "Account 2 has wrong number of NFTs");
        });

        it(`transfer NFT between accounts`, async () => {
            let testData = {
                accountGiver: config.accounts[1],
                accountReceiver: config.accounts[2],
                withdrawID: "0"
            }
            await DappLib.transfer(testData);
        });

        it(`accounts have correct number of NFTs after transfer`, async () => {
            let testData1 = {
                account: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[2]
            }

            let res1 = await DappLib.readNFTs(testData1);

            let res2 = await DappLib.readNFTs(testData2);

            assert.equal(res1.result.length, 0, "Account 1 has wrong number of NFTs");
            assert.equal(res2.result.length, 1, "Account 2 has wrong number of NFTs");
        });
    });

});


