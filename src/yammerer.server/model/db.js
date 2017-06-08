const mongoose = require('mongoose')
const debug = require('debug')('dbconnection')
const config = require('../config/environment')
const user = require('./user')
const post = require('./post')

module.exports = function(onConnected) {
    // Set the default promise library
    mongoose.Promise = require('bluebird')

    const seed = async function() {
        let users = await user.find({}).exec()
        if (users.length === 0) {
            let newUsers = [new user({ name: 'Matt', avatar: 'https://semantic-ui.com/images/avatar/small/matt.jpg' }),
                new user({ name: 'Thomas', avatar: 'https://semantic-ui.com/images/avatar/small/justen.jpg' })
            ]
            users = await user.insertMany(newUsers)
        }

        let post1 = new post({
            content: 'Test Message',
            postedBy: users[0]._id
        });

        await post.create(post1);
    }

    // Set listerners
    mongoose.connection.on('connected', function() {
        debug('Connected to DB ' + config.dbConnectionString)

        if (config.env === 'development') {
            return seed().then(onConnected)
        }
        onConnected()
    })

    // If the connection throws an error
    mongoose.connection.on('error', function(err) {
        debug('Failed to connect to DB ' + config.dbConnectionString + ' on startup ', err)
    })

    // When the connection is disconnected
    mongoose.connection.on('disconnected', function() {
        debug('Mongoose default connection to DB :' + config.dbConnectionString + ' disconnected')
    })

    const gracefulExit = function() {
        mongoose.connection.close(function() {
            debug('Mongoose default connection with DB :' + config.dbConnectionString + ' is disconnected through app termination')
            process.exit(0)
        })
    }

    // If the Node process ends, close the Mongoose connection
    process.on('SIGINT', gracefulExit).on('SIGTERM', gracefulExit)

    try {
        mongoose.connect(config.dbConnectionString)
        debug('Trying to connect to DB ' + config.dbConnectionString)

    } catch (err) {
        debug('Database initialization failed ', err.message)
    }
}