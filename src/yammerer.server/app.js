'use strict'

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development'

const config = require('./config/environment')
const Koa = require('koa')
require('./model/db')(function() {
    // Once connected to the database
    const app = module.exports = new Koa()
    require('./config/koa')(app)
    app.listen(config.port, config.ip)
})