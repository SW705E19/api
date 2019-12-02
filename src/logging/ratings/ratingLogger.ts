import bunyan = require('bunyan');

const ratingLogger = bunyan.createLogger({
	name: 'RatingLogger',
	streams: [
		{
			level: 'info',
			path: __dirname + '/ratings.log',
		},
	],
});

export default ratingLogger;
