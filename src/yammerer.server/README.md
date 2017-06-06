# Backend server for Yammerer buit with node.js and MongoDb.

## Running the App in Dev Mode from Local Machine

### Set-up MongoDb

1. [Install MongoDb](https://www.mongodb.com/download-center#community) on to your C drive
2. Copy the mongod.cfg file from the yammerer>install folder to your c:\mongodb\bin folder
3. Edit the mongod.cfg.
3. To run mongodb, open a command prompt and navigate to the mongodb bin folder. type "run".    
* Optional - [Install Robomongo](https://robomongo.org/download): This is a native MongoDb management tool.

### Running the App

1. [Install Node.js](https://nodejs.org/en/) v >=7.6.0
2. Update npm:   
`npm install npm@latest -g`
3. Open a command prompt, navigate to the yammerer.server folder and run    
`npm install`    
 It will download all the required node modules.
4. Run `node app.js` to start the app.

### Debug
The app use the [debug](https://github.com/visionmedia/debug) module. So to see output you need to set the env variable DEBUG to *    
`SET DEBUG=*`