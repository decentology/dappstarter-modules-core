const assert = require('chai').assert;
const DappLib = require('../src/dapp-lib.js');
const fkill = require('fkill');

describe('Flow Dapp Tests', async () => {

    let config = null;
    before('setup contract', async () => {
        // Setup tasks for tests
        config = DappLib.getConfig();
    });

    after(() => {
        fkill(':3570');
    });

    describe('\nPack NFT', async () => {

        it(`mints tokens into the admin and user accounts and has the correct balance in the account`, async () => {
            let testData1 = {
                amount: "30.0",
                recipient: config.accounts[0]
            }
            let testData2 = {
                amount: "30.0",
                recipient: config.accounts[1]
            }
            let testData3 = {
                account: config.accounts[0]
            }
            let testData4 = {
                account: config.accounts[1]
            }

            await DappLib.mintFlowTokens(testData1)
            await DappLib.mintFlowTokens(testData2)
            let res1 = await DappLib.getFlowBalance(testData3)
            let res2 = await DappLib.getFlowBalance(testData4)

            assert.equal(res1.result, 1030.001, "Did not mint tokens correctly")
            assert.equal(res2.result, 1030.001, "Did not mint tokens correctly")
        })

        it(`provisions the admin and a user`, async () => {
            let testData1 = {
                account: config.accounts[0]
            }
            let testData2 = {
                account: config.accounts[1]
            }

            await DappLib.provisionNFTs(testData1);
            await DappLib.provisionNFTs(testData2);

            await DappLib.provisionPacks(testData1);
            await DappLib.provisionPacks(testData2);

            await DappLib.provisionMarketplace(testData1);
            await DappLib.provisionMarketplace(testData2);
        });

        it(`has no initial packs or nfts`, async () => {
            let testData = {
                account: config.accounts[0]
            }
            let res1 = await DappLib.getOwnedPacks(testData);
            let res2 = await DappLib.getNFTsInCollection(testData);
            assert.equal(res1.result.length, 0, "Account provisioned incorrectly");
            assert.equal(res2.result.length, 0, "Account provisioned incorrectly");
        });

        it(`has no initial available packs to buy`, async () => {
            let res = await DappLib.getPacksAvailable({});
            assert.equal(Object.keys(res.result).length, 0, "There are Packs available when they shouldn't be");
        });

        it(`adds a pack type and has correct information for the pack type`, async () => {
            let testData1 = {
                packType: "5",
                numberOfNFTs: "3"
            }
            let testData2 = {
                packType: "5",
            }

            await DappLib.addPackType(testData1);

            let res = await DappLib.getPackTypeInfo(testData2);

            assert.equal(res.result.numberOfNFTs, 3, "Pack type not created correctly");
            assert.equal(res.result.packType, 5, "Pack type not created correctly")
        });

        it(`fails when trying to mint a pack type that doesn't exist yet`, async () => {
            let testData = {
                packType: "4",
                numberOfPacks: "6"
            }

            try {
                await DappLib.mintPacks(testData);
            } catch (e) {

            }
        })

        it(`mints packs and updated a pack type correctly`, async () => {
            let testData1 = {
                packType: "5",
                numberOfPacks: "6"
            }
            let testData2 = {
                packType: "5",
            }
            await DappLib.mintPacks(testData1);

            let res = await DappLib.getPackTypeInfo(testData2);

            assert.equal(res.result.numberOfNFTs, 3, "Pack type not created correctly");
            assert.equal(res.result.packType, 5, "Pack type not created correctly")

        })

        it(`has the correct pack type after minting a pack`, async () => {
            let testData = {
                id: 0,
                acct: config.accounts[0]
            }

            let res = await DappLib.getPackInfo(testData);

            assert.equal(res.result.packType, 5, "Pack doesn't have correct packType")

        })

        it(`has correct number of packs in collection`, async () => {
            let testData = {
                account: config.accounts[0]
            }
            let res = await DappLib.getOwnedPacks(testData);
            assert.equal(res.result.length, 6, "Did not mint packs correctly")
        })

        it(`has no packs up for sale`, async () => {
            let res = await DappLib.getPacksAvailable({});
            assert.equal(Object.keys(res.result).length, 0, "There should be no packs available")
        })

        it(`lists packs for sale and has 2 packs up for sale`, async () => {
            let testData1 = {
                price: "30.0"
            }
            await DappLib.listPacksForSale(testData1);

            let res = await DappLib.getPacksAvailable({});
            assert.equal(Object.keys(res.result).length, 2, "There should be no packs available")

        })

        it(`transfers the pack and has correct number of packs in the accounts`, async () => {
            let testData1 = {
                giver: config.accounts[0],
                id: 4,
                recipient: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[0]
            }
            let testData3 = {
                account: config.accounts[1]
            }
            await DappLib.transferPack(testData1);

            let res1 = await DappLib.getOwnedPacks(testData2)
            let res2 = await DappLib.getOwnedPacks(testData3)
            assert.equal(res1.result.length, 5, "Did not transfer pack correctly")
            assert.equal(res2.result.length, 1, "Did not transfer the pack correctly")
        })

        it(`opens the pack and has correct number of nfts and packs in collection`, async () => {
            let testData1 = {
                id: 4,
                recipient: config.accounts[1]
            }
            let testData2 = {
                account: config.accounts[1]
            }

            await DappLib.openPack(testData1)

            let res1 = await DappLib.getNFTsInCollection(testData2)
            let res2 = await DappLib.getOwnedPacks(testData2)
            assert.equal(res1.result.length, 3, "Incorrect number of NFTs in collection")
            assert.equal(res2.result.length, 0, "Incorrect number of packs in collection")
        })

        it(`opens a pack that has already been opened and fails`, async () => {
            let testData = {
                id: 4,
                recipient: config.accounts[1]
            }

            try {
                await DappLib.openPack(testData)
            } catch (e) {

            }
        })

        it(`has the correct properties for the newly minted NFTs`, async () => {
            let testData1 = {
                account: config.accounts[1],
                id: 0
            }
            let testData2 = {
                account: config.accounts[1],
                id: 1
            }
            let testData3 = {
                account: config.accounts[1],
                id: 2
            }

            let res1 = await DappLib.getNFTInfo(testData1)
            let res2 = await DappLib.getNFTInfo(testData2)
            let res3 = await DappLib.getNFTInfo(testData3)
            assert.equal(res1.result.id, 0, "Newly minted NFT does not have the correct properties.")
            assert.equal(res2.result.id, 1, "Newly minted NFT does not have the correct properties.")
            assert.equal(res3.result.id, 2, "Newly minted NFT does not have the correct properties.")
        })

        it(`transfers nft and has correct number of nfts in the accounts`, async () => {
            let testData1 = {
                giver: config.accounts[1],
                id: 0,
                recipient: config.accounts[0]
            }
            let testData2 = {
                account: config.accounts[1]
            }
            let testData3 = {
                account: config.accounts[0]
            }

            await DappLib.transferNFT(testData1)

            let res1 = await DappLib.getNFTsInCollection(testData2)
            let res2 = await DappLib.getNFTsInCollection(testData3)
            assert.equal(res1.result.length, 2, "Did not transfer nft correctly")
            assert.equal(res2.result.length, 1, "Did not transfer nft correctly")

        })

        // makes sure no pack is transferred and no money is spent when buyPack fails
        it(`safely fails when trying to buy a pack with non-existent id`, async () => {
            let testData1 = {
                recipient: config.accounts[1],
                id: 10
            }
            let testData2 = {
                account: config.accounts[0]
            }
            let testData3 = {
                account: config.accounts[1]
            }

            try {
                await DappLib.buyPack(testData1)
            } catch (e) {
                let res1 = await DappLib.getOwnedPacks(testData2)
                let res2 = await DappLib.getOwnedPacks(testData3)
                let res3 = await DappLib.getFlowBalance(testData3)
                assert.equal(res1.result.length, 5, "Transferred a pack when it wasn't supposed to.")
                assert.equal(res2.result.length, 0, "Transferred a pack when it wasn't supposed to.")
                assert.equal(res3.result, 1030.001, "Money was spent when it wasn't supposed to.")
            }
        })

        it(`buys a pack and has correct number of packs in the accounts`, async () => {
            let testData1 = {
                recipient: config.accounts[1],
                id: 5
            }
            let testData2 = {
                account: config.accounts[0]
            }
            let testData3 = {
                account: config.accounts[1]
            }

            await DappLib.buyPack(testData1)

            let res1 = await DappLib.getOwnedPacks(testData2)
            let res2 = await DappLib.getOwnedPacks(testData3)
            assert.equal(res1.result.length, 4, "Did not buy the pack correctly")
            assert.equal(res2.result.length, 1, "Did not buy the pack correctly")
        })

        it(`has correct pack type after buying a pack`, async () => {
            let testData = {
                id: 5,
                acct: config.accounts[1]
            }

            let res = await DappLib.getPackInfo(testData)

            assert.equal(res.result.packType, 5, "Pack has incorrect properties after buying it")
        })

        it(`has correct balance`, async () => {
            let testData1 = {
                account: config.accounts[0]
            }
            let testData2 = {
                account: config.accounts[1]
            }

            let res1 = await DappLib.getFlowBalance(testData1)
            let res2 = await DappLib.getFlowBalance(testData2)

            assert.equal(res1.result, 1060.001, "Did not mint tokens correctly")
            assert.equal(res2.result, 1000.001, "Did not mint tokens correctly")
        })

    });

});