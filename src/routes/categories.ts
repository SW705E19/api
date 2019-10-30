import { Router } from 'express';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';
import CategoryController from '../controllers/categoryController';

const router = Router();

router.get('/', [checkJwt, checkRole(['ADMIN'])], CategoryController.listAll);

router.post('/', [checkJwt, checkRole(['ADMIN'])], CategoryController.newCategory);

router.get('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], CategoryController.getOneById);

router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], CategoryController.editCategory);

router.delete('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], CategoryController.deleteCategory);

export default router;
