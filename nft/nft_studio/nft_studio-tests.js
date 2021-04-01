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
            from: config.owner
        });

        expect(res.result).to.be.equal(initialURI);

        res = await DappLib.getURI({
          from: config.owner
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
              from: config.owner
            });

            expect(res.result).to.be.equal(newURI);

            res = await DappLib.getURI({
              from: config.owner
            });
            
            expect(res.result).to.be.equal(newURI);
        });
    });
});

describe('like an ERC1155', function () {
    const[minter, firstTokenHolder, secondTokenHolder, multiTokenHolder, recipient, proxy] = testAccounts;

    const firstTokenId = new BN(1);
    const secondTokenId = new BN(2);
    const unknownTokenId = new BN(3);
  
    const firstAmount = new BN(1000);
    const secondAmount = new BN(2000);
  
    const RECEIVER_SINGLE_MAGIC_VALUE = '0xf23a6e61';
    const RECEIVER_BATCH_MAGIC_VALUE = '0xbc197c81';

    describe('balanceOf', function () {
        it('reverts when queried about the zero address', async function () {
          await expectRevert(
            DappLib.balanceOf({
                account: ZERO_ADDRESS, 
                id: firstTokenId
            }),
            'ERC1155: balance query for the zero address',
          );
        });
  
        context('when accounts don\'t own tokens', function () {
          it('returns zero for given addresses', async function () {
            let res = await DappLib.balanceOf({
                account: firstTokenHolder,
                id: firstTokenId
            });

            expect(res.result).to.be.bignumber.equal(new BN(0));

            res = await DappLib.balanceOf({
                account: secondTokenHolder,
                id: secondTokenId
            });

            expect(res.result).to.be.bignumber.equal(new BN(0));

            res = await DappLib.balanceOf({
                account: firstTokenHolder,
                id: unknownTokenId
            });

            expect(res.result).to.be.bignumber.equal(new BN(0));
          });
        });
  
        context('when accounts own some tokens', function () {
          before(async function () {
            await DappLib.mint({
                from: config.owner,
                account: firstTokenHolder, 
                id: firstTokenId, 
                amount: firstAmount, 
                data: '0x'
            });

            await DappLib.mint({
                from: config.owner,
                account: secondTokenHolder, 
                id: secondTokenId, 
                amount: secondAmount, 
                data: '0x'
            });
          });
  
          it('returns the amount of tokens owned by the given addresses', async function () {
            let res = await DappLib.balanceOf({
                account: firstTokenHolder,
                id: firstTokenId
            });

            expect(res.result).to.be.bignumber.equal(firstAmount);
  
            res = await DappLib.balanceOf({
                account: secondTokenHolder,
                id: secondTokenId
            });

            expect(res.result).to.be.bignumber.equal(secondAmount);
  
            res = await DappLib.balanceOf({
                account: firstTokenHolder,
                id: unknownTokenId
            });

            expect(res.result).to.be.bignumber.equal(new BN(0));
          });
        });
    });

    describe('balanceOfBatch', function () {
        it('reverts when input arrays don\'t match up', async function () {
          await expectRevert(
            DappLib.balanceOfBatch({
              accounts: [firstTokenHolder, secondTokenHolder, firstTokenHolder, secondTokenHolder],
              ids: [firstTokenId.toString(), secondTokenId.toString(), unknownTokenId.toString()]
            }),
            'ERC1155: accounts and ids length mismatch',
          );
  
          await expectRevert(
            DappLib.balanceOfBatch({
              accounts: [firstTokenHolder, secondTokenHolder],
              ids: [firstTokenId.toString(), secondTokenId.toString(), unknownTokenId.toString()]
            }),
            'ERC1155: accounts and ids length mismatch',
          );
        });
  
        it('reverts when one of the addresses is the zero address', async function () {
          await expectRevert(
            DappLib.balanceOfBatch({
              accounts: [firstTokenHolder, secondTokenHolder, ZERO_ADDRESS],
              ids: [firstTokenId.toString(), secondTokenId.toString(), unknownTokenId.toString()]
            }),
            'ERC1155: balance query for the zero address',
          );
        });
  
        context('when accounts don\'t own tokens', function () {
          it('returns zeros for each account', async function () {
            await DappLib.burn({
                from: config.owner,
                account: firstTokenHolder, 
                id: firstTokenId, 
                amount: firstAmount, 
                data: '0x'
            });

            await DappLib.burn({
                from: config.owner,
                account: secondTokenHolder, 
                id: secondTokenId, 
                amount: secondAmount, 
                data: '0x'
            });

            const res = await DappLib.balanceOfBatch({
              accounts: [firstTokenHolder, secondTokenHolder, firstTokenHolder],
              ids: [firstTokenId.toString(), secondTokenId.toString(), unknownTokenId.toString()]
            });

            expect(res.result).to.be.an('array');
            expect(res.result[0]).to.be.a.bignumber.equal(new BN(0));
            expect(res.result[1]).to.be.a.bignumber.equal(new BN(0));
            expect(res.result[2]).to.be.a.bignumber.equal(new BN(0));
          });
        });
  
        context('when accounts own some tokens', function () {
          before(async function () {
            await DappLib.mint({
                from: config.owner,
                account: firstTokenHolder, 
                id: firstTokenId, 
                amount: firstAmount, 
                data:'0x'
            });

            await DappLib.mint({
                from: config.owner,
                account: secondTokenHolder, 
                id: secondTokenId, 
                amount: secondAmount, 
                data:'0x'
            });
          });
  
          it('returns amounts owned by each account in order passed', async function () {
            const res = await DappLib.balanceOfBatch({
              accounts: [secondTokenHolder, firstTokenHolder, firstTokenHolder],
              ids: [secondTokenId.toString(), firstTokenId.toString(), unknownTokenId.toString()]
            });

            expect(res.result).to.be.an('array');
            expect(res.result[0]).to.be.a.bignumber.equal(secondAmount);
            expect(res.result[1]).to.be.a.bignumber.equal(firstAmount);
            expect(res.result[2]).to.be.a.bignumber.equal(new BN(0));
          });
  
          it('returns multiple times the balance of the same address when asked', async function () {
            const res = await DappLib.balanceOfBatch({
              accounts: [firstTokenHolder, secondTokenHolder, firstTokenHolder],
              ids: [firstTokenId.toString(), secondTokenId.toString(), firstTokenId.toString()],
            });

            expect(res.result).to.be.an('array');
            expect(res.result[0]).to.be.a.bignumber.equal(res.result[2]);
            expect(res.result[0]).to.be.a.bignumber.equal(firstAmount);
            expect(res.result[1]).to.be.a.bignumber.equal(secondAmount);
            expect(res.result[2]).to.be.a.bignumber.equal(firstAmount);
          });
        });
    });

    describe('setApprovalForAll', function () {
        before(async function () {
            ({raw: this.logs} = await DappLib.setApprovalForAll({
                from: multiTokenHolder,
                operator: proxy, 
                approved: true
            }));
        });
  
        it('sets approval status which can be queried via isApprovedForAll', async function () {
            let res = await DappLib.isApprovedForAll({
                account: multiTokenHolder,
                operator: proxy
            });

            expect(res.result).to.be.equal(true);
        });
  
        it('emits an ApprovalForAll log', function () {
          expectEvent(this.logs, 'ApprovalForAll', { account: multiTokenHolder, operator: proxy, approved: true });
        });
  
        it('can unset approval for an operator', async function () {
          await DappLib.setApprovalForAll({
              operator: proxy, 
              approved: false,
              from: multiTokenHolder
            });

            let res = await DappLib.isApprovedForAll({
                account: multiTokenHolder,
                operator: proxy
            });

          expect(res.result).to.be.equal(false);
        });
  
        it('reverts if attempting to approve self as an operator', async function () {
          await expectRevert(
            DappLib.setApprovalForAll({
                operator: multiTokenHolder, 
                approved: true,
                from: multiTokenHolder 
            }),
            'ERC1155: setting approval status for self',
          );
        });
    });

    describe('safeTransferFrom', function () {
        before(async function () {
            await DappLib.mint({
                from: config.owner,
                account: multiTokenHolder, 
                id: firstTokenId, 
                amount: firstAmount, 
                data: '0x',
            });
          
            await DappLib.mint({
                from: config.owner,
                account: multiTokenHolder, 
                id: secondTokenId, 
                amount: secondAmount, 
                data: '0x',
            });
        });
    
        it('reverts when transferring more than balance', async function () {
          await expectRevert(
            DappLib.safeTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder,
                to: recipient,
                id: firstTokenId,
                amount: firstAmount.addn(1),
                data: '0x'
            }),
            'ERC1155: insufficient balance for transfer',
          );
        });
    
        it('reverts when transferring to zero address', async function () {
          await expectRevert(
            DappLib.safeTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder,
                to: ZERO_ADDRESS,
                id: firstTokenId,
                amount: firstAmount,
                data: '0x'
            }),
            'ERC1155: transfer to the zero address',
          );
        });
    
        function transferWasSuccessful ({ operator, from, id, value }) {
          it('debits transferred balance from sender', async function () {
            const newBalance = await DappLib.balanceOf({
                account: from, 
                id: id
            });

            expect(newBalance.result).to.be.a.bignumber.equal(new BN(0));
          });
    
          it('credits transferred balance to receiver', async function () {
            const newBalance = await DappLib.balanceOf({
                account: this.toWhom, 
                id: id
            });

            expect(newBalance.result).to.be.a.bignumber.equal(value);
          });
    
          it('emits a TransferSingle log', function () {
            expectEvent(this.transferLogs, 'TransferSingle', {
              operator: operator,
              from: from,
              to: this.toWhom,
              id: id,
              value: value
            });
          });
        }
    
        context('when called by the multiTokenHolder', async function () {
          before(async function () {
            this.toWhom = recipient;
            ({ raw: this.transferLogs } =
              await DappLib.safeTransferFrom({
                    authorized: multiTokenHolder,
                    from: multiTokenHolder, 
                    to: recipient, 
                    id: firstTokenId, 
                    amount: firstAmount, 
                    data: '0x'
              }));
          });
    
          transferWasSuccessful.call(this, {
            operator: multiTokenHolder,
            from: multiTokenHolder,
            id: firstTokenId,
            value: firstAmount,
          });
    
        it('preserves existing balances which are not transferred by multiTokenHolder', async function () {
            const balance1 = await DappLib.balanceOf({
                account: multiTokenHolder, 
                id: secondTokenId
            });
            expect(balance1.result).to.be.a.bignumber.equal(secondAmount);
    
            const balance2 = await DappLib.balanceOf({
                account: recipient, 
                id: secondTokenId
            });
            expect(balance2.result).to.be.a.bignumber.equal(new BN(0));
          });
        });
    
        context('when called by an operator on behalf of the multiTokenHolder', function () {
          context('when operator is not approved by multiTokenHolder', function () {
            before(async function () {
              await DappLib.setApprovalForAll({
                  operator: proxy, 
                  approved: false,
                  from: multiTokenHolder 
                });
            });
    
            it('reverts', async function () {
              await expectRevert(
                DappLib.safeTransferFrom({
                    authorized: proxy,
                    from: multiTokenHolder, 
                    to: recipient, 
                    id: firstTokenId, 
                    amount: firstAmount, 
                    data: '0x'
                }),
                'ERC1155: caller is not owner nor approved',
              );
            });
          });
    
          context('when operator is approved by multiTokenHolder', function () {
            before(async function () {
              this.toWhom = recipient;
              await DappLib.setApprovalForAll({
                  operator: proxy, 
                  approved: true,
                  from: multiTokenHolder 
                });

                await DappLib.setApprovalForAll({
                    operator: proxy, 
                    approved: true,
                    from: recipient 
                  });

                await DappLib.safeTransferFrom({
                    authorized: proxy,
                    from: recipient, 
                    to: multiTokenHolder, 
                    id: firstTokenId, 
                    amount: firstAmount, 
                    data: '0x'
                });

              ({ raw: this.transferLogs } =
                await DappLib.safeTransferFrom({
                    authorized: proxy,
                    from: multiTokenHolder, 
                    to: recipient, 
                    id: firstTokenId, 
                    amount: firstAmount, 
                    data: '0x'
                }));
            });
    
            transferWasSuccessful.call(this, {
              operator: proxy,
              from: multiTokenHolder,
              id: firstTokenId,
              value: firstAmount,
            });
    
            it('preserves operator\'s balances not involved in the transfer', async function () {
              const balance1 = await DappLib.balanceOf({
                  account: proxy, 
                  id: firstTokenId
              });
              expect(balance1.result).to.be.a.bignumber.equal(new BN(0));
    
              const balance2 = await DappLib.balanceOf({
                  account: proxy, 
                  id: secondTokenId
              });
              expect(balance2.result).to.be.a.bignumber.equal(new BN(0));
            });
          });
        });
      });

      describe('safeBatchTransferFrom', function () {
        before(async function () {
            await DappLib.mint({
                    account: multiTokenHolder, 
                    id: firstTokenId, 
                    amount: firstAmount, 
                    data: '0x',
                    from: config.owner,
            });
        });
  
        it('reverts when transferring amount more than any of balances', async function () {
          await expectRevert(
            DappLib.safeBatchTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder, 
                to: recipient,
                ids: [firstTokenId.toString(), secondTokenId.toString()],
                amounts: [firstAmount.toString(), secondAmount.addn(1).toString()],
                data: '0x'
            }),
            'ERC1155: insufficient balance for transfer',
          );
        });
  
        it('reverts when ids array length doesn\'t match amounts array length', async function () {
          await expectRevert(
            DappLib.safeBatchTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder, 
                to: recipient,
                ids: [firstTokenId.toString()],
                amounts: [firstAmount.toString(), secondAmount.toString()],
                data: '0x'
            }),
            'ERC1155: ids and amounts length mismatch',
          );

          await expectRevert(
            DappLib.safeBatchTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder, 
                to: recipient,
                ids: [firstTokenId.toString(), secondTokenId.toString()],
                amounts: [firstAmount.toString()],
                data: '0x'
            }),
            'ERC1155: ids and amounts length mismatch',
          );
        });
  
        it('reverts when transferring to zero address', async function () {
          await expectRevert(
            DappLib.safeBatchTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder, 
                to: ZERO_ADDRESS,
                ids: [firstTokenId.toString(), secondTokenId.toString()],
                amounts: [firstAmount.toString(), secondAmount.toString()],
                data:'0x'
            }),
            'ERC1155: transfer to the zero address',
          );
        });
  
        function batchTransferWasSuccessful ({ operator, from, ids, values }) {
          it('debits transferred balances from sender', async function () {
            const newBalances = await DappLib.balanceOfBatch({
                accounts: new Array(ids.length).fill(from),
                ids: ids
            });

            for (const newBalance of newBalances.result) {
              expect(newBalance).to.be.a.bignumber.equal(new BN(0));
            }
          });
  
          it('credits transferred balances to receiver', async function () {
            const newBalances = await DappLib.balanceOfBatch({
                accounts: new Array(ids.length).fill(this.toWhom), 
                ids: ids
            });

            for (let i = 0; i < newBalances.length; i++) {
              expect(newBalances.result[i]).to.be.a.bignumber.equal(values[i]);
            }
          });
  
          it('emits a TransferBatch log', function () {
            expectEvent(this.transferLogs, 'TransferBatch', {
              operator: operator,
              from: from,
              to: this.toWhom,
              ids: ids,
              values: values
            });
          });
        }
  
        context('when called by the multiTokenHolder', async function () {
          before(async function () {
            this.toWhom = recipient;
            ({ raw: this.transferLogs } =
              await DappLib.safeBatchTransferFrom({
                authorized: multiTokenHolder,
                from: multiTokenHolder, 
                to: recipient,
                ids: [firstTokenId.toString(), secondTokenId.toString()],
                amounts: [firstAmount.toString(), secondAmount.toString()],
                data: '0x'
              }));
          });
  
          batchTransferWasSuccessful.call(this, {
            operator: multiTokenHolder,
            from: multiTokenHolder,
            ids: [firstTokenId.toString(), secondTokenId.toString()],
            values: [firstAmount.toString(), secondAmount.toString()],
          });
        });
  
        context('when called by an operator on behalf of the multiTokenHolder', function () {
          context('when operator is not approved by multiTokenHolder', function () {
            before(async function () {
              await DappLib.setApprovalForAll({
                  operator: proxy, 
                  approved: false,
                  from: multiTokenHolder 
                });
            });
  
            it('reverts', async function () {
              await expectRevert(
                DappLib.safeBatchTransferFrom({
                    authorized: proxy,
                    from: multiTokenHolder, 
                    to: recipient,
                    ids: [firstTokenId.toString(), secondTokenId.toString()],
                    amounts: [firstAmount.toString(), secondAmount.toString()],
                    data:'0x'
                }),
                'ERC1155: transfer caller is not owner nor approved',
              );
            });
          });
  
          context('when operator is approved by multiTokenHolder', function () {
            before(async function () {
              this.toWhom = recipient;
              await DappLib.setApprovalForAll({
                  operator: proxy, 
                  approved: true,
                  from: multiTokenHolder 
                });

                await DappLib.mintBatch({
                    from: config.owner,
                    account: multiTokenHolder,
                    ids: [firstTokenId.toString(), secondTokenId.toString()],
                    amounts: [firstAmount.toString(), secondAmount.toString()],
                    data: '0x'
                });

              ({ raw: this.transferLogs } =
                await DappLib.safeBatchTransferFrom({
                    authorized: proxy,
                    from: multiTokenHolder, 
                    to: recipient,
                    ids: [firstTokenId.toString(), secondTokenId.toString()],
                    amounts: [firstAmount.toString(), secondAmount.toString()],
                    data: '0x'
                }));
            });
  
            batchTransferWasSuccessful.call(this, {
              operator: proxy,
              from: multiTokenHolder,
              ids: [firstTokenId.toString(), secondTokenId.toString()],
              values: [firstAmount.toString(), secondAmount.toString()],
            });
  
            it('preserves operator\'s balances not involved in the transfer', async function () {
              const balance1 = await DappLib.balanceOf({
                  account: proxy, 
                  id: firstTokenId
                });

              expect(balance1.result).to.be.a.bignumber.equal(new BN(0));

              const balance2 = await DappLib.balanceOf({
                  account: proxy, 
                  id: secondTokenId
              });

              expect(balance2.result).to.be.a.bignumber.equal(new BN(0));
            });
          });
        });
    });

});
///)