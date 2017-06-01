'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

const config = require('./config/environment');
const Koa = require('koa')

const app = module.exports = new Koa();
require('./config/koa')(app);

app.use((ctx) => {
    ctx.body = 'hello, world!';
})

app.listen(config.port, config.ip);