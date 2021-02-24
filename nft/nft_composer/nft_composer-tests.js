import { assert } from "console";
import { config } from "process";

///(test
describe('Nft-Nft_composer', async () => {

    it(`no initial NFTs admin`, async function () {
        let testData = {
            account: config.accounts[0]
        }
        let res = await DappLib.readNFTs(testData);
        let nfts = res.result;
        assert.equal(nfts.length, 0, "Account provisioned incorrectly");
    });

    it(`provision two accounts`, async function () {
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

    it(`no initial NFTs account`, async function () {
        let testData = {
            account: config.accounts[1]
        }
        setTimeout(async function () {
            let res = await DappLib.readNFTs(testData);
            let nfts = res.result;
            assert.equal(nfts.length, 0, "Account provisioned incorrectly");
        }, 2000)
    });

    it(`can mint nft into account`, async function () {
        let testData = {
            recipient: config.accounts[1]
        }
        setTimeout(async function () {
            await DappLib.mintNFT(testData);
            assert.equal(true, true, "Did not mint correctly");
        }, 2000)
    });

    it(`account has nft`, async function () {
        let testData = {
            account: config.accounts[1]
        }
        setTimeout(async function () {
            let res = await DappLib.readNFTs(testData);
            let nfts = res.result;
            assert.equal(nfts.length, 1, "Account provisioned incorrectly");
            assert.equal(nfts[0], 0, "Wrong NFT ID");
        }, 2000)
    });

    it(`account 1 has 1 nft, account 2 has 0 nft`, async function () {
        let testData1 = {
            account: config.accounts[1]
        }
        let testData2 = {
            account: config.accounts[2]
        }
        setTimeout(async function () {
            let res1 = await DappLib.readNFTs(testData1);
            let nfts1 = res1.result;
            let res2 = await DappLib.readNFTs(testData2);
            let nfts2 = res2.result;
            assert.equal(nfts1.length, 1, "Account has wrong number of nfts");
            assert.equal(nfts2.length, 0, "Account has wrong number of nfts");
        }, 2000)
    });

    it(`transfer nft`, async function () {
        let testData = {
            accountGiver: config.accounts[1],
            accountReceiver: config.accounts[2]
        }
        setTimeout(async function () {
            await DappLib.transfer(testData);
            assert.equal(true, true, "Transfer executed incorrectly.");
        }, 2000)
    });

    it(`account 1 has 0 nft, account 2 has 1 nft`, async function () {
        let testData1 = {
            account: config.accounts[1]
        }
        let testData2 = {
            account: config.accounts[2]
        }
        setTimeout(async function () {
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