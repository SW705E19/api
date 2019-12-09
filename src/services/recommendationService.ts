import { Recommendation } from '../entity/recommendation';
import { Repository, getRepository } from 'typeorm';

class RecommendationService {
	static getAll = async (): Promise<Recommendation[]> => {
		//Get all categories from database
		const recommendationService: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationService.find();
		return recommendations;
	};

	static save = async (recommendation: Recommendation): Promise<Recommendation> => {
		const recommendationService: Repository<Recommendation> = getRepository(Recommendation);
		return await recommendationService.save(recommendation);
	};

	static getRecommendationsByUserId = async (id: number): Promise<Recommendation[]> => {
		const recommendationService: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationService
			.createQueryBuilder('recommendation')
			.select(['recommendation.value', 'recommendation.service', 'recommendation.user'])
			.where('recommendation.user = :userId', { userId: id })
			.getMany();

		return recommendations;
	};

	static clearRecommendations = async (): Promise<void> => {
		const recommendationService: Repository<Recommendation> = getRepository(Recommendation);
		await recommendationService.clear();
	};

	static getTopRecommendationsByUserId = async (id: number): Promise<Recommendation[]> => {
		const recommendationService: Repository<Recommendation> = getRepository(Recommendation);
		const recommendations: Recommendation[] = await recommendationService
			.createQueryBuilder('recommendation')
			.select(['recommendation.value', 'recommendation.service', 'recommendation.user'])
			.where('recommendation.user = :userId', { userId: id })
			.orderBy('recommendation.value', 'DESC')
			.limit(5)
			.getMany();

		return recommendations;
	};
}

export default RecommendationService;
