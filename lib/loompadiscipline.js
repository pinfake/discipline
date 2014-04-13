'use strict';
var Configuration = require( './config.js' );
var LoompaDiscipline = function( configFile ) {
    this.config = new Configuration().parseConfigFile( configFile );
};

LoompaDiscipline.prototype.run = function() {
    console.log( 'We are running' );
};

module.exports = LoompaDiscipline;
