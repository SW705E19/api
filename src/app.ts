import express, {Application, Request, Response, NextFunction} from 'express';
const app: Application = express();

const testRoutes = require('.routes/test');

app.get('/test', testRoutes);

app.listen(5000, () => console.log('Server running'));