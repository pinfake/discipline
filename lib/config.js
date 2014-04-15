'use strict';

var fs = require('fs');

var config = (function () {
    var replaceQueueVariables = function (queueConfig) {
        queueConfig.spawnConsumerCmd =
            queueConfig.spawnConsumerCmd.replace(/{\$queueName}/i, queueConfig.queueName);
        queueConfig.killConsumerCmd =
            queueConfig.killConsumerCmd.replace(/{\$queueName}/i, queueConfig.queueName);
        queueConfig.queueStatusCmd =
            queueConfig.queueStatusCmd.replace(/{\$queueName}/i, queueConfig.queueName);
        return( queueConfig );
    };

    var parseQueueConfigProperty = function (property, queueConfig, globalConfig) {
        if (!queueConfig[property]) {
            if (globalConfig === undefined) {
                throw new SyntaxError('"' + property + '" property is not defined');
            }
            if (!globalConfig[property]) {
                throw new SyntaxError('"' + property +
                    '" property is neither defined on queue config nor in global config');
            } else {
                queueConfig[property] = globalConfig[property];
            }
        }

        return(queueConfig);
    };

    var parseQueueConfig = function (queueConfig, globalConfig) {
        queueConfig = parseQueueConfigProperty('queueName', queueConfig);
        queueConfig = parseQueueConfigProperty('spawnConsumerCmd', queueConfig);
        queueConfig = parseQueueConfigProperty('killConsumerCmd', queueConfig);
        queueConfig = parseQueueConfigProperty('maxPendingJobs', queueConfig, globalConfig);
        queueConfig = parseQueueConfigProperty('minPendingJobs', queueConfig, globalConfig);
        queueConfig = parseQueueConfigProperty('maxConsumers', queueConfig, globalConfig);
        queueConfig = parseQueueConfigProperty('minConsumers', queueConfig, globalConfig);
        queueConfig = parseQueueConfigProperty('queueStatusCheckDelay', queueConfig, globalConfig);
        queueConfig = parseQueueConfigProperty('queueStatusCmd', queueConfig, globalConfig);
        queueConfig = replaceQueueVariables(queueConfig);

        return( queueConfig );
    };

    return {
        parseConfig: function (jsonString) {
            var config;
            try {
                config = JSON.parse(jsonString);
            } catch (e) {
                throw(e);
            }

            if (!config.global) {
                throw new SyntaxError('"global" property is not defined');
            }

            if (!config.global.logFile) {
                throw new SyntaxError('"global.logFile" property is not defined');
            }

            if (!config.queues) {
                throw new SyntaxError('"queues" property is not defined');
            }

            if (!(config.queues instanceof Object) || Object.keys(config.queues).length === 0) {
                throw new SyntaxError('No queues defined on the "queues" object');
            }

            for (var queue in config.queues) {
                if (config.queues.hasOwnProperty(queue)) {
                    try {
                        config.queues[queue] = parseQueueConfig(config.queues[queue], config.global);
                    } catch (e) {
                        throw new SyntaxError('"' + queue + '": ' + e.message);
                    }
                }
            }

            return( config );
        },
        parseConfigFile: function(pathname) {
            var jsonConfig = fs.readFileSync(pathname, {encoding: 'utf8'});
            return( this.parseConfig(jsonConfig) );
        }
    };
})();

module.exports = config;