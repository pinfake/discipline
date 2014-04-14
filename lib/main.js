'use strict';

var opt = require('node-getopt').create([
        ['c', 'conf=', 'configuration file pathname'],
        ['d', 'daemon', 'run as a daemon'],
        ['h', 'help', 'display this help'],
        ['v', 'version', 'show version']
    ])
    .bindHelp()
    .parseSystem();

if (!opt.options.conf) {
    console.log("You must specify the configuration file. Use -h for command line help.");
    return -1;
}

if (opt.options.daemon) {
    require('daemon')();
}
//console.log( process.pid );
var discipline = require('./discipline.js');
discipline.run(opt.options.conf);
