'use strict';

var opt = require('node-getopt').create([
        ['c', 'conf=',           'configuration file pathname'],
        ['h', 'help',            'display this help'],
        ['v', 'version',         'show version']
    ])
    .bindHelp()
    .parseSystem();

if( !opt.options.conf ) {
    console.log("You must specify the configuration file. Use -h for command line help.");
    return -1;
}

var LoompaDiscipline = require('./loompadiscipline.js');
var discipline = new LoompaDiscipline( opt.options.conf );
discipline.run();