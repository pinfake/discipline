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

    if (!config.queues) {
        throw new SyntaxError('"queues" property is not defined');
    }

    if (!(config.queues instanceof Object) || Object.keys(config.queues).length == 0) {
        throw new SyntaxError('No queues defined on the "queues" object');
    }

    for (var queue in config.queues) {
        try {
            this._parseQueueConfig(config.queues[queue], config.global);
        } catch (e) {
            throw new SyntaxError('"' + queue + '": ' + e.message);
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
            throw new SyntaxError('"' + property + '" property is neither defined on queue config nor in global config');
        } else {
            queueConfig[property] = globalConfig[property];
        }
    }
};

Config.prototype._parseQueueConfig = function (queueConfig, globalConfig) {
    this._parseQueueConfigProperty('queueName', queueConfig);
    this._parseQueueConfigProperty('spawnConsumerCmd', queueConfig);
    this._parseQueueConfigProperty('killConsumerCmd', queueConfig);
    this._parseQueueConfigProperty('maxPendingJobs', queueConfig, globalConfig);
    this._parseQueueConfigProperty('minPendingJobs', queueConfig, globalConfig);
    this._parseQueueConfigProperty('maxConsumers', queueConfig, globalConfig);
    this._parseQueueConfigProperty('minConsumers', queueConfig, globalConfig);
    this._parseQueueConfigProperty('queueStatusCheckDelay', queueConfig, globalConfig);
};

Config.prototype.parseConfigFile = function (pathname) {
};

module.exports = Config;
