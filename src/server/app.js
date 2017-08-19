'use strict'

const Koa = require('koa')
const config = require('./config')
require('./model/db')(function() {
    // Once connected to the database
    const app = module.exports = new Koa()
    require('./config/koa')(app)

    app.listen(config.port);
})
