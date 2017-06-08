/**
 * Koa config
 */

'use strict'

const logger = require('./logger')
const routes = require('./routes')
const helmet = require('koa-helmet')
const compress = require('koa-compress')
const koaBody = require('koa-body')

module.exports = function(app) {
    // configure logger
    logger(app)

    // security
    app.use(helmet())

    // body parser
    app.use(koaBody())

    // configure routes
    routes(app)

    // Compress
    app.use(compress())
}