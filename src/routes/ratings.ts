import { Router } from 'express';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.listAll);

router.post('/', RatingController.newRating);

router.get('/avg/:id([0-9]+)', RatingController.getAverageRatingByServiceId);

router.get('/top/:amount([0-9]+)', RatingController.getTopRatings);

export default router;
