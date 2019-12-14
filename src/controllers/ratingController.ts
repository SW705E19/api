import { Request, Response } from 'express';
import serviceLogger from '../logging/services/serviceLogger';
import RatingService from '../services/ratingService';
import { Rating } from '../entity/rating';
import { validate } from 'class-validator';
import ratingLogger from '../logging/ratings/ratingLogger';

class RatingController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const ratings = await RatingService.getAll();
		return res.status(200).send(ratings);
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

		let createdRating: Rating;
		try {
			createdRating = await RatingService.save(newRating);
		} catch (error) {
			ratingLogger.error(error);
			return res.status(400).send('Could not create rating');
		}

		const ratingInfoForLog: string =
			'Created: ' +
			createdRating.id +
			', service:' +
			createdRating.service.id +
			', user:' +
			createdRating.user.id;
		serviceLogger.info(ratingInfoForLog);
		return res.status(201).send(createdRating);
	};

	static getAverageRatingByServiceId = async (req: Request, res: Response): Promise<Response> => {
		const id = (req.params.id as unknown) as number;
		let ratings: Rating[];

		try {
			ratings = await RatingService.getAverageRatingByServiceId(id);
		} catch (error) {
			ratingLogger.error(error);
			return res.status(404).send('Could not find ratings');
		}

		return res.status(200).send(ratings);
	};
	static getRatingByUserAndServiceId = async (req: Request, res: Response): Promise<Response> => {
		const { userId, serviceId } = req.body;
		console.log(req.body);
		let rating: Rating;
		try {
			rating = await RatingService.getRatingByUserAndServiceId(userId,serviceId);
		} catch (error) {
			ratingLogger.error(error);
			return res.status(404).send('Could not find ratings');
		}

		return res.status(200).send(rating);
	};
}

export default RatingController;
