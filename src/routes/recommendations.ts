import { Router } from 'express';
import RecommendationController from '../controllers/recommendationController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

router.post('/', RecommendationController.calculateRecommendations);

router.get('/', RecommendationController.listAll);

router.get('/own', [checkJwt], RecommendationController.getOwnRecommendations);

router.get('/:id([0-9])+', RecommendationController.getRecommendationsByUserId);

router.get('/own/top', [checkJwt], RecommendationController.getOwnTopRecommendations);

router.get('/top/:id([0-9])+', RecommendationController.getTopRecommendationsById);

export default router;
