import { Request, Response } from 'express';
import serviceLogger from '../logging/services/serviceLogger';
import RatingService from '../services/ratingService';
import { Rating } from '../entity/rating';
import { validate } from 'class-validator';
import ratingLogger from '../logging/ratings/ratingLogger';

class RatingController {
	static getAll = async (req: Request, res: Response): Promise<Response> => {
		const ratings = await RatingService.getAll();
		return res.send(ratings);
	};

	static newRating = async (req: Request, res: Response): Promise<Response> => {
		const { rating, user, service, description } = req.body;
		const newRating = new Rating();
		newRating.rating = rating;
		newRating.user = user;
		newRating.service = service;
		newRating.description = description;

		const errors = await validate(newRating);
		if (errors.length > 0) {
			ratingLogger.error(errors);
			return res.status(400).send(errors);
		}

		let createdRating: any;
		try {
			createdRating = await RatingService.save(newRating);
		} catch (error) {
			ratingLogger.error(error);
			return res.status(400).send('Could not create rating');
		}

		const ratingInfoForLog: string =
			'Created: ' + createdRating.id + ', service:' + createdRating.serviceId + ', user:' + createdRating.userId;
		serviceLogger.info(ratingInfoForLog);
		return res.status(201).send(createdRating);
	};
}

export default RatingController;
