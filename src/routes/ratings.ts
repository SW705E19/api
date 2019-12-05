import { Router } from 'express';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.listAll);

router.post('/', RatingController.newRating);

router.get('/:id([0-9]+)', RatingController.getAllByServiceId);

export default router;
