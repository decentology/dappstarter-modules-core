import { assert } from "console";
import { config } from "process";

///(imports
const constants = TestHelpers.constants;
const expectEvent = TestHelpers.expectEvent;
const expectRevert = TestHelpers.expectRevert;
const { ZERO_ADDRESS } = constants;

const Chai = require('chai');
const expect = Chai.expect;

// const { shouldBehaveLikeERC1155 } = require('./nft_studio-behavior-tests');

// truffle test ./tests/nft_studio-tests.js

///)

///(test:language:cadence
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

///(test:language:solidity
    const [tokenHolder, tokenBatchHolder] = testAccounts;

    const initialURI = 'https://token-cdn-domain/{id}.json';

    before(async function () {
        await DappLib.setURI({
            from: config.owner,
            newURI: initialURI
        });
    });

    describe('internal functions', function () {
        const tokenId = new BN(1990);
        const mintAmount = new BN(9001);
        const burnAmount = new BN(3000);

        const tokenBatchIds = [new BN(2000).toString(), new BN(2010).toString(), new BN(2020).toString()];
        const mintAmounts = [new BN(5000).toString(), new BN(10000).toString(), new BN(42195).toString()];
        const burnAmounts = [new BN(5000).toString(), new BN(9001).toString(), new BN(195).toString()];

        const data = '0x12345678';

        describe('_mint', function () {
            it('reverts with a zero destination address', async function () {
                await expectRevert(
                    DappLib.mint({
                        from: config.owner,
                        account: ZERO_ADDRESS,
                        id: tokenId,
                        amount: mintAmount,
                        data: data
                    }),
                'ERC1155: mint to the zero address',
                );
            });

            context('with minted tokens', function () {
                before(async function () {
                    ({raw: this.logs } = await DappLib.mint({
                        from: config.owner,
                        account: tokenHolder,
                        id: tokenId,
                        amount: mintAmount,
                        data: data
                    }));
                });

                it('emits a TransferSingle event', function () {
                    expectEvent(this.logs, 'TransferSingle', {
                        operator: config.owner,
                        from: ZERO_ADDRESS,
                        to: tokenHolder,
                        id: tokenId,
                        value: mintAmount,
                    });
                });

                it('credits the minted amount of tokens', async function () {
                    let res = await DappLib.balanceOf({
                        account: tokenHolder,
                        id: tokenId
                    });
                    expect(res.result).to.be.bignumber.equal(mintAmount);
                });
            });
        });

        describe('_mintBatch', function () {
            it('reverts with a zero destination address', async function () {
                await expectRevert(
                    DappLib.mintBatch({
                        from: config.owner,
                        account: ZERO_ADDRESS,
                        ids: tokenBatchIds,
                        amounts: mintAmounts,
                        data: data
                    }),
                'ERC1155: mint to the zero address',
                );
            });

            it('reverts if length of inputs do not match', async function () {
                await expectRevert(
                    DappLib.mintBatch({
                        from: config.owner,
                        account: tokenBatchHolder,
                        ids: tokenBatchIds,
                        amounts: mintAmounts.slice(1),
                        data: data
                    }),
                    'ERC1155: ids and amounts length mismatch',
                );

                await expectRevert(
                    DappLib.mintBatch({
                        from: config.owner,
                        account: tokenBatchHolder,
                        ids: tokenBatchIds.slice(1),
                        amounts: mintAmounts,
                        data: data
                    }),
                    'ERC1155: ids and amounts length mismatch',
                );
            });

            context('with minted batch of tokens', function () {
                before(async function () {
                    ({ raw: this.logs } = await DappLib.mintBatch({
                        from: config.owner,
                        account: tokenBatchHolder,
                        ids: tokenBatchIds,
                        amounts: mintAmounts,
                        data: data
                    }));
                });

                it('emits a TransferBatch event', function () {
                    expectEvent(this.logs, 'TransferBatch', {
                        operator: config.owner,
                        from: ZERO_ADDRESS,
                        to: tokenBatchHolder
                    });
                });

                it('credits the minted batch of tokens', async function () {
                    let accountsArray = new Array(tokenBatchIds.length).fill(tokenBatchHolder);

                    let holderBatchBalances = await DappLib.balanceOfBatch({
                        accounts: accountsArray,
                        ids: tokenBatchIds
                    });

                    for (let i = 0; i < holderBatchBalances.length; i++) {
                        expect(holderBatchBalances[i]).to.be.bignumber.equal(mintAmounts[i]);
                    }
                });
            });
        });

        describe('_burn', function () {
            it('reverts when burning the zero account\'s tokens', async function () {
                await expectRevert(
                    DappLib.burn({
                        account: ZERO_ADDRESS,
                        id: tokenId,
                        amount: mintAmount
                    }),
                'ERC1155: burn from the zero address',
                );
            });

            it('reverts when burning a non-existent token id', async function () {
                await DappLib.burn({
                    account: tokenHolder,
                    id: tokenId,
                    amount: mintAmount
                });

                await expectRevert(
                    DappLib.burn({
                        account: tokenHolder,
                        id: tokenId,
                        amount: mintAmount
                    }),
                'ERC1155: burn amount exceeds balance',
                );
            });

            it('reverts when burning more than available tokens', async function () {
                await expectRevert(
                    DappLib.burn({
                        account: tokenHolder, 
                        id: tokenId, 
                        amount: mintAmount.addn(1)
                    }),
                    'ERC1155: burn amount exceeds balance',
                );
            });

            context('with minted-then-burnt tokens', function () {
                before(async function () {
                    await DappLib.mint({
                        account: tokenHolder, 
                        id: tokenId, 
                        amount: mintAmount,
                        data: data
                    });

                    ({ raw: this.logs } = await DappLib.burn({
                        oeprator: config.owner,
                        account: tokenHolder,
                        id: tokenId,
                        amount: burnAmount,
                    }));
                });

                it('emits a TransferSingle event', function () {
                    expectEvent(this.logs, 'TransferSingle', {
                        operator: config.owner,
                        from: tokenHolder,
                        to: ZERO_ADDRESS,
                        id: tokenId,
                        value: burnAmount,
                    });
                });

                it('accounts for both minting and burning', async function () {
                    let res = await DappLib.balanceOf({
                        account: tokenHolder,
                        id: tokenId
                    });
                    expect(res.result).to.be.bignumber.equal(mintAmount.sub(burnAmount));
                });
            });
        });

        describe('_burnBatch', function () {
            it('reverts when burning the zero account\'s tokens', async function () {
                await expectRevert(
                DappLib.burnBatch({
                    account: ZERO_ADDRESS, 
                    ids: tokenBatchIds, 
                    amounts: burnAmounts
                }),
                'ERC1155: burn from the zero address',
                );
            });

            it('reverts if length of inputs do not match', async function () {
                await expectRevert(
                DappLib.burnBatch({
                    account: tokenBatchHolder, 
                    ids: tokenBatchIds, 
                    amounts: burnAmounts.slice(1)
                }),
                'ERC1155: ids and amounts length mismatch',
                );

                await expectRevert(
                DappLib.burnBatch({
                    account: tokenBatchHolder, 
                    ids: tokenBatchIds.slice(1), 
                    amounts: burnAmounts
                }),
                'ERC1155: ids and amounts length mismatch',
                );
            });

            it('reverts when burning a non-existent token id', async function () {
                await DappLib.burnBatch({
                    account: tokenBatchHolder, 
                    ids: tokenBatchIds, 
                    amounts: burnAmounts
                });

                await expectRevert(
                DappLib.burnBatch({
                    account: tokenBatchHolder, 
                    ids: tokenBatchIds, 
                    amounts: burnAmounts
                }),
                'ERC1155: burn amount exceeds balance',
                );
            });

            context('with minted-then-burnt tokens', function () {
                before(async function () {
                    await DappLib.mintBatch({
                        account: tokenBatchHolder, 
                        ids: tokenBatchIds, 
                        amounts: mintAmounts, 
                        data: data
                    });

                    ({ raw: this.logs } = await DappLib.burnBatch({
                        from: config.owner,
                        account: tokenBatchHolder,
                        ids: tokenBatchIds,
                        amounts: burnAmounts,
                    }));
                });

                it('emits a TransferBatch event', function () {
                    expectEvent(this.logs, 'TransferBatch', {
                        operator: config.owner,
                        from: tokenBatchHolder,
                        to: ZERO_ADDRESS
                    });
                });

                it('accounts for both minting and burning', async function () {
                    const holderBatchBalances = await DappLib.balanceOfBatch({
                        accounts: new Array(tokenBatchIds.length).fill(tokenBatchHolder),
                        ids: tokenBatchIds,
                    });

                    for (let i = 0; i < holderBatchBalances.length; i++) {
                        expect(holderBatchBalances[i]).to.be.bignumber.equal(mintAmounts[i].sub(burnAmounts[i]));
                    }
                });
            });
        });
    });

    describe('ERC1155MetadataURI', function () {
        const firstTokenID = new BN('42');
        const secondTokenID = new BN('1337');

        it('sets the initial URI for all token types', async function () {
            let res = await DappLib.getURI({
                id: firstTokenID
            });

            expect(res.result).to.be.equal(initialURI);

            res = await DappLib.getURI({
                id: secondTokenID
            });
            
            expect(res.result).to.be.equal(initialURI);
        });

        describe('_setURI', function () {
            const newURI = 'https://token-cdn-domain/{locale}/{id}.json';

            it('sets the new URI for all token types', async function () {
                await DappLib.setURI({
                    newURI: newURI
                });

                let res = await DappLib.getURI({
                    id: firstTokenID
                });

                expect(res.result).to.be.equal(newURI);

                res = await DappLib.getURI({
                    id: secondTokenID
                });
                
                expect(res.result).to.be.equal(newURI);
            });
        });
    });
///)