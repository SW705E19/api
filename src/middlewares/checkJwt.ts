import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
import config from '../config/config';

export const checkJwt = (req: Request, res: Response, next: NextFunction): Response => {
	//Get the jwt token from the head
	let token = req.headers.authorization as string;
	let jwtPayload;

	//Try to validate the token and get data
	try {
		token = token.substring(7, token.length);
		jwtPayload = jwt.verify(token, config.jwtSecret);
		res.locals.jwtPayload = jwtPayload;
	} catch (error) {
		//If token is not valid, respond with 401 (unauthorized)
		return res.status(401).send(error);
	}

	//The token is valid for 1 hour
	//We want to send a new token on every request
	const { userId, username } = jwtPayload;
	const newToken = jwt.sign({ userId, username }, config.jwtSecret, {
		expiresIn: '24h',
	});
	res.setHeader('token', newToken);
	//Call the next middleware or controller
	next();
};
