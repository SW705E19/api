import { Router } from 'express';
import RecommendationController from '../controllers/recommendationController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();

router.post('/', RecommendationController.calculateRecommendations);

router.get('/', RecommendationController.listAll);

router.get('/own', RecommendationController.getOwnTopRecommendations);

router.get('/:id([0-9]+', RecommendationController.getRecommendationsByUserId);

export default router;
