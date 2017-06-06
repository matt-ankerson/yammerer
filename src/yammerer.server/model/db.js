const mongoose = require('mongoose');
const debug = require("debug")("dbconnection");
const config = require('../config/environment');

module.exports = function(onConnected) {

    // Set the default promise library
    mongoose.Promise = require("bluebird");

    // Set listerners
    mongoose.connection.on("connected", function(ref) {
        debug("Connected to DB " + config.dbConnectionString);
        onConnected();
    });

    // If the connection throws an error
    mongoose.connection.on("error", function(err) {
        debug('Failed to connect to DB ' + config.dbConnectionString + ' on startup ', err);
    });

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        debug('Mongoose default connection to DB :' + config.dbConnectionString + ' disconnected');
    });

    const gracefulExit = function() {
        mongoose.connection.close(function() {
            debug('Mongoose default connection with DB :' + config.dbConnectionString + ' is disconnected through app termination');
            process.exit(0);
        });
    };

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit);

    try {
        mongoose.connect(config.dbConnectionString);
        debug("Trying to connect to DB " + config.dbConnectionString);

    } catch (err) {
        debug("Database initialization failed ", err.message);
    }
};