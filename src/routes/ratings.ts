import { Router } from 'express';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.listAll);

router.post('/', RatingController.newRating);

router.get('/avg/:id([0-9]+)', RatingController.getAverageRatingByServiceId);

router.post('/userIdServiceId', RatingController.getRatingByUserAndServiceId);

export default router;
