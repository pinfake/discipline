var should = require('chai').should();
var Config = require('../lib/config.js');

describe('Config parsing', function() {
    
    var config = new Config();

    it('parseConfig should throw SyntaxError on malformed JSON config file', function() { 
        var jsonString = 'wowowow';
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError ); 
    });
    it('parseConfig should throw ParseError on missing global property', function() {
        var jsonString = '{ "test": "test" }';
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            '"global" property is not defined'
         ); 
    });
});
