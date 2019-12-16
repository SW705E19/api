import { getRepository, Repository } from 'typeorm';
import { Rating } from '../entity/rating';

class RatingService {
	static getAll = async (): Promise<Rating[]> => {
		//Get all ratings from database
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		const ratings: Rating[] = await ratingRepository
			.createQueryBuilder('rating')
			.select(['rating.rating'])
			.innerJoin('rating.user', 'user')
			.innerJoin('rating.service', 'service')
			.addSelect(['user.id', 'service.id'])
			.getMany();

		return ratings;
	};

	static getAverageRatingByServiceId = async (id: number): Promise<Rating[]> => {
		//Get all ratings from database based on a service ID.
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		const ratings: Rating[] = await ratingRepository
			.createQueryBuilder('rating')
			.select('AVG(rating.rating)', 'avg')
			.where('rating.service.id = :serviceId', { serviceId: id })
			.getRawOne();

		return ratings;
	};

	static getRatingByUserAndServiceId = async (userId: number, serviceId: number): Promise<Rating> => {
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		return await ratingRepository.findOneOrFail({
			where: {
				serviceId: serviceId,
				userId: userId,
			},
		});
	};

	static getTopRatings = async (amount: number): Promise<object[]> => {
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		const ratings: object[] = await ratingRepository
			.createQueryBuilder('rating')
			.innerJoin('rating.service', 'service')
			.innerJoin('service.tutorInfo', 'tutorInfo')
			.innerJoin('tutorInfo.user', 'user')
			.groupBy('service.id')
			.addGroupBy('user.id')
			.select([
				'service.id AS serviceId',
				'service.name AS name',
				'service.description AS description',
				'service.tutorInfo',
				'AVG(rating.rating) AS avgRating',
				'user.id AS userId',
				'user.firstName AS firstName',
				'user.lastName AS lastName',
			])
			.orderBy('avgRating', 'DESC')
			.limit(amount)
			.getRawMany();

		return ratings;
	};

	static save = async (rating: Rating): Promise<Rating> => {
		const ratingRepository: Repository<Rating> = getRepository(Rating);
		return await ratingRepository.save(rating);
	};
}

export default RatingService;
