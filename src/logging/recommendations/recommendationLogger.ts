import bunyan = require('bunyan');

const recommendationsLogger = bunyan.createLogger({
	name: 'RecommendationLogger',
	streams: [
		{
			level: 'info',
			path: __dirname + '/recommendations.log',
		},
	],
});

export default recommendationsLogger;
