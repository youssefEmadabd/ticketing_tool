
import { Response as IRes, NextFunction as INext } from 'express';
import httpStatus from 'http-status';

import Controller from './Controller';
import { Ticket } from '../models';
import { TicketService } from '../services';
import { ITicket } from '../types';
import {
    RequestInterface as IReq,
} from '../types';

import ApiError from '../utils/ApiError';

const ticketService = new TicketService(Ticket);

class TicketController extends Controller<ITicket, TicketService> {

    /**
     * @description Retrieve all tickets with optional filtering, sorting, and pagination.
     * @param {RequestInterface} req - HTTP request containing query parameters for filtering, sorting, and pagination.
     * @param {Response} res - HTTP response containing the list of tickets, or an error message if no tickets are found.
     * @returns {Promise<void>} Resolves when the list of tickets is retrieved and sent in the response.
     * @throws {ApiError} Throws an error if no tickets are found or if an internal server error occurs.
     */
    async getAll(req: IReq, res: IRes): Promise<void> {
        try {
            const filter = {};
            const options: { sort: any; limit: number; page: number } = { sort: null, limit: 0, page: 0 };
    
            // Apply filters from query parameters
            if (req.query.complete) filter["completed"] = req.query.complete;
    
            // Apply sorting if provided
            if (req.query.sortBy) {
                options.sort = { [req.query.sortBy as string]: req.query.order === 'desc' ? -1 : 1 };
            }
    
            // Apply pagination if provided
            if (req.query.limit) options.limit = parseInt(req.query.limit as string, 10);
            if (req.query.page) options.page = parseInt(req.query.page as string, 10);
            console.log(filter, options)
            const fetchedTickets = await this.service.get(filter, options);
            if (!fetchedTickets)
                throw new ApiError(httpStatus.NOT_FOUND, 'No tickets found');
    
            res.status(httpStatus.OK).send(fetchedTickets);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
    
    /**
     * @description Create a new ticket
     * @param {RequestInterface} req - HTTP request containing the new ticket data
     * @param {Response} res - HTTP response containing the created ticket document
     * @returns {Promise<void>} Resolves when the new ticket is created
     * @throws {ApiError} when the creation fails
     */
    async create(req: IReq, res: IRes): Promise<void> {
        try {
            const ticketData = req.body;
            const newTicket = await this.service.create(ticketData);
    
            res.status(httpStatus.CREATED).send(newTicket);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
    
    /**
     * @description Update a ticket
     * @param {RequestInterface} req - HTTP request containing the ticket id and update data
     * @param {Response} res - HTTP response containing the updated ticket document
     * @returns {Promise<void>} Resolves when the update is successful
     * @throws {ApiError} when the ticket is not found or when the update fails
     */
    async update(req: IReq, res: IRes): Promise<void> {
        try {
            const { id } = req.params;
            console.log(req.params)
            const updateData = req.body;
            const updatedTicket = await this.service.update({ _id: id }, updateData);
    
            if (!updatedTicket)
                throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    
            res.status(httpStatus.OK).send(updatedTicket);
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
    
    /**
     * @description Delete a ticket by id
     * @param {RequestInterface} req - HTTP request containing the ticket id
     * @param {Response} res - HTTP response
     * @returns {Promise<void>} Resolves when the ticket is deleted
     * @throws {ApiError} when the ticket is not found or when the deletion fails
     */
    async delete(req: IReq, res: IRes): Promise<void> {
        try {
            const { id } = req.params;
            const deletedTicket = await this.service.delete({ _id: id });
    
            if (!deletedTicket)
                throw new ApiError(httpStatus.NOT_FOUND, 'Ticket not found');
    
            res.status(httpStatus.NO_CONTENT).send();
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
}

export default new TicketController(ticketService);