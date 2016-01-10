var should = require('should');
var calendar = require('../lib/calendar');

describe('tennu-work-hours', function() {
    it('Should fetch and parse dates', function(done) {
        calendar.getMSUHolidays()
        // .then(function(holidays){
        //     console.log(holidays);
        //     done();
        // }).catch(function(err){
        //     console.log(err);
        // });
    });
    it('Should pull in holidays', function(){
        var plugin = require('../plugin').init();
        plugin.handlers["!workin"]();
    });
});