'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const http2 = require('http2')
const fs = require('fs')
const Koa = require('koa')
const options = {
    key: fs.readFileSync(__dirname + '/certificate/server.key'),
    cert: fs.readFileSync(__dirname + '/certificate/server.crt')
};
require('./model/db')(function() {
    // Once connected to the database
    const app = module.exports = new Koa()
    require('./config/koa')(app)

    http2
        .createServer(options, app.callback())
        .listen(443)
})
