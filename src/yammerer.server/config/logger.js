const fs = require('fs');
const morgan = require('koa-morgan');
const path = require('path');
const rfs = require('rotating-file-stream');
const logger = require('koa-logger');
const config = require('./environment');

module.exports = function() {
    // In dev, add console logging
    if (config.env === 'development') return logger()

    // ensure log directory exists
    const logDirectory = path.join(__dirname, 'log')
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)

    // create a rotating write stream
    const accessLogStream = rfs('access.log', {
        interval: '1d', // rotate daily
        path: logDirectory
    })

    // file logger
    return morgan(config.logType, { skip: config.logSkip, stream: accessLogStream })    
}
