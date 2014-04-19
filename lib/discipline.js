'use strict';
var EventEmitter = require('events').EventEmitter;
var childProcess = require('child_process');
var winston = require('winston');
var configuration = require('./config.js');

var discipline = (function () {
    var configFile;
    var config;
    var logger;

    var initialize = function (cfgFile) {
        configFile = cfgFile;
        config = configuration.parseConfigFile(configFile);
        logger = getLogger(config.global.logFile, true);
        for (var queue in config.queues) {
            if (config.queues.hasOwnProperty(queue) && config.queues[queue].hasOwnProperty('logFile')) {
                config.queues[queue].logger = getLogger( config.queues[queue].logFile );
            }
        }
    };

    var getLogger = function ( logFile, console ) {
        var transports = [];
        if( logFile === undefined || console ) {
            transports.push(
                new (winston.transports.Console)({
                    colorize: true,
                    timestamp: true
                })
            );
        } else {
            transports.push(
                new (winston.transports.File)({
                    filename: logFile,
                    timestamp: true,
                    json: false
                })
            );
        }

        return new (winston.Logger)({
            transports: transports
        });
    };

    var checkQueueStatus = function (queueId) {
        var queue = config.queues[queueId];
        var cmd = config.queues[queueId].queueStatusCmd;

        queueLog(queueId, 'info', "checking queue status for '" + queueId + "'");
        queueLog(queueId, 'info', "Executing: " + cmd.cmd);
        childProcess.exec(cmd.cmd,
            {
                cwd: cmd.cwd,
                timeout: cmd.timeout
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
        var status;
        queueLog(queueId, 'info', 'queueStatusCmd output: ' + output);
        try {
            status = JSON.parse(output);
        } catch (e) {
            queueLog(queueId, 'error', 'Error parsing queueStatusCmd output: ' + e.message );
            return;
        }
        if( shouldSpawnConsumer(queueId, status) ) {
            queueLog(queueId, 'info', 'We should spawn a consumer!');
        } else
        if( shouldKillConsumer(queueId, status)) {
            queueLog(queueId, 'info', 'We should kill a consumer!');
        } else {
            queueLog(queueId, 'info', 'Everything is under control, no need to take action.');
        }
    };

    var queueLog = function( queueId, level, message ) {
        if( config.queues[queueId].logger ) {
            config.queues[queueId].logger.log(level, '[' + queueId + '] ' + message );
        }

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

    var lessThanMinConsumers = function (queueId, queueStatus) {
        return( queueStatus.consumerCount < config.queues[queueId].minConsumers );
    };

    var lessThanMinPendingJobs = function (queueId, queueStatus) {
        return( queueStatus.messageCount < config.queues[queueId].minPendingJobs );
    };

    var shouldSpawnConsumer = function (queueId, queueStatus) {
        return( lessThanMinConsumers(queueId, queueStatus) ||
            (moreThanMaxPendingJobs(queueId, queueStatus) &&
            lessThanMaxConsumers(queueId, queueStatus)) );
    };

    var shouldKillConsumer = function (queueId, queueStatus) {
        return( lessThanMinPendingJobs(queueId, queueStatus) &&
            moreThanMinConsumers(queueId, queueStatus) );
    };

    var clearAllIntervals = function( ) {
        for (var queue in config.queues) {
            if (config.queues.hasOwnProperty(queue) && config.queues[queue].hasOwnProperty('_statusCheckInterval')) {
                clearInterval( config.queues[queue]._statusCheckInterval );
            }
        }
    };

    return {

        reload: function() {
            clearAllIntervals();
            this.run(configFile);
        },

        run: function (configFile) {
            initialize(configFile);
            for (var queue in config.queues) {
                if (config.queues.hasOwnProperty(queue)) {
                    config.queues[queue]._statusCheckInterval = setInterval((checkQueueStatus).bind(this),
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
