import { Router } from 'express';
import ServiceController from '../controllers/serviceController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

router.get('/', [checkJwt], ServiceController.listAll);

router.post('/', [checkJwt, checkRole(['TUTOR', 'ADMIN'])], ServiceController.newService);

router.get('/:id([0-9]+)', [checkJwt], ServiceController.getOneById);

router.patch('/:id([0-9]+)', [checkJwt, checkRole(['TUTOR', 'ADMIN'])], ServiceController.editService);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['TUTOR', 'ADMIN'])], ServiceController.deleteService);

router.get('/:category', [checkJwt, checkRole(['TUTOR', 'ADMIN'])], ServiceController.getByCategory);

export default router;