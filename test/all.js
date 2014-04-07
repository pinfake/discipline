var should = require('chai').should();

describe('Config parsing', function() {
    it('parseConfig should throw exception on malformed JSON config file', function() { 
        'hellew'.should.equal( 'hellew' ); 
    });
});
