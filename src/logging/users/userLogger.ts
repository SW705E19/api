import bunyan = require('bunyan');

const userLogger = bunyan.createLogger({
    name: 'UserLogger',
    streams: [
        {
            level: 'info',
            path: __dirname + '/users.log',
        },
    ],
});

export default userLogger;
