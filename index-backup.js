const fs = require("fs");
const { promisify } = require("util");
const axios = require('axios');
const readFile = promisify(fs.readFile);

/**
 * Function to read server list
 */
const getListOfServers = async ({ path = 'serverList.json' }) => {
    try {
        // check if list of servers exists
        if (!fs.existsSync(path)) throw new Error('List of servers not found');

        // read and return list of servers
        data = await readFile(path)
        data = JSON.parse(data)

        return data;
    } catch (error) {
        throw new Error(error.message)
    }
}

/**
 * Function to get servers that are online
 */
const findOnlineServers = async ({ serverList }) => {
    try {

        const onlineServers = [];
        const promises = serverList.map(async (server) => {
            try {

                const response = await axios(`${server.url}`, { timeout: 5000 });

                // if error in response
                if (response.status == undefined) throw new Error(response)

                // if  199 < statusCode < 300 server is online
                if ((response.status > 199) && (response.status < 300)) {
                    onlineServers.push(server)
                }

                return response.status;
            } catch (error) {
                return error.response.status;
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
const sortServersPriorityWise = ({ servers }) => {
    return servers.sort(function (a, b) {
        return a.priority - b.priority
    })
}

/**
 * Main function
 */
const findServer = async ({ path = 'serverList.json' }) => {
    try {
        // Get server list
        const serverList = await getListOfServers({ path });

        // Find online servers
        const onlineServers = await findOnlineServers({ serverList });

        // Sort online servers based on priority
        const sortedOnlineServers = await sortServersPriorityWise({ servers: onlineServers })

        return sortedOnlineServers[0];
    } catch (error) {
        throw new Error(error.message)
    }
}

(async () => {
    try {
        const data = await findServer({ path: 'serverList.json' });
        console.log(data);
    } catch (error) {
        console.log(error);
    }
})()

exports.findServer = findServer;