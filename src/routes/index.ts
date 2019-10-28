import { Router } from 'express';
import auth from './auth';
import users from './users';
import categories from './categories';

const routes = Router();

routes.use('/auth', auth);
routes.use('/users', users);
routes.use('/categories', categories);

export default routes;
