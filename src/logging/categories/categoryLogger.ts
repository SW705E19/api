import bunyan = require('bunyan');

const categoryLogger = bunyan.createLogger({
	name: 'CategoryLogger',
	streams: [
		{
			level: 'info',
			path: __dirname + '/category.log',
		},
	],
});

export default categoryLogger;
