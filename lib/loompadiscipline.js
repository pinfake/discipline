'use strict';
var winston = require( 'winston' );
var Configuration = require( './config.js' );
var LoompaDiscipline = function( configFile ) {
    this.config = new Configuration().parseConfigFile( configFile );
    this.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                timestamp: true
            }),
            new (winston.transports.File)({
                filename: this.config.global.logFile,
                timestamp: true,
                json: false
            })
        ]
    });
};

LoompaDiscipline.prototype.run = function() {
    this.logger.log( 'info', 'We are running' );
};

module.exports = LoompaDiscipline;
