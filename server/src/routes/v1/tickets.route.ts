import express, { Router } from 'express';
import asyncHandler from 'express-async-handler';
import { TicketController } from '../../controllers';

const router: Router = express.Router();

router.route('/')
    .get(asyncHandler(TicketController.getAll))
    .post(asyncHandler(TicketController.create));

router.route('/:id')
    .put(asyncHandler(TicketController.update))
    .delete(asyncHandler(TicketController.delete));


export default router;