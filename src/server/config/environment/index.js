'use strict'

const path = require('path')
const _ = require('lodash')

// Base config
var base = {
    env: process.env.NODE_ENV,
    root: path.normalize(__dirname + '/../..'),
    port: process.env.PORT || 9000,
    logType: 'dev',
    logSkip: function(req, res) { return false },
    dbConnectionString: 'mongodb://localhost:27017/yammerer'
}

// Overide base config with environment
module.exports = _.merge(base, require('./' + process.env.NODE_ENV + '.js') || {})