'use strict';
var EventEmitter = require('events').EventEmitter;
var childProcess = require('child_process');
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
        logger.log('info', "Executing: " + config.queues[queueId].queueStatusCmd);
        // TODO: change config to allow cwd configuration for every external command
        childProcess.exec(config.queues[queueId].queueStatusCmd,
            {
                timeout: 60000
            }, queueStatusCmdCallback.bind(this, queueId));
    };

    var queueStatusCmdCallback = function (queueId, error, stdout) {
        if (error !== null) {
            handleQueueStatusCmdError(queueId, error);
        } else {
            handleQueueStatusCmdSuccess(queueId, stdout);
        }
    };

    var handleQueueStatusCmdSuccess = function (queueId, output) {
        logger.log('info', '[' + queueId + '] queueStatusCmd output: ' + output);
    };

    var handleQueueStatusCmdError = function (queueId, error) {
        logger.log('error', '[' + queueId + '] queueStatusCmd error: ' + error);
    };

    var moreThanMaxPendingJobs = function (queueId, queueStatus) {
        return( queueStatus.messageCount > config.queues[queueId].maxPendingJobs );
    };

    var lessThanMaxConsumers = function (queueId, queueStatus) {
        return( queueStatus.consumerCount < config.queues[queueId].maxConsumers );
    };

    var moreThanMinConsumers = function (queueId, queueStatus) {
        return( queueStatus.consumerCount > config.queues[queueId].minConsumers );
    };

    var lessThanMinPendingJobs = function (queueId, queueStatus) {
        return( queueStatus.messageCount < config.queues[queueId].minPendingJobs );
    };

    var shouldSpawnConsumer = function (queueId, queueStatus) {
        return( moreThanMaxPendingJobs(queueId, queueStatus) &&
            lessThanMaxConsumers(queueId, queueStatus) );
    };

    var shouldKillConsumer = function (queueId, queueStatus) {
        return( lessThanMinPendingJobs(queueId, queueStatus) &&
            moreThanMinConsumers(queueId, queueStatus) );
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
