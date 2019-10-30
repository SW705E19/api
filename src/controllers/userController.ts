import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import userLogger from '../logging/users/userLogger';

import { User } from '../entity/user';
import { Result } from 'range-parser';

class UserController {
	static listAll = async (req: Request, res: Response) => {
		//Get users from database
		const userRepository: Repository<User> = getRepository(User);
		const users: User[] = await userRepository.find({
			select: ['id', 'username', 'roles'], //We dont want to send the passwords on response
		});

		//Send the users object
		res.send(users);
	};

	static getOneById = async (req: Request, res: Response) => {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get the user from database
		const userRepository: Repository<User> = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id, {
				select: ['id', 'username', 'roles'], //We dont want to send the password on response
			});
		} catch (error) {
			res.status(404).send('User not found');
		}
		res.send(user);
	};

	static newUser = async (req: Request, res: Response) => {
		//Get parameters from the body
		const { username, password, roles } = req.body;
		const user: User = new User();
		user.username = username;
		user.password = password;
		user.roles = roles;

		//Validade if the parameters are ok
		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}

		//Hash the password, to securely store on DB
		user.hashPassword();

		//Try to save. If fails, the username is already in use
		const userRepository: Repository<User> = getRepository(User);
		try {
			await userRepository.save(user);
		} catch (error) {
			res.status(409).send('username already in use');
			return;
		}

		//If all ok, send 201 response
		const userInfoForLog: string =
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

	static editUser = async (req: Request, res: Response) => {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get values from the body
		const { username, roles } = req.body;

		//Try to find user on database
		const userRepository: Repository<User> = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			//If not found, send a 404 response
			res.status(404).send('User not found');
			return;
		}

		//Validate the new values on model
		user.username = username;
		user.roles = roles;
		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			res.status(400).send(errors);
			return;
		}

		//Try to save, if fails, that means username already in use
		try {
			await userRepository.save(user);
		} catch (error) {
			res.status(409).send('username already in use');
			return;
		}
		//After all send a 204 (no content, but accepted) response
		res.status(204).send();
	};

	static deleteUser = async (req: Request, res: Response) => {
		//Get the ID from the url
		const id: string = req.params.id;

		const userRepository: Repository<User> = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			res.status(404).send('User not found');
			return;
		}
		userRepository.delete(id);

		const deletedInfoForLog: string = 'Deletion: ' + user.username + ', ' + user.roles;
		userLogger.info(deletedInfoForLog);

		//After all send a 204 (no content, but accepted) response
		res.status(204).send();
	};
}

export default UserController;
