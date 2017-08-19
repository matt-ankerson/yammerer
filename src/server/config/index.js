'use strict'

const path = require('path')

// Base config
module.exports = {
    env: process.env.APPSETTING_NODE_ENV || 'development',
    root: path.normalize(__dirname + '/../..'),
    port: process.env.WEBSITES_PORT || 3000,
    logType: process.env.APPSETTING_LOG_TYPE || 'dev',
    logSkip: function(req, res) { return res.statusCode < 400 },
    dbConnectionString: process.env.DOCDBCONNSTR_YAMMERERDB || 'mongodb://localhost:27017/yammerer'
}
