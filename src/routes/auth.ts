import { Router } from 'express';
import AuthController from '../controllers/authController';
import { checkJwt } from '../middlewares/checkJwt';

const router = Router();
//Login route
router.post('/login', AuthController.login);

//Change my password
router.post('/change-password', [checkJwt], AuthController.changePassword);

//Create a new user.
router.post('/register', AuthController.register);

export default router;
