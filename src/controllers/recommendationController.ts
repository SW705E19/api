import { Request, Response } from 'express-serve-static-core';
import RecommendationService from '../services/recommendationService';
import Recommender from '../recommender/recommender';
import { Recommendation } from '../entity/recommendation';
import recommendationsLogger from '../logging/recommendations/recommendationLogger';
import { Service } from '../entity/service';
import { User } from '../entity/user';

class RecommendationController {
	static listAll = async (req: Request, res: Response): Promise<Response> => {
		const recommendations = await RecommendationService.getAll();
		return res.status(200).send(recommendations);
	};

	static calculateRecommendations = async (req: Request, res: Response): Promise<Response> => {
		// Creates the matrix containing the recommendation values for each user/service combination.
		const userServiceMatrix: number[][] = await Recommender.calculateRecommendations();
		// Clear the db for recommendations so new ones can be inserted.
		await RecommendationService.clearRecommendations();

		const recommendations: Recommendation[] = [];

		// Create the list of recommendation objects to be inserted into the db
		// using the values from the matrix.
		for (let i = 1; i < userServiceMatrix.length; i++) {
			for (let j = 1; j < userServiceMatrix[0].length; j++) {
				const recommendation: Recommendation = new Recommendation();
				recommendation.service = new Service();
				recommendation.user = new User();

				recommendation.value = userServiceMatrix[i][j];
				recommendation.service.id = userServiceMatrix[0][j];
				recommendation.user.id = userServiceMatrix[i][0];
				recommendations.push(recommendation);
			}
		}

		let savedRecommendations: Recommendation[];
		try {
			savedRecommendations = await RecommendationService.save(recommendations);
		} catch (error) {
			recommendationsLogger.error(error);
			return res.status(400).send('Could not save recommendation');
		}

		return res.status(201).send(savedRecommendations);
	};

	// Get the currently logged in users recommendations
	static getOwnRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const jwtPayload = res.locals.jwtPayload;
		req.params.id = jwtPayload.userId;
		return RecommendationController.getRecommendationsByUserId(req, res);
	};

	// Gets the given user's recommendations
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

	// Gets the currently logged in users top recommendations
	static getOwnTopRecommendations = async (req: Request, res: Response): Promise<Response> => {
		const userId = res.locals.jwtPayload.userId;
		req.params.id = userId;
		return RecommendationController.getTopRecommendationsById(req, res);
	};

	// Gets the top recommendations for the give user.
	static getTopRecommendationsById = async (req: Request, res: Response): Promise<Response> => {
		const userId: number = (req.params.id as unknown) as number;

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
