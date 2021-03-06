import { Request, Response } from 'express';
import { validate, ValidationError } from 'class-validator';
import userLogger from '../logging/users/userLogger';
import userService from '../services/userService';
import { User } from '../entity/user';
import { TutorInfo } from '../entity/tutorInfo';
import UserService from '../services/userService';

class UserController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const users: User[] = await userService.getAll();
		//Send the users object
		return res.status(200).send(users);
	};
	static listAllTutors = async (req: Request, res: Response): Promise<Response> => {
		const tutors = await UserService.getAllTutors();
		return res.status(200).send(tutors);
	};

	static getOneById = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const userId: number = (req.params.id as unknown) as number;

		//Get the user from database
		let user: User;
		try {
			user = await userService.getById(userId);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		return res.status(200).send(user);
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
		return res.status(200).send(tutorInfo);
	};

	static getOwnUser = async (req: Request, res: Response): Promise<Response> => {
		const jwtPayload = res.locals.jwtPayload;
		req.params.id = jwtPayload.userId;
		return UserController.getOneById(req, res);
	};

	static editUser = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const userId: number = (req.params.id as unknown) as number;

		//Get values from the body
		const {
			firstName,
			lastName,
			address,
			email,
			phoneNumber,
			dateOfBirth,
			education,
			languages,
			subjectsOfInterest,
			avatarUrl,
		} = req.body;

		//Try to find user on database
		let user: User;
		try {
			user = await userService.getById(userId);
		} catch (error) {
			//If not found, send a 404 response
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		//Validate the new values on model
		user.email = email;
		user.firstName = firstName;
		user.lastName = lastName;
		user.address = address;
		user.phoneNumber = phoneNumber;
		user.dateOfBirth = dateOfBirth;
		user.education = education;
		user.languages = languages;
		user.subjectsOfInterest = subjectsOfInterest;
		user.avatarUrl = avatarUrl;

		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			userLogger.error(errors);
			return res.status(400).send(errors);
		}

		//Try to save, if fails, that means email already in use
		try {
			await userService.save(user);
		} catch (error) {
			userLogger.error(error);
			return res.status(400).send('email already in use');
		}

		return res.status(200).send();
	};

	static editTutorRole = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const userId: number = (req.params.id as unknown) as number;

		//Get values from the body
		const roles = req.body;

		let user: User;
		try {
			user = await userService.getById(userId);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		user.roles = roles;

		const errors: ValidationError[] = await validate(user);
		if (errors.length > 0) {
			userLogger.error(errors);
			return res.status(400).send(errors);
		}
		try {
			await userService.getTutorByUserId(userId).then(async alreadyTutor => {
				if (alreadyTutor === undefined && roles.includes('TUTOR')) {
					const tutorInfo: TutorInfo = new TutorInfo();
					tutorInfo.description = '';
					tutorInfo.acceptedPayments = [];
					tutorInfo.services = [];
					tutorInfo.user = user;

					//Validate if the parameters are ok
					const errors: ValidationError[] = await validate(tutorInfo);
					if (errors.length > 0) {
						return res.status(400).send(errors);
					}

					let createdTutorInfo;
					try {
						createdTutorInfo = await userService.saveTutor(tutorInfo);
					} catch (error) {
						userLogger.error(error);
						return res.status(400).send('TutorInfo could not be saved');
					}

					//If all ok, send 200 response
					const tutorInfoForLog: string =
						'Created: ' +
						createdTutorInfo.id.toString() +
						', ' +
						createdTutorInfo.user.email +
						', ' +
						createdTutorInfo.description;
					userLogger.info(tutorInfoForLog);
				}
				try {
					await userService.save(user);
				} catch (error) {
					userLogger.error(error);
					return res.status(400).send(error);
				}

				return res.status(200).send(user);
			});
		} catch (error) {
			userLogger.error(error);
			return res.status(500).send(error);
		}
	};

	static deleteUser = async (req: Request, res: Response): Promise<Response> => {
		//Get the ID from the url
		const userId: number = (req.params.id as unknown) as number;
		const loggedInId: number = res.locals.jwtPayload.userId;

		if (userId != loggedInId) {
			res.status(401).send('Can not delete user that is not you');
		}
		let user: User;
		try {
			user = await userService.getById(userId);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
		}
		await userService.deleteById(userId);

		const deletedInfoForLog: string = 'Deletion: ' + user.email + ', ' + user.roles;
		userLogger.info(deletedInfoForLog);

		//After all send a 204 (no content, but accepted) response
		return res.status(204).send();
	};

	static newTutor = async (req: Request, res: Response): Promise<Response> => {
		const userId: number = (req.params.id as unknown) as number;

		let user: User;

		try {
			user = await userService.getById(userId);
		} catch (error) {
			userLogger.error(error);
			return res.status(404).send('User not found');
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

		let createdTutorInfo;
		try {
			createdTutorInfo = await userService.saveTutor(tutorInfo);
		} catch (error) {
			userLogger.error(error);
			return res.status(400).send('TutorInfo could not be saved');
		}

		//If all ok, send 201 response
		const tutorInfoForLog: string =
			'Created: ' +
			createdTutorInfo.id.toString() +
			', ' +
			createdTutorInfo.user.email +
			', ' +
			createdTutorInfo.description;
		userLogger.info(tutorInfoForLog);
		return res.status(201).send('TutorInfo created');
	};
}

export default UserController;
