var fetch = require('node-fetch');
var cheerio = require('cheerio');
var _ = require('lodash');
var format = require('util').format;

const MSUStaffURL = 'http://calendar.missouristate.edu/staffholiday.aspx';

function getMSUHolidays() {
    return fetch(MSUStaffURL)
        .then(function(res) {
            return res.text();
        }).then(function(body) {
            $ = cheerio.load(body, {
                normalizeWhitespace: true
            });

            var rawDates = $('li.Date').map(function(index, element) {
                return $(element).text();
            }).get();

            var extrapolatedRangeDates = convertRange(rawDates);

            _.remove(rawDates, function(date){
                return date.indexOf(/–/) > -1;
            });

            var holidays = rawDates.concat(extrapolatedRangeDates);
            
            return holidays;

        });
}

function convertRange(dates) {

    var dateRanges = locateRanges(dates);

    return _.reduce(dateRanges, function(accumulator, date) {
        // Turn the range into actual dates
        var formattedDates = _.map(date.split(/–/), _.trim);
        
        // Add those actual dates to the array we eventually return
        accumulator.push(formattedDates);

        // Get the days out so we can build the missing date strings
        var dateRangeDays = getDaysFromDate(formattedDates);

        var loopTimes = (dateRangeDays[1] - dateRangeDays[0]);
        var newDates = [];
        for (var i = 1; i < loopTimes; i++) {
            var month = formattedDates[0].match(/(^\w+)/i)[0];
            var year = formattedDates[0].match(/^\w+\s\d+\,\s(\d+)$/i)[1];
            newDates.push(format('%s %s, %s', month, (parseInt(dateRangeDays) + i), year));
        }

        accumulator.push(newDates);

        return _.flatten(accumulator);

    }, []);
}

function locateRanges(dates) {
    return dates.filter(function(date) {
        var match = date.match(/^\w+\s\d+\,\s\d+\s\–\w+\s\d+\,\s\d+$/i);
        if (match) {
            return _.remove(dates, function(date) {
                return date === match[0];
            });
        }
    });
}

function getDaysFromDate(dates) {
    return dates.map(function(date) {
        var match = date.match(/^\w+\s(\d+)\,\s\d+$/i);
        return match[1];
    });
}

module.exports = {
    getMSUHolidays: getMSUHolidays
}