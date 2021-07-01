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

    describe('Voting — Ballot', async () => {

        it(`can create a new proposal`, async function () {
            let testData = {
                admin: config.accounts[0],
                files: ["Test File #1", "Test File #2"]
            }
            try {
                await DappLib.initializeProposals(testData);
            }
            catch (e) {
                assert.fail(e.message);
            }
        });

        it(`can issue a ballot`, async function () {
            let testData = {
                admin: config.accounts[0],
                voter: config.accounts[1]
            }
            await DappLib.issueBallot(testData);
        });

        it(`can vote`, async function () {
            let testData = {
                voter: config.accounts[1],
                proposalIndex: "1"
            }
            await DappLib.vote(testData);
        });

        it(`can get list of proposals`, async function () {
            let res = await DappLib.getProposalList({})

            assert.equal(res.result.length, 2, "Incorrect number of proposals")
        });

        it(`should not be able to vote unless ballot is issued`, async function () {
            let testData = {
                voter: config.accounts[2],
                proposalIndex: "1"
            }

            hasError = false;
            try {
                await DappLib.vote(testData);
            }
            catch (e) {
                hasError = true;
            }
            assert.equal(hasError, true, "Voted without an issued ballot");
        });

        it(`should not be able to vote on a non existent proposal`, async function () {
            let testData = {
                voter: config.accounts[1],
                proposalIndex: "5"
            }

            hasError = false;
            try {
                await DappLib.vote(testData);
            }
            catch (e) {
                hasError = true;
            }
            assert.equal(hasError, true, "Voted on a non existent proposal");
        });
    });

});