'use strict';
var fs = require('fs');
var Config = function() {
};


Config.prototype.parseConfig = function( jsonString )
{
    var config;
    try {
        config = JSON.parse( jsonString );
    } catch(e) {
        throw(e);
    }

    if( !config.global ) {
        throw new SyntaxError('"global" property is not defined');
    }

    if( !config.queues ) {
        throw new SyntaxError('"queues" property is not defined');
    }

    if( !(config.queues instanceof Object) || Object.keys(config.queues).length == 0 ) {
        throw new SyntaxError('No queues defined on the "queues" object');
    }
    
    for( var queue in config.queues ) {
        try {
            this._parseQueueConfig( config.queues[queue], config.global );
        } catch( e ) {
            throw new SyntaxError( '"'+queue+'": ' + e.message );
        }
    }

    return( config );
};

Config.prototype._parseQueueConfig = function ( queueConfig, globalConfig )
{
    if( !queueConfig.queueName ) {
        throw new SyntaxError('"queueName" property is not defined');
    }
    if( !queueConfig.spawnConsumerCmd ) {
        throw new SyntaxError('"spawnConsumerCmd" property is not defined');
    }
    if( !queueConfig.killConsumerCmd ) {
        throw new SyntaxError('"killConsumerCmd" property is not defined');
    }
    if( !queueConfig.maxPendingJobs ) {
        if( !globalConfig.maxPendingJobs ) {
            throw new SyntaxError('"maxPendingJobs" property is neither defined on queue config nor in global config');
        } else {
            queueConfig.maxPendingJobs = global.maxPendingJobs;
        }
    }
};

Config.prototype.parseConfigFile = function( pathname )
{
};

module.exports = Config;
