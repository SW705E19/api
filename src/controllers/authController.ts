import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
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
			return res.status(400).send();
		}

		//Get user from database
		let user: User;
		try {
			user = await userService.getByUsername(username);
		} catch (error) {
			return res.status(401).send();
		}

		//Check if encrypted password match
		if (!bcrypt.compareSync(password, user.password)) {
			return res.status(401).send();
		}

		//Sign JWT, valid for 1 hour
		const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

		//Send the jwt in the response
		return res.status(200).send(token);
	};

	static changePassword = async (req: Request, res: Response): Promise<Response> => {
		//Get ID from JWT
		const id = res.locals.jwtPayload.userId as string;

		//Get parameters from the body
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) {
			return res.status(400).send();
		}

		//Get user from the database
		let user: User;
		try {
			user = await userService.getById(id);
		} catch (error) {
			return res.status(401).send();
		}

		//Check if old password is the same
		if (!bcrypt.compareSync(oldPassword, user.password)) {
			return res.status(401).send();
		}

		//Validate the model (password length)
		user.password = newPassword;
		const errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		//Hash the new password and save
		user.password = bcrypt.hashSync(user.password, 8);
		await userService.save(user);

		return res.status(204).send();
	};

	static register = async (req: Request, res: Response): Promise<Response> => {
		//Get parameters from the body
		const { username, password, role } = req.body;
		const user = new User();
		user.username = username;
		user.password = password;
		user.roles = role;

		//Validate if the parameters are ok
		const errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		//Hash the password, to securely store on DB
		user.password = bcrypt.hashSync(user.password, 8);

		//Try to save. If fails, the username is already in use
		try {
			await userService.save(user);
		} catch (e) {
			return res.status(409).send('username already in use');
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
		return res.status(201).send('User created');
	};
}
export default AuthController;
