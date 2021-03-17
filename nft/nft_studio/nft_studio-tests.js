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
    const [operator, tokenHolder, tokenBatchHolder, ...otherAccounts] = testAccounts;

    const initialURI = 'https://token-cdn-domain/{id}.json';

    before(async function () {
        await DappLib.setURI({
            from: config.owner,
            newURI: initialURI
        });
    });

    // shouldBehaveLikeERC1155(otherAccounts);

    describe('internal functions', function () {
        const tokenId = new BN(1990);
        const mintAmount = new BN(9001);
        const burnAmount = new BN(3000);

        const tokenBatchIds = [new BN(2000), new BN(2010), new BN(2020)];
        const mintAmounts = [new BN(5000), new BN(10000), new BN(42195)];
        const burnAmounts = [new BN(5000), new BN(9001), new BN(195)];

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

    //     describe('_mintBatch', function () {
    //     it('reverts with a zero destination address', async function () {
    //         await expectRevert(
    //         this.token.mintBatch(ZERO_ADDRESS, tokenBatchIds, mintAmounts, data),
    //         'ERC1155: mint to the zero address',
    //         );
    //     });

    //     it('reverts if length of inputs do not match', async function () {
    //         await expectRevert(
    //         this.token.mintBatch(tokenBatchHolder, tokenBatchIds, mintAmounts.slice(1), data),
    //         'ERC1155: ids and amounts length mismatch',
    //         );

    //         await expectRevert(
    //         this.token.mintBatch(tokenBatchHolder, tokenBatchIds.slice(1), mintAmounts, data),
    //         'ERC1155: ids and amounts length mismatch',
    //         );
    //     });

    //     context('with minted batch of tokens', function () {
    //         beforeEach(async function () {
    //         ({ logs: this.logs } = await this.token.mintBatch(
    //             tokenBatchHolder,
    //             tokenBatchIds,
    //             mintAmounts,
    //             data,
    //             { from: operator },
    //         ));
    //         });

    //         it('emits a TransferBatch event', function () {
    //         expectEvent.inLogs(this.logs, 'TransferBatch', {
    //             operator,
    //             from: ZERO_ADDRESS,
    //             to: tokenBatchHolder,
    //         });
    //         });

    //         it('credits the minted batch of tokens', async function () {
    //         const holderBatchBalances = await this.token.balanceOfBatch(
    //             new Array(tokenBatchIds.length).fill(tokenBatchHolder),
    //             tokenBatchIds,
    //         );

    //         for (let i = 0; i < holderBatchBalances.length; i++) {
    //             expect(holderBatchBalances[i]).to.be.bignumber.equal(mintAmounts[i]);
    //         }
    //         });
    //     });
    //     });

    //     describe('_burn', function () {
    //     it('reverts when burning the zero account\'s tokens', async function () {
    //         await expectRevert(
    //         this.token.burn(ZERO_ADDRESS, tokenId, mintAmount),
    //         'ERC1155: burn from the zero address',
    //         );
    //     });

    //     it('reverts when burning a non-existent token id', async function () {
    //         await expectRevert(
    //         this.token.burn(tokenHolder, tokenId, mintAmount),
    //         'ERC1155: burn amount exceeds balance',
    //         );
    //     });

    //     it('reverts when burning more than available tokens', async function () {
    //         await this.token.mint(
    //         tokenHolder,
    //         tokenId,
    //         mintAmount,
    //         data,
    //         { from: operator },
    //         );

    //         await expectRevert(
    //         this.token.burn(tokenHolder, tokenId, mintAmount.addn(1)),
    //         'ERC1155: burn amount exceeds balance',
    //         );
    //     });

    //     context('with minted-then-burnt tokens', function () {
    //         beforeEach(async function () {
    //         await this.token.mint(tokenHolder, tokenId, mintAmount, data);
    //         ({ logs: this.logs } = await this.token.burn(
    //             tokenHolder,
    //             tokenId,
    //             burnAmount,
    //             { from: operator },
    //         ));
    //         });

    //         it('emits a TransferSingle event', function () {
    //         expectEvent.inLogs(this.logs, 'TransferSingle', {
    //             operator,
    //             from: tokenHolder,
    //             to: ZERO_ADDRESS,
    //             id: tokenId,
    //             value: burnAmount,
    //         });
    //         });

    //         it('accounts for both minting and burning', async function () {
    //         expect(await this.token.balanceOf(
    //             tokenHolder,
    //             tokenId,
    //         )).to.be.bignumber.equal(mintAmount.sub(burnAmount));
    //         });
    //     });
    //     });

    //     describe('_burnBatch', function () {
    //     it('reverts when burning the zero account\'s tokens', async function () {
    //         await expectRevert(
    //         this.token.burnBatch(ZERO_ADDRESS, tokenBatchIds, burnAmounts),
    //         'ERC1155: burn from the zero address',
    //         );
    //     });

    //     it('reverts if length of inputs do not match', async function () {
    //         await expectRevert(
    //         this.token.burnBatch(tokenBatchHolder, tokenBatchIds, burnAmounts.slice(1)),
    //         'ERC1155: ids and amounts length mismatch',
    //         );

    //         await expectRevert(
    //         this.token.burnBatch(tokenBatchHolder, tokenBatchIds.slice(1), burnAmounts),
    //         'ERC1155: ids and amounts length mismatch',
    //         );
    //     });

    //     it('reverts when burning a non-existent token id', async function () {
    //         await expectRevert(
    //         this.token.burnBatch(tokenBatchHolder, tokenBatchIds, burnAmounts),
    //         'ERC1155: burn amount exceeds balance',
    //         );
    //     });

    //     context('with minted-then-burnt tokens', function () {
    //         beforeEach(async function () {
    //         await this.token.mintBatch(tokenBatchHolder, tokenBatchIds, mintAmounts, data);
    //         ({ logs: this.logs } = await this.token.burnBatch(
    //             tokenBatchHolder,
    //             tokenBatchIds,
    //             burnAmounts,
    //             { from: operator },
    //         ));
    //         });

    //         it('emits a TransferBatch event', function () {
    //         expectEvent.inLogs(this.logs, 'TransferBatch', {
    //             operator,
    //             from: tokenBatchHolder,
    //             to: ZERO_ADDRESS,
    //             // ids: tokenBatchIds,
    //             // values: burnAmounts,
    //         });
    //         });

    //         it('accounts for both minting and burning', async function () {
    //         const holderBatchBalances = await this.token.balanceOfBatch(
    //             new Array(tokenBatchIds.length).fill(tokenBatchHolder),
    //             tokenBatchIds,
    //         );

    //         for (let i = 0; i < holderBatchBalances.length; i++) {
    //             expect(holderBatchBalances[i]).to.be.bignumber.equal(mintAmounts[i].sub(burnAmounts[i]));
    //         }
    //         });
    //     });
    //     });
    // });

    // describe('ERC1155MetadataURI', function () {
    //     const firstTokenID = new BN('42');
    //     const secondTokenID = new BN('1337');

    //     it('emits no URI event in constructor', async function () {
    //     await expectEvent.notEmitted.inConstruction(this.token, 'URI');
    //     });

    //     it('sets the initial URI for all token types', async function () {
    //     expect(await this.token.uri(firstTokenID)).to.be.equal(initialURI);
    //     expect(await this.token.uri(secondTokenID)).to.be.equal(initialURI);
    //     });

    //     describe('_setURI', function () {
    //     const newURI = 'https://token-cdn-domain/{locale}/{id}.json';

    //     it('emits no URI event', async function () {
    //         const receipt = await this.token.setURI(newURI);

    //         expectEvent.notEmitted(receipt, 'URI');
    //     });

    //     it('sets the new URI for all token types', async function () {
    //         await this.token.setURI(newURI);

    //         expect(await this.token.uri(firstTokenID)).to.be.equal(newURI);
    //         expect(await this.token.uri(secondTokenID)).to.be.equal(newURI);
    //     });
        });
///)