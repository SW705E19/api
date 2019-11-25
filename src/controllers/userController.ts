import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import userLogger from '../logging/users/userLogger';
import userService from '../services/userService';
import { User } from '../entity/user';
import { TutorInfo } from '../entity/tutorInfo';

class UserController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const users: User[] = await userService.getAll();
		//Send the users object
		return res.send(users);
	};

	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id;

		//Get the user from database
		let user: User;
		try {
			user = await userService.getById(id);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		return res.send(user);
	};

	static getOneTutorInfoByUserId = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const userId: number = (req.params.id as unknown) as number;

		//Get the tutorInfo from database
		let tutorInfo: TutorInfo;
		try {
			tutorInfo = await userService.getTutorByUserId(userId);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('Tutor info not found');
		}
		return res.send(tutorInfo);
	};

	static getOwnUser = async (req: Request, res: Response): Promise<Response> => {
		const jwtPayload = res.locals.jwtPayload;
		req.params.id = jwtPayload.userId;
		return UserController.getOneById(req, res);
	};

	static editUser = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id as string;

		//Get values from the body
		const { username, roles } = req.body;

		//Try to find user on database

		let user: User;
		try {
			user = await userService.getById(id);
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
			await userService.save(user);
		} catch (error) {
			userLogger.error(error);
			return res.status(409).send('username already in use');
		}
		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();
	};

	static deleteUser = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const id: string = req.params.id as string;

		let user: User;
		try {
			user = await userService.getById(id);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		await userService.deleteById(id);

		const deletedInfoForLog: string = 'Deletion: ' + user.username + ', ' + user.roles;
		userLogger.info(deletedInfoForLog);

		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();
	};

	static newTutor = async (req: Request, res: Response): Promise<Response> => {
		const id = req.params.id as string;
		let user: User;

		try {
			user = await userService.getById(id);
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

		try {
			await userService.saveTutor(tutorInfo);
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
