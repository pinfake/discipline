'use strict';

var getopt = require('node-getopt').create([
        ['c', 'conf=', 'configuration file pathname'],
        ['d', 'daemon', 'run as a daemon'],
        ['h', 'help', 'display this help'],
        ['v', 'version', 'show version']
    ])
    .bindHelp();

var parsedOpt = getopt.parseSystem();

if (!parsedOpt.options.conf) {
    getopt.showHelp();
    //console.log("You must specify the configuration file. Use -h for command line help.");
    return -1;
}

if (parsedOpt.options.daemon) {
    require('daemon')();
}
//console.log( process.pid );
var discipline = require('./discipline.js');
discipline.run(parsedOpt.options.conf);
