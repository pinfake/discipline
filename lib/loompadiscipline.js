'use strict';
var EventEmitter = require('events').EventEmitter;
var winston = require('winston');
var configuration = require('./config.js');

var Discipline = function (configFile) {
    var config = configuration.parseConfigFile(configFile);
    var logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                timestamp: true
            }),
            new (winston.transports.File)({
                filename: config.global.logFile,
                timestamp: true,
                json: false
            })
        ]
    });

    var checkQueueStatus = function( queueId ) {
        logger.log( 'info', "checking queue status for '" + queueId + "'");
        logger.log( 'info', "\tExecuting: " + config.queues[queueId].queueStatusCmd );
    };

    return {
        run: function () {
            for (var queue in config.queues) {
                if (config.queues.hasOwnProperty(queue)) {
                    setInterval( (checkQueueStatus).bind(this),
                        config.queues[queue].queueStatusCheckDelay * 1000,
                        queue);
                }
            }

            var ee = new EventEmitter();
            ee.on('someEvent', function () {
                logger.log('info', 'someEvent received');
            });

            ee.emit('someEvent');
            logger.log('info', 'We are running');
        }
    };
};

module.exports = Discipline;
