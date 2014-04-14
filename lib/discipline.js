'use strict';
var EventEmitter = require('events').EventEmitter;
var winston = require('winston');
var configuration = require('./config.js');

var discipline = (function () {
    var config;
    var logger;
    var initialize = function (configFile) {
        config = configuration.parseConfigFile(configFile);
        logger = new (winston.Logger)({
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
    };

    var checkQueueStatus = function (queueId) {
        logger.log('info', "checking queue status for '" + queueId + "'");
        logger.log('info', "\tExecuting: " + config.queues[queueId].queueStatusCmd);
    };

    var shouldSpawnWorker = function (queueId, queueStatus) {
        return( queueStatus.messageCount > config.queues[queueId].maxPendingJobs );
    };

    var shouldKillWorker = function (queueId, queueStatus) {
        return( queueStatus.messageCount < config.queues[queueId].minPendingJobs );
    };

    return {
        run: function (configFile) {
            initialize(configFile);
            for (var queue in config.queues) {
                if (config.queues.hasOwnProperty(queue)) {
                    setInterval((checkQueueStatus).bind(this),
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
})();

module.exports = discipline;
