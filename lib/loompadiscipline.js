'use strict';
var winston = require( 'winston' );
var Configuration = require( './config.js' );
var LoompaDiscipline = function( configFile ) {
    this.config = new Configuration().parseConfigFile( configFile );
    this.logger = new (winston.Logger)({
        transports: [

            new (winston.transports.File)({ filename: this.config.global.logFile })//,
            //new (winston.transports.Console)()

        ]
    });
};

LoompaDiscipline.prototype.run = function() {
    this.logger.log( 'info', 'We are running' );
    while( true ) {
    }
};

module.exports = LoompaDiscipline;
