import bunyan = require('bunyan');

const serviceLogger = bunyan.createLogger({
	name: 'ServiceLogger',
	streams: [
		{
			level: 'info',
			path: __dirname + '/services.log',
		},
	],
});

export default serviceLogger;
