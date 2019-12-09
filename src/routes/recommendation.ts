import { Router } from 'express';
import RecommendationController from '../controllers/serviceController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

export default router;
