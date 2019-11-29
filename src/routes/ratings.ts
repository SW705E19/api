import { Router } from 'express';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.getAll);

router.post('/', RatingController.newRating);

export default router;
