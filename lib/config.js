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

    return( config );
};

Config.prototype.parseConfigFile = function( pathname )
{
};

module.exports = Config;
