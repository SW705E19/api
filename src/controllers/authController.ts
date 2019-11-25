import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { validate } from 'class-validator';
import userLogger from '../logging/users/userLogger';
import userService from '../services/userService';
import { User } from '../entity/user';
import config from '../config/config';

class AuthController {
	static login = async (req: Request, res: Response): Promise<Response> => {
		//Check if username and password are set
		const { email, password } = req.body;
		if (!(email && password)) {
			return res.status(400).send();
		}

		//Get user from database
		let user: User;
		try {
			user = await userService.getByEmail(email);
		} catch (error) {
			return res.status(401).send();
		}

		//Check if encrypted password match
		if (!user.checkIfUnencryptedPasswordIsValid(password)) {
			return res.status(401).send();
		}

		//Sign JWT, valid for 1 hour
		const token = jwt.sign({ userId: user.id, username: user.username, roles: user.roles }, config.jwtSecret, {
			expiresIn: '1h',
		});
    
		//Send the jwt in the response
		return res.send(token);
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
		if (!user.checkIfUnencryptedPasswordIsValid(oldPassword)) {
			return res.status(401).send();
		}

		//Validate the model (password length)
		user.password = newPassword;
		const errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}
		//Hash the new password and save
		user.hashPassword();
		await userService.save(user);

		return res.status(204).send();
	};

	static register = async (req: Request, res: Response): Promise<Response> => {
		//Get parameters from the body
		const {
			email,
			password,
			roles,
			avatarUrl,
			dateOfBirth,
			phoneNumber,
			education,
			address,
			languages,
			subjectsOfInterest,
			firstName,
			lastName,
		} = req.body;
		const user = new User();
		user.email = email;
		user.password = password;
		user.roles = roles;
		user.avatarUrl = avatarUrl;
		user.dateOfBirth = dateOfBirth;
		user.phoneNumber = phoneNumber;
		user.education = education;
		user.address = address;
		user.languages = languages;
		user.subjectsOfInterest = subjectsOfInterest;
		user.firstName = firstName;
		user.lastName = lastName;

		//Validate if the parameters are ok
		const errors = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		//Hash the password, to securely store on DB
		user.hashPassword();

		//Try to save. If fails, the email is already in use
		try {
			await userService.save(user);
		} catch (e) {
			return res.status(409).send(e);
		}

		//If all ok, send 201 response
		const userInfoForLog =
			'Created: ' + user.id.toString() + ', ' + user.email + ', ' + user.roles + ', ' + user.createdAt.toString();
		userLogger.info(userInfoForLog);
		return res.status(201).send('User created');
	};
}
export default AuthController;
