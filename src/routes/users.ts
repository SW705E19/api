import { Router } from 'express';
import UserController from '../controllers/userController';
import { checkJwt } from '../middlewares/checkJwt';
import { checkRole } from '../middlewares/checkRole';

const router = Router();

//Get all users
router.get('/', [checkJwt, checkRole(['ADMIN'])], UserController.listAll);

router.get('/tutors/', [checkJwt], UserController.listAllTutors);

// Get one user
router.get('/:id([0-9]+)', UserController.getOneById);

// Get one tutorInfo
router.get('/tutorInfo/:id([0-9]+)', UserController.getOneTutorInfoByUserId);

//Create a new tutorInfo
router.post('/:id([0-9]+)/newTutor', [checkJwt, checkRole(['ADMIN'])], UserController.newTutor);

//Edit one user
router.patch('/:id([0-9]+)', [checkJwt, checkRole(['ADMIN'])], UserController.editUser);

//Edit the tutor role on a user
router.patch('/tutor/:id([0-9]+)',[checkJwt, checkRole(['ADMIN'])], UserController.editTutorRole);

//Delete one user
router.delete('/:id([0-9]+)', [checkJwt], UserController.deleteUser);

//Get own user
router.get('/profile', [checkJwt], UserController.getOwnUser);

export default router;
