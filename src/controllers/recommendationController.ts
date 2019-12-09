import { Request, Response } from 'express-serve-static-core';
import RecommendationService from '../services/recommendationService';
import { calculateRecommendations } from '../recommender/recommender';
import { Recommendation } from '../entity/recommendation';
import recommendationsLogger from '../logging/recommendations/recommendationLogger';

class RecommendationController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const recommendations = await RecommendationService.getAll();
		return res.status(200).send(recommendations);
	};

	static calculateRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const userServiceMatrix: number[][] = await calculateRecommendations();
		await RecommendationService.clearRecommendations();

		let recommendation: Recommendation;
		for (let i = 1; i < userServiceMatrix.length; i++) {
			for (let j = 1; j < userServiceMatrix[0].length; j++) {
				recommendation.value = userServiceMatrix[i][j];
				recommendation.service.id = userServiceMatrix[0][j];
				recommendation.user.id = userServiceMatrix[i][0];
				try {
					await RecommendationService.save(recommendation);
				} catch (error) {
					recommendationsLogger.error(error);
					return res.status(400).send('Could not save recommendation');
				}
			}
		}
		return res.status(201).send('Recommendations saved to database');
	};

	static getOwnRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const jwtPayload = res.locals.jwtPayload;
		req.params.id = jwtPayload.userId;
		return RecommendationController.getRecommendationsByUserId(req, res);
	};

	static getRecommendationsByUserId = async (req: Request, res: Response): Promise<Response> => {
		const userId: number = (req.params.id as unknown) as number;

		let recommendations: Recommendation[];
		try {
			recommendations = await RecommendationService.getRecommendationsByUserId(userId);
		} catch (error) {
			recommendationsLogger.error(error);
			return res.status(404).send('recommendations not found');
		}
		return res.status(200).send(recommendations);
	};

	static getOwnTopRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const userId = res.locals.jwtPayload.userId;

		let recommendations: Recommendation[];
		try {
			recommendations = await RecommendationService.getTopRecommendationsByUserId(userId);
		} catch (error) {
			recommendationsLogger.error(error);
			return res.status(404).send('recommendations not found');
		}
		return res.status(200).send(recommendations);
	};
}

export default RecommendationController;
