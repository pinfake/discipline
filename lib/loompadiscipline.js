'use strict';
var EventEmitter = require('events').EventEmitter;
var winston = require('winston');
var Configuration = require('./config.js');

var LoompaDiscipline = function (configFile) {
    this.config = new Configuration().parseConfigFile(configFile);
    this.logger = new (winston.Logger)({
        transports: [
            new (winston.transports.Console)({
                colorize: true,
                timestamp: true
            }),
            new (winston.transports.File)({
                filename: this.config.global.logFile,
                timestamp: true,
                json: false
            })
        ]
    });
};

LoompaDiscipline.prototype._checkQueueStatus = function( queueId ) {
    this.logger.log( 'info', "checking queue status for '" + queueId + "'");
    this.logger.log( 'info', "\tExecuting: " + this.config.queues[queueId].queueStatusCmd );
};

LoompaDiscipline.prototype.run = function () {
    for (var queue in this.config.queues) {
        if (this.config.queues.hasOwnProperty(queue)) {
            setInterval( (this._checkQueueStatus).bind(this),
                this.config.queues[queue].queueStatusCheckDelay * 1000,
                queue);
        }
    }

    var ee = new EventEmitter();
    ee.on('someEvent', function (self) {
        self.logger.log('info', 'someEvent received');
    });

    ee.emit('someEvent', this);
    this.logger.log('info', 'We are running');
};

module.exports = LoompaDiscipline;
