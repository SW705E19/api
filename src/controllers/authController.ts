import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { getRepository } from 'typeorm';
import { validate } from 'class-validator';
import userLogger from '../logging/users/userLogger';
import authService from '../services/authService';
import { User } from '../entity/user';
import config from '../config/config';

class AuthController {
	static login = async (req: Request, res: Response) => {
		//Check if username and password are set
		const { username, password } = req.body;
		if (!(username && password)) {
			res.status(400).send();
		}

		//Get user from database
		let user: User;
		try {
			user = await authService.getUserByUsername(username);
		} catch (error) {
			return res.status(401).send();
		}

		//Check if encrypted password match
		if (!user.checkIfUnencryptedPasswordIsValid(password)) {
			return res.status(401).send();
		}

		//Sign JWT, valid for 1 hour
		const token = jwt.sign({ userId: user.id, username: user.username }, config.jwtSecret, { expiresIn: '1h' });

		//Send the jwt in the response
		return res.send(token);
	};

	static changePassword = async (req: Request, res: Response) => {
		//Get ID from JWT
		const id = res.locals.jwtPayload.userId;

		//Get parameters from the body
		const { oldPassword, newPassword } = req.body;
		if (!(oldPassword && newPassword)) {
			res.status(400).send();
		}

		//Get user from the database
		const userRepository = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (id) {
			res.status(401).send();
		}

		//Check if old password is the same
		if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
			res.status(401).send();
			return;
		}

		//Validate the model (password length)
		user.password = newPassword;
		const errors = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}
		//Hash the new password and save
		user.hashPassword();
		userRepository.save(user);

		res.status(204).send();
	};

	static register = async (req: Request, res: Response) => {
		//Get parameters from the body
		const { username, password, role } = req.body;
		const user = new User();
		user.username = username;
		user.password = password;
		user.roles = role;

		//Validate if the parameters are ok
		const errors = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}

		//Hash the password, to securely store on DB
		user.hashPassword();

		//Try to save. If fails, the username is already in use
		const userRepository = getRepository(User);
		try {
			await userRepository.save(user);
		} catch (e) {
			res.status(409).send('username already in use');
			return;
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
		res.status(201).send('User created');
	};
}
export default AuthController;
