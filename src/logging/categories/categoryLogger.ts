var bunyan = require('bunyan');

var categoryLogger = bunyan.createLogger({
    name: 'CategoryLogger',
    streams: [
        {
            level: 'info',
            path: __dirname + '/category.log',
        }
    ]
});

export default categoryLogger;
