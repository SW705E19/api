import { Router } from 'express';
import auth from './auth';
import users from './users';
import categories from './categories';
import services from './services';
import ratings from './ratings';

const routes = Router();

routes.use('/api/auth', auth);
routes.use('/api/users', users);
routes.use('/api/categories', categories);
routes.use('/api/services', services);
routes.use('/api/ratings', ratings);

export default routes;
