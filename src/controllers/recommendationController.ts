import { Request, Response } from 'express-serve-static-core';
import RecommendationService from '../services/recommendationService';
import { calculateRecommendations } from '../recommender/recommender';
import { Recommendation } from '../entity/recommendation';

class RecommendationController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const recommendations = await RecommendationService.getAll();
		return res.status(200).send(recommendations);
	};

	static calculateRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const userServiceMatrix: number[][] = await calculateRecommendations();

		let recommendation: Recommendation;
		try {
			for (let i = 0; i < userServiceMatrix.length; i++) {
				for (let j = 0; j < userServiceMatrix[0].length; j++) {}
			}
		} catch (error) {}
		return res.status(200).send();
	};
}

export default RecommendationController;
