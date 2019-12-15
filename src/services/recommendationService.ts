import { Recommendation } from '../entity/recommendation';
import { Repository, getRepository } from 'typeorm';

class RecommendationService {
	static getAll = async (): Promise<Recommendation[]> => {
		//Get all categories from database
		const recommendationRepository: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationRepository.find();
		return recommendations;
	};

	static save = async (recommendations: Recommendation[]): Promise<Recommendation[]> => {
		const recommendationRepository: Repository<Recommendation> = getRepository(Recommendation);
		return await recommendationRepository.save(recommendations);
	};

	static getRecommendationsByUserId = async (id: number): Promise<Recommendation[]> => {
		const recommendationRepository: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationRepository
			.createQueryBuilder('recommendation')
			.select(['recommendation.value'])
			.where('recommendation.user = :userId', { userId: id })
			.innerJoinAndSelect('recommendation.service', 'service')
			.innerJoinAndSelect('service', 'service.tutorInfo')
			.getMany();

		return recommendations;
	};

	static clearRecommendations = async (): Promise<void> => {
		const recommendationRepository: Repository<Recommendation> = getRepository(Recommendation);
		await recommendationRepository.clear();
	};

	static getTopRecommendationsByUserId = async (id: number): Promise<Recommendation[]> => {
		const recommendationRepository: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationRepository
			.createQueryBuilder('recommendation')
			.select(['recommendation.value'])
			.where('recommendation.user = :userId', { userId: id })
			.innerJoinAndSelect('recommendation.service', 'service')
			.innerJoinAndSelect('service.tutorInfo', 'tutorInfo')
			.innerJoin('tutorInfo.user', 'user')
			.addSelect(['user.firstName', 'user.lastName'])
			.orderBy('recommendation.value', 'DESC')
			.limit(5)
			.getMany();

		return recommendations;
	};
}

export default RecommendationService;
