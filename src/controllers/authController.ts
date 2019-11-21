import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import * as validator from 'class-validator';
import userLogger from '../logging/users/userLogger';
import userService from '../services/userService';
import { User } from '../entity/user';
import config from '../config/config';
import * as bcrypt from 'bcryptjs';

class AuthController {
	static login = async (req: Request, res: Response): Promise<Response> => {
		//Check if username and password are set
		const { username, password } = req.body;
		if (!(username && password)) {
			return res.status(400).send('Username or password is not specified.');
		}

		//Get user from database
		let user: User;
		try {
			user = await userService.getByUsername(username);
		} catch (error) {
			return res.status(401).send(error);
		}

		//Check if encrypted password match
		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(401).send('New password is same as old.');
		}

		//Sign JWT, valid for 1 hour
		const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

		//Send the jwt in the response
		return res.status(200).send(token);
	};

	static changePassword = async (req: Request, res: Response): Promise<Response> => {
		//Get ID from JWT
		const id = res.locals.jwtPayload.userId;

		//Get parameters from the body
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) {
			return res.status(400).send('Old or new password is not specified.');
		}

		//Get user from the database
		let user: User;
		try {
			user = await userService.getById(id);
		} catch (error) {
			return res.status(503).send(error);
		}

		//Check if old password is the same
		if (!bcrypt.compareSync(oldPassword, user.password)) {
			return res.status(401).send('New password is the same as old.');
		}

		//Validate the model (password length)
		user.password = newPassword;
		const errors = await validator.validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		//Hash the new password and save
		user.password = bcrypt.hashSync(user.password, 8);
		user = await userService.save(user);

		return res.status(204).send(user);
	};

	static register = async (req: Request, res: Response): Promise<Response> => {
		//Get parameters from the body
		const { username, password, role } = req.body;
		let user = new User();
		user.username = username;
		user.password = password;
		user.roles = role;

		//Validate if the parameters are ok
		const errors = await validator.validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		//Hash the password, to securely store on DB
		user.password = bcrypt.hashSync(user.password, 8);

		//Try to save.
		try {
			user = await userService.save(user);
		} catch (error) {
			return res.status(409).send(error);
		}

		//If all ok, send 201 response
		const userInfoForLog =
			'Created: ' +
			user.id.toString() +
			', ' +
			user.username +
			', ' +
			user.roles +
			', ' +
			user.createdAt.toString();
		userLogger.info(userInfoForLog);
		return res.status(201).send(user);
	};
}
export default AuthController;
