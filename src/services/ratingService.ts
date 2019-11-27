import { getRepository, Repository } from 'typeorm';
import { Rating } from '../entity/rating';

class RatingService {
	static getAll = async (): Promise<Rating[]> => {
		//Get all ratings from database
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		const ratings: Rating[] = await ratingRepository.find();

		return ratings;
	};

	static save = async (rating: Rating): Promise<Rating> => {
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		return await ratingRepository.save(rating);
	};
}

export default RatingService;
