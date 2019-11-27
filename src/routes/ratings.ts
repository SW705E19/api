import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import RatingController from '../controllers/ratingController';

const router = Router();

router.get('/', RatingController.getAll);

router.post('/', RatingController.newRating);

// router.get('/:id([0-9]+)', RatingController.getAllByUserId);

export default router;
