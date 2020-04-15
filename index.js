const fs = require("fs");
const { promisify } = require("util");
const axios = require('axios');
const readFile = promisify(fs.readFile);

/**
 * To check all expected errors 
 */
class ErrorChecker {
    async isListEmpty(list) {
        //check if list is empty
        if (list.length == 0) throw new Error('Empty server list recived')
    }
    async doesFileExist(path) {
        //check if file exists
        if (!fs.existsSync(path)) throw new Error('Servers listed JSON file not found');
    }
}


class ServerChecker extends ErrorChecker {
    /**
     * Function to read server list
     */
    async getListOfServers({ path = 'serverList.json' }) {
        try {

            // check if list of servers exists
            await this.doesFileExist(path)

            // read and return list of servers
            let data = await readFile(path)
            data = JSON.parse(data)

            // //check if list is empty
            await this.isListEmpty(data);

            return data;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     * Function to get servers that are online
     */
    async findOnlineServers({ serverList }) {
        try {

            const onlineServers = [];
            const promises = serverList.map(async (server) => {
                try {
                    const response = await axios(`${server.url}`, { timeout: 5000 });

                    // if  199 < statusCode < 300 server is online
                    if ((response.status > 199) && (response.status < 300)) {
                        onlineServers.push(server)
                    }

                    return response.status;
                } catch (error) {
                    // console.log(`offline servers:${server.url}`);
                }
            });

            await Promise.all(promises);

            // Reject if all servers are offline
            if (onlineServers.length == 0) throw new Error('All servers are Offline.');

            return onlineServers;
        } catch (error) {
            throw new Error(error.message)
        }
    }

    /**
     * Function to sort servers ascending order of priority
     */
    async sortServersPriorityWise({ servers }) {
        return servers.sort(function (a, b) {
            return a.priority - b.priority
        })
    }

    /**
     * Main function
     */
    async findServer({ path = 'serverList.json' }) {
        try {
            // Get server list

            const serverList = await this.getListOfServers({ path });

            // Find online servers
            const onlineServers = await this.findOnlineServers({ serverList });

            // Sort online servers based on priority
            const sortedOnlineServers = await this.sortServersPriorityWise({ servers: onlineServers })

            return sortedOnlineServers[0];
        } catch (error) {
            throw new Error(error.message)
        }
    }
}

// (async () => {
//     try {
//         const serverChecker = new ServerCheck();

//         const data = await serverCheck.findServer({ path: 'testCase3.json' })

//         console.log(data);
//     } catch (error) {
//         console.log(error.message);
//     }
// })()

module.exports = ServerChecker;