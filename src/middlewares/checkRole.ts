import { Request, Response, NextFunction } from 'express';
import { User } from '../entity/user';
import UserService from '../services/userService';

export const checkRole = (roles: Array<string>) => {
	return async (req: Request, res: Response, next: NextFunction): Promise<Response> => {
		//Get the user ID from previous midleware
		const id = res.locals.jwtPayload.userId as number;

		//Get user role from the database
		let user: User;
		try {
			user = await UserService.getById(id);
		} catch (error) {
			return res.status(401).send(error);
		}

		//Check if array of authorized roles includes the user's role
		const roleFound = roles.some((role: string) => {
			return user.roles.some((userRole: string) => {
				return userRole === role;
			});
		});

		if (roleFound) next();
		else return res.sendStatus(401);
	};
};
