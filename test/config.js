var Config = require('../lib/config.js');

describe('Config parsing', function () {

    var config = new Config();

    describe('General', function () {
        it('parseConfig should return an Object', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).should.be.a('Object');
        });

        it('parseConfig returned Object should have the "queues" property defined', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).should.have.property('queues');
        });

        it('parseConfig returned Object "queues" property should be an object', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.should.be.a('Object');
        });

        it('parseConfig returned queues config should have all queues properties defined', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.should.have.property('q1');
        });

        it('parseConfig returned individual queue configs should be Objects', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.should.be.a('Object');
        });
    });

    describe('Error parsing', function () {
        it('parseConfig should throw SyntaxError on malformed JSON config file', function () {
            var jsonString = 'wowowow';
            (function () {
                config.parseConfig(jsonString);
            }).should.throw(SyntaxError);
        });
        it('parseConfig should throw SyntaxError on missing global property', function () {
            var jsonString = '{ "test": "test" }';
            (function () {
                config.parseConfig(jsonString);
            }).should.throw(SyntaxError,
                    '"global" property is not defined'
                );
        });
        it('parseConfig should throw SyntaxError on missing queues property', function () {
            var jsonString = '{ "global": "global" }';
            (function () {
                config.parseConfig(jsonString);
            }).should.throw(SyntaxError,
                    '"queues" property is not defined'
                );
        });
        it('parseConfig should throw SyntaxError if there are no queues defined', function () {
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
        it('parseConfig should throw SyntaxError if queues is not an object', function () {
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
        it('parseConfig should throw SyntaxError if a queue doesn\'t define a queueName', function () {
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
        it('parseConfig should throw SyntaxError if a queue doesn\'t define a spawnConsumerCmd', function () {
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
        it('parseConfig should throw SyntaxError if a queue doesn\'t define a killConsumerCmd', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define maxPendingJobs', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define minPendingJobs', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define maxConsumers', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define minConsumers', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define queueStatusCheckDelay', function () {
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
        it('parseConfig should throw SyntaxError if neither queue or global define queueStatusCmd', function () {
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
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            (function () {
                config.parseConfig(jsonString);
            }).should.throw(SyntaxError,
                    '"q1": "queueStatusCmd" property is neither defined on queue config nor in global config'
                );
        });
    });

    describe('Inheritance from global config', function () {
        it('parseConfig should set queue "maxPendingJobs" from global if not defined on queue', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.should.have.property('maxPendingJobs');
            config.parseConfig(jsonString).queues.q1.maxPendingJobs.should.be.equal(220);
        });

        it('parseConfig should retain queue "maxPendingJobs" value from queue config if its defined on both global and queue', function () {
            var cfg = {
                'global': {
                    'maxPendingJobs': 220
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'maxPendingJobs': 111,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.maxPendingJobs.should.be.equal(111);
        });

        it('parseConfig should set queue "minPendingJobs" from global if not defined on queue', function () {
            var cfg = {
                'global': {
                    'minPendingJobs': 2
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'maxPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.should.have.property('minPendingJobs');
            config.parseConfig(jsonString).queues.q1.minPendingJobs.should.be.equal(2);
        });

        it('parseConfig should retain queue "minPendingJobs" value from queue config if its defined on both global and queue', function () {
            var cfg = {
                'global': {
                    'minPendingJobs': 2
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'maxPendingJobs': 111,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.minPendingJobs.should.be.equal(10);
        });

        it('parseConfig should set queue "queueStatusCheckDelay" from global if not defined on queue', function () {
            var cfg = {
                'global': {
                    'queueStatusCheckDelay': 99
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxPendingJobs': 800,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.should.have.property('queueStatusCheckDelay');
            config.parseConfig(jsonString).queues.q1.queueStatusCheckDelay.should.be.equal(99);
        });

        it('parseConfig should retain queue "maxPendingJobs" value from queue config if its defined on both global and queue', function () {
            var cfg = {
                'global': {
                    'queueStatusCheckDelay': 99
                },
                'queues': {
                    'q1': {
                        'queueName': 'aQueue',
                        'spawnConsumerCmd': 'spawnCmd',
                        'killConsumerCmd': 'killCmd',
                        'minPendingJobs': 10,
                        'maxConsumers': 20,
                        'minConsumers': 1,
                        'queueStatusCheckDelay': 60,
                        'maxPendingJobs': 111,
                        'queueStatusCmd': 'statusCmd'
                    }
                }
            };
            var jsonString = JSON.stringify(cfg);
            config.parseConfig(jsonString).queues.q1.queueStatusCheckDelay.should.be.equal(60);
        });
    });
});

