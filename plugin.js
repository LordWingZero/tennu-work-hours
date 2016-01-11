var moment = require('moment-business-days');
var format = require("util").format;
var calendar = require('./lib/calendar');

var TennuWorkHours = {
    configDefaults: {
        "work-hours": {
            "hour": 7,
            "minute": 30,
            "second": 0
        }
    },
    init: function(client) {

        var holidays = calendar.getMSUHolidays().then(function(holidays) {
            moment.locale('us', {
                holidays: holidays,
                holidayFormat: 'MMMM D, YYYY'
            });
        });

        function handleWorkHours(IRCMessage) {
            return holidays.then(function() {
                var nextBusinessDay = moment().nextBusinessDay();
                nextBusinessDay.set({
                    'hour': client.config("work-hours").hour,
                    'minute': client.config("work-hours").minute,
                    'second': client.config("work-hours").second,
                });

                var nickname = IRCMessage.nickname;
                if (IRCMessage.args[0] && IRCMessage.args[0].indexOf('@') > -1) {
                    nickname = IRCMessage.args[0].replace('@', '');
                }

                return format('%s, you work in about %s.', nickname, nextBusinessDay.from(moment()));
            });
        }

        return {
            commands: ['workin'],
            handlers: {
                "!workin": handleWorkHours
            },
            help: {
                "{{!}}workin": "Returns the time until the next business day from now."
            }
        };

    }
};

module.exports = TennuWorkHours;