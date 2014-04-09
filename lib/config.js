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
            this._checkQueueConfig( config.queues[queue] );
        } catch( e ) {
            throw new SyntaxError( '"'+queue+'": ' + e.message );
        }
    }

    return( config );
};

Config.prototype._checkQueueConfig = function ( queueConfig )
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
};

Config.prototype.parseConfigFile = function( pathname )
{
};

module.exports = Config;
