/**
 * Koa config
 */

'use strict'

const bodyParser = require('koa-bodyparser')()
const boom = require('boom')
const compress = require('koa-compress')()
const helmet = require('koa-helmet')()
const logger = require('./logger')()
const router = require('./router')()

module.exports = function(app) {
    // configure logger
    app.use(logger)

    // security
    app.use(helmet)

    // body parser
    app.use(bodyParser) 
    
    // Global errorHandler
    app
        .use(async(ctx, next) => {
            try {
                await next();
            } catch (err) {
                ctx.status = err.statusCode || err.status || 500
                ctx.body = err.message || 'Something went wrong!'
                ctx.app.emit('error', err, ctx);
            }
        })
        .use(router.routes())
        .use(router.allowedMethods({
            throw: true,
            notImplemented: () => new boom.notImplemented(),
            methodNotAllowed: () => new boom.methodNotAllowed()
        }))

    // Compress
    app.use(compress)
}