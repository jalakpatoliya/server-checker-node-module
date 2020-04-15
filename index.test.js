const ServerChecker = require('./index');
const assert = require('assert').strict;
const path = require('path');

describe('Integration Test', () => {
    beforeEach(() => {
        this.serverChecker = new ServerChecker();
    })

    it('Should return least priority online server from serverList.json', async () => {
        const testCasePath = path.join(__dirname, '/testCases/serverList.json');
        const data = await this.serverChecker.findServer({ path: testCasePath })
        const expectedData = { priority: 4, url: 'http://google.com' };

        assert.deepStrictEqual(data, expectedData)
    }).timeout(5000);


})

describe('Exception Handling', () => {
    beforeEach(() => {
        this.serverChecker = new ServerChecker();
    })

    it('Should fail as all listed servers are offline from testCase1.json', async () => {
        // const data = await this.serverChecker.findServer({ path: 'testCase1.json' })
        const expectedError = new Error("All servers are Offline.");
        const testCasePath = path.join(__dirname, '/testCases/testCase1.json');

        await assert.rejects(async () => {
            await this.serverChecker.findServer({ path: testCasePath });
        },
            expectedError
        )
    }).timeout(5000);

    it('Should fail as server list is empty from testCase2.json', async () => {
        const expectedError = new Error("Empty server list recived");
        const testCasePath = path.join(__dirname, '/testCases/testCase2.json');

        await assert.rejects(async () => {
            await this.serverChecker.findServer({ path: testCasePath });
        },
            expectedError
        )
    }).timeout(5000);

    it('Should fail as json file does not exist', async () => {
        const expectedError = new Error('Servers listed JSON file not found');

        await assert.rejects(async () => {
            await this.serverChecker.findServer({ path: 'asdf.json' });
        },
            expectedError
        )
    }).timeout(5000);
})

