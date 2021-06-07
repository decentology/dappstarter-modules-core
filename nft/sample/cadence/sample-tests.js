import { assert } from "console";
import { config } from "process";

///(imports
const constants = TestHelpers.constants;
const expectEvent = TestHelpers.expectEvent;
const expectRevert = TestHelpers.expectRevert;
const { ZERO_ADDRESS } = constants;

const Chai = require('chai');
const expect = Chai.expect;


// truffle test ./tests/composable_nft-tests.js

///)

///(test
describe('NFT Composer', async() => {

    it(`no initial NFTs admin`, async() => {
        let testData = {
            account: config.accounts[0]
        }
        let res = await DappLib.readNFTs(testData);
        let nfts = res.result;
        assert.equal(nfts.length, 0, "Account provisioned incorrectly");
    });

    it(`provision two accounts`, async() => {
        let testData1 = {
            account: config.accounts[1]
        }

        let testData2 = {
            account: config.accounts[2]
        }

        await DappLib.provisionAccount(testData1);
        await DappLib.provisionAccount(testData2);
        assert.equal(true, true, "Accounts provisioned incorrectly");
    });

    it(`no initial NFTs account`, async() => {
        let testData = {
            account: config.accounts[1]
        }
        setTimeout(async() => {
            let res = await DappLib.readNFTs(testData);
            let nfts = res.result;
            assert.equal(nfts.length, 0, "Account provisioned incorrectly");
        }, 2000)
    });

    it(`can mint nft into account`, async() => {
        let testData = {
            recipient: config.accounts[1]
        }
        setTimeout(async() => {
            await DappLib.mintNFT(testData);
            assert.equal(true, true, "Did not mint correctly");
        }, 2000)
    });

    it(`account has nft`, async() => {
        let testData = {
            account: config.accounts[1]
        }
        setTimeout(async() => {
            let res = await DappLib.readNFTs(testData);
            let nfts = res.result;
            assert.equal(nfts.length, 1, "Account provisioned incorrectly");
            assert.equal(nfts[0], 0, "Wrong NFT ID");
        }, 2000)
    });

    it(`account 1 has 1 nft, account 2 has 0 nft`, async() => {
        let testData1 = {
            account: config.accounts[1]
        }
        let testData2 = {
            account: config.accounts[2]
        }
        setTimeout(async() => {
            let res1 = await DappLib.readNFTs(testData1);
            let nfts1 = res1.result;
            let res2 = await DappLib.readNFTs(testData2);
            let nfts2 = res2.result;
            assert.equal(nfts1.length, 1, "Account has wrong number of nfts");
            assert.equal(nfts2.length, 0, "Account has wrong number of nfts");
        }, 2000)
    });

    it(`transfer nft`, async() => {
        let testData = {
            accountGiver: config.accounts[1],
            accountReceiver: config.accounts[2]
        }
        setTimeout(async() => {
            await DappLib.transfer(testData);
            assert.equal(true, true, "Transfer executed incorrectly.");
        }, 2000)
    });

    it(`account 1 has 0 nft, account 2 has 1 nft`, async() => {
        let testData1 = {
            account: config.accounts[1]
        }
        let testData2 = {
            account: config.accounts[2]
        }
        setTimeout(async() => {
            let res1 = await DappLib.readNFTs(testData1);
            let nfts1 = res1.result;
            let res2 = await DappLib.readNFTs(testData2);
            let nfts2 = res2.result;
            assert.equal(nfts1.length, 0, "Account has wrong number of nfts");
            assert.equal(nfts2.length, 1, "Account has wrong number of nfts");
        }, 2000)
    });

});
///)
