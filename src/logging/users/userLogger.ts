var bunyan = require('bunyan');

var userLogger = bunyan.createLogger({
    name: 'UserLogger',
    streams: [
        {
            level: 'info',
            path: __dirname + '/users.log',
        }
    ]
});

export default userLogger;
