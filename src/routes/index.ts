import { Router } from 'express';
import auth from './auth';
import users from './users';
import categories from './categories';
import services from './services';

const routes = Router();

routes.use('/api/auth', auth);
routes.use('/api/users', users);
routes.use('/api/categories', categories);
routes.use('/api/services', services);

export default routes;
