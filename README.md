# server-list-checker module
This module checks the online presence of servers from a list of servers and returns server which is online and has least priority value.

## Installation
Clone this module in local machine:
```
git clone git@github.com:jalakpatoliya/server-checker-node-module.git 
```

To install dependencies and dev-dependencies:
1. goto server-checker-node-module:
```
cd server-checker-node-module
```
2. Install dependencies:
```
npm install
```

## To Test the module
```
npm run test
```

## To use it in any personal project
Make project:
```
mkdir demo-project
```

Now move into your new project:
```
cd demo-project
```

Initialize your folder with npm:
```
npm init -y 
```

Install server-checker module and use the --save flag so it will be recorded in your package.json file:
```
npm install --save ../server-checker-node-module
```

Create a test case using below code and save it as serverList.json:
```
[
    {
        "url": "http://doesNotExist.boldtech.co",
        "priority": 1
    },
    {
        "url": "http://boldtech.co",
        "priority": 7
    },
    {
        "url": "http://offline.boldtech.co",
        "priority": 2
    },
    {
        "url": "http://google.com",
        "priority": 4
    }
]
```

Create index.js file in demo-project with below code:
```
const ServerChecker = require('server-checker-node-module');

const serverChecker = new ServerChecker();

(async () => {
    try {
        const data = await serverChecker.findServer({ path: 'serverList.json' })

        console.log(data);
    } catch (error) {
        console.log(error.message);
    }
})()
```

Run index.js file to check servers of serverList.json:
```
node index.js
```

Change url and priority in serverList.json to check your servers list.
Or
Create new json files and use replace path of json file in findServer() in index.js

## License
[MIT](https://choosealicense.com/licenses/mit/)

