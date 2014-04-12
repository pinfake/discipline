var should = require('chai').should();
var Config = require('../lib/config.js');

describe('Config parsing', function () {

    var config = new Config();

    it('parseConfig should throw SyntaxError on malformed JSON config file', function () {
        var jsonString = 'wowowow';
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError);
    });
    it('parseConfig should throw ParseError on missing global property', function () {
        var jsonString = '{ "test": "test" }';
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"global" property is not defined'
            );
    });
    it('parseConfig should throw ParseError on missing queues property', function () {
        var jsonString = '{ "global": "global" }';
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"queues" property is not defined'
            );
    });
    it('parseConfig should throw ParseError if there are no queues defined', function () {
        var cfg = {
            'global': 'global',
            'queues': {
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                'No queues defined on the "queues" object'
            );
    });
    it('parseConfig should throw ParseError if queues is not an object', function () {
        var cfg = {
            'global': 'global',
            'queues': 'queues'
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                'No queues defined on the "queues" object'
            );
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a queueName', function () {
        var cfg = {
            'global': 'global',
            'queues': {
                'q1': {}
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "queueName" property is not defined'
            );
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a spawnConsumerCmd', function () {
        var cfg = {
            'global': 'global',
            'queues': {
                'q1': {
                    'queueName': 'aQueue'
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "spawnConsumerCmd" property is not defined'
            );
    });
    it('parseConfig should throw ParseError if a queue doesn\'t define a killConsumerCmd', function () {
        var cfg = {
            'global': 'global',
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd'
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "killConsumerCmd" property is not defined'
            );
    });
    it('parseConfig should throw ParseError if neither queue or global define maxPendingJobs', function () {
        var cfg = {
            'global': {
            },
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd',
                    'killConsumerCmd': 'killCmd'
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "maxPendingJobs" property is neither defined on queue config nor in global config'
            );
    });
    it('parseConfig should throw ParseError if neither queue or global define minPendingJobs', function () {
        var cfg = {
            'global': {
            },
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd',
                    'killConsumerCmd': 'killCmd',
                    'maxPendingJobs': 500
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "minPendingJobs" property is neither defined on queue config nor in global config'
            );
    });
    it('parseConfig should throw ParseError if neither queue or global define maxConsumers', function () {
        var cfg = {
            'global': {
            },
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd',
                    'killConsumerCmd': 'killCmd',
                    'maxPendingJobs': 500,
                    'minPendingJobs': 10
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "maxConsumers" property is neither defined on queue config nor in global config'
            );
    });
    it('parseConfig should throw ParseError if neither queue or global define minConsumers', function () {
        var cfg = {
            'global': {
            },
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd',
                    'killConsumerCmd': 'killCmd',
                    'maxPendingJobs': 500,
                    'minPendingJobs': 10,
                    'maxConsumers': 20
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "minConsumers" property is neither defined on queue config nor in global config'
            );
    });
    it('parseConfig should throw ParseError if neither queue or global define queueStatusCheckDelay', function () {
        var cfg = {
            'global': {
            },
            'queues': {
                'q1': {
                    'queueName': 'aQueue',
                    'spawnConsumerCmd': 'spawnCmd',
                    'killConsumerCmd': 'killCmd',
                    'maxPendingJobs': 500,
                    'minPendingJobs': 10,
                    'maxConsumers': 20,
                    'minConsumers': 1
                }
            }
        };
        var jsonString = JSON.stringify(cfg);
        (function () {
            config.parseConfig(jsonString);
        }).should.throw(SyntaxError,
                '"q1": "queueStatusCheckDelay" property is neither defined on queue config nor in global config'
            );
    });
});
