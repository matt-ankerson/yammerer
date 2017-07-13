'use strict'

const http2 = require('http2')
const fs = require('fs')
const app = module.exports = new(require('koa'))()
const path = require('path')
const rfs = require('rotating-file-stream')
const morgan = require('koa-morgan')
const helmet = require('koa-helmet')()
const bodyParser = require('koa-bodyparser')()
const router = require('./router')()

const options = {
    key: fs.readFileSync(__dirname + '/certificate/server.key'),
    cert: fs.readFileSync(__dirname + '/certificate/server.crt')
};

process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.PORT = process.env.PORT || 9000

if (process.env.NODE_ENV === 'development') {
    app.use(require('koa-logger')())
} else {
    // ensure log directory exists
    const logDirectory = path.join(__dirname, 'log')
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

    // create a rotating write stream
    const accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory
    })

    // file logger
    app.use(morgan('combined', {
        skip: function(req, res) {
            return res.statusCode < 400
        },
        stream: accessLogStream
    }))
}

// security
app.use(helmet)

// parse posts request body
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
    .use(router.allowedMethods())

http2
    .createServer(options, app.callback())
    .listen(443)

//app.listen(process.env.PORT || 9000)