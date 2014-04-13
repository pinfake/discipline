'use strict';
var fs = require('fs');
var Config = function () {
};

Config.prototype.parseConfig = function (jsonString) {
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

    if (!(config.queues instanceof Object) || Object.keys(config.queues).length == 0) {
        throw new SyntaxError('No queues defined on the "queues" object');
    }

    for (var queue in config.queues) {
        if (config.queues.hasOwnProperty(queue)) {
            try {
                config.queues[queue] = this._parseQueueConfig(config.queues[queue], config.global);
            } catch (e) {
                throw new SyntaxError('"' + queue + '": ' + e.message);
            }
        }
    }

    return( config );
};

Config.prototype._parseQueueConfigProperty = function (property, queueConfig, globalConfig) {
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

Config.prototype._replaceQueueVariables = function (queueConfig) {
    queueConfig.spawnConsumerCmd =
        queueConfig.spawnConsumerCmd.replace(/{\$queueName}/i, queueConfig.queueName);
    queueConfig.killConsumerCmd =
        queueConfig.killConsumerCmd.replace(/{\$queueName}/i, queueConfig.queueName);
    return( queueConfig );
};

Config.prototype._parseQueueConfig = function (queueConfig, globalConfig) {
    queueConfig = this._parseQueueConfigProperty('queueName', queueConfig);
    queueConfig = this._parseQueueConfigProperty('spawnConsumerCmd', queueConfig);
    queueConfig = this._parseQueueConfigProperty('killConsumerCmd', queueConfig);
    queueConfig = this._parseQueueConfigProperty('maxPendingJobs', queueConfig, globalConfig);
    queueConfig = this._parseQueueConfigProperty('minPendingJobs', queueConfig, globalConfig);
    queueConfig = this._parseQueueConfigProperty('maxConsumers', queueConfig, globalConfig);
    queueConfig = this._parseQueueConfigProperty('minConsumers', queueConfig, globalConfig);
    queueConfig = this._parseQueueConfigProperty('queueStatusCheckDelay', queueConfig, globalConfig);
    queueConfig = this._parseQueueConfigProperty('queueStatusCmd', queueConfig, globalConfig);
    queueConfig = this._replaceQueueVariables(queueConfig);

    return( queueConfig );
};

Config.prototype.parseConfigFile = function (pathname) {
    var jsonConfig = fs.readFileSync(pathname, {encoding: 'utf8'});
    return( this.parseConfig(jsonConfig) );
};

module.exports = Config;
