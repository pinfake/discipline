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
    it('parseConfig should throw ParseError on missing queues property', function() {
        var jsonString = '{ "global": "global" }';
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            '"queues" property is not defined'
         ); 
    });
    it('parseConfig should throw ParseError if there are no queues defined', function() {
        var cfg = {
            'global': 'global',
            'queues': { 
            }
        }
        var jsonString = JSON.stringify( cfg );
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            'No queues defined on the "queues" object'
         ); 
    });
    it('parseConfig should throw ParseError if queues is not an object', function() {
        var cfg = {
            'global': 'global',
            'queues': 'queues'
        }
        var jsonString = JSON.stringify( cfg );
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            'No queues defined on the "queues" object'
         ); 
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a queueName', function() {
        var cfg = {
            'global': 'global',
            'queues': { 
                'q1': {}
            }
        }
        var jsonString = JSON.stringify( cfg );
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            '"q1": "queueName" property is not defined'
         ); 
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a spawnConsumerCmd', function() {
        var cfg = {
            'global': 'global',
            'queues': { 
                'q1': {
                    'queueName': 'aQueue'
                }
            }
        }
        var jsonString = JSON.stringify( cfg );
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            '"q1": "spawnConsumerCmd" property is not defined'
         ); 
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a killConsumerCmd', function() {
        var cfg = {
            'global': 'global',
            'queues': { 
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd'
                }
            }
        }
        var jsonString = JSON.stringify( cfg );
        (function() {config.parseConfig( jsonString )}).should.throw( SyntaxError,
            '"q1": "killConsumerCmd" property is not defined'
         ); 
    });
});
