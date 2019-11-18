import { Request, Response } from 'express';
import { getRepository, Repository } from 'typeorm';
import { validate, ValidationError } from 'class-validator';
import userLogger from '../logging/users/userLogger';

import { User } from '../entity/user';
import { TutorInfo } from '../entity/tutorInfo';

class UserController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		//Get users from database
		const userRepository: Repository<User> = getRepository(User);
		const users: User[] = await userRepository.find({
			select: ['id', 'username', 'roles'], //We dont want to send the passwords on response
		});

		//Send the users object
		return res.send(users);
	};

	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get the user from database
		const userRepository: Repository<User> = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id, {
				select: ['id', 'firstName', 'lastName', 'roles'], //We dont want to send the password on response
				relations: ['tutorInfo', 'tutorInfo.services'],
			});
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		return res.send(user);
	};

	static getOwnUser = async (req: Request, res: Response): Promise<Response> => {
		const jwtPayload = res.locals.jwtPayload;
		req.params.id = jwtPayload.userId;
		return UserController.getOneById(req, res);
	};

	static editUser = async (req: Request, res: Response): Promise<Response> => {
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
			userLogger.error(error);
			return res.status(404).send('User not found');
		}

		//Validate the new values on model
		user.username = username;
		user.roles = roles;
		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		//Try to save, if fails, that means username already in use
		try {
			await userRepository.save(user);
		} catch (error) {
			userLogger.error(error);
			return res.status(409).send('username already in use');
		}
		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();
	};

	static deleteUser = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id;

		const userRepository: Repository<User> = getRepository(User);
		let user: User;
		try {
			user = await userRepository.findOneOrFail(id);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		userRepository.delete(id);

		const deletedInfoForLog: string = 'Deletion: ' + user.username + ', ' + user.roles;
		userLogger.info(deletedInfoForLog);

		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();
	};

	static newTutor = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id;
		let user: User;
		const userRepository = getRepository(User);

		try {
			user = await userRepository.findOne(id, {
				select: ['id', 'username', 'roles'],
			});
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}

		if (user == null) {
			res.status(404).send('User not found');
		}

		const { description, acceptedPayments } = req.body;
		const tutorInfo: TutorInfo = new TutorInfo();
		tutorInfo.description = description;
		tutorInfo.acceptedPayments = acceptedPayments;
		tutorInfo.services = [];
		tutorInfo.user = user;

		//Validate if the parameters are ok
		const errors: ValidationError[] = await validate(tutorInfo);
		if (errors.length > 0) {
			return res.status(400).send(errors);
		}

		const tutorInfoRepository: Repository<TutorInfo> = getRepository(TutorInfo);
		try {
			await tutorInfoRepository.save(tutorInfo);
		} catch (error) {
			userLogger.error(error);
			return res.status(500).send('TutorInfo could not be saved');
		}

		//If all ok, send 201 response
		const tutorInfoForLog: string =
			'Created: ' + tutorInfo.id.toString() + ', ' + tutorInfo.user.username + ', ' + tutorInfo.description;
		userLogger.info(tutorInfoForLog);
		return res.status(201).send('TutorInfo created');
	};
}

export default UserController;
