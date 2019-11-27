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

	/*static getAllByUserId = async (req: Request, res: Response): Promise<Response> => {
		const id: string = req.params.id;
		let ratings: Rating[];

		try {
			ratings = await RatingService.getAllByUserId(id);
		} catch (error) {
			serviceLogger.error(error);
			return res.status(404).send('User not found for ratings');
		}
		return res.send(ratings);
    };*/

	static newRating = async (req: Request, res: Response): Promise<Response> => {
		const { rating, userId, serviceId } = req.body;
		const newRating = new Rating();
		newRating.rating = rating;
		newRating.userId = userId;
		newRating.serviceId = serviceId;

		const errors = await validate(newRating);
		if (errors.length > 0) {
			ratingLogger.error(errors);
			return res.status(400).send(errors);
		}

		let createdRating;
		try {
			createdRating = await RatingService.save(rating);
		} catch (error) {
			ratingLogger.error(error);
			return res.status(400).send('Could not create rating');
		}

		const ratingInfoForLog: string =
			'Created: ' + rating.id + ', service:' + rating.serviceId + ', user:' + rating.userId;
		serviceLogger.info(ratingInfoForLog);
		return res.status(201).send(createdRating);
	};
}

export default RatingController;
