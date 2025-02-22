import express, { Router } from 'express';

import usersRoute from './users.route';
import ticketsRoute from './tickets.route';

const router: Router = express.Router();

router.use('/users', usersRoute);
router.use('/tickets', ticketsRoute);


export default router;
