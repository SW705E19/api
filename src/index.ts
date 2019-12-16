import 'reflect-metadata';
import { createConnection } from 'typeorm';
import * as express from 'express';
import * as bodyParser from 'body-parser';
import * as helmet from 'helmet';
import * as cors from 'cors';
import routes from './routes';

//Connects to the Database -> then starts the express
createConnection();

const app = express();

// Call midlewares
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());

//Set all routes from routes folder
app.use('/', routes);

const port = 8393;
const server = app.listen(port, () => {
	console.log(`Server started on port ${port}`);
});

export default server;
