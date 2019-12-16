import { Router } from 'express';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.listAll);

router.put('/', RatingController.newRating);

router.get('/avg/:id([0-9]+)', RatingController.getAverageRatingByServiceId);

router.post('/userIdServiceId', RatingController.getRatingByUserAndServiceId);

router.get('/top/:amount([0-9]+)', RatingController.getTopRatings);

export default router;
