
import { Response as IRes, NextFunction as INext } from 'express';
import httpStatus from 'http-status';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

import Controller from './Controller';
import { User } from '../models';
import { UserService } from '../services';
import { IUser } from '../types';
import {
    RequestInterface as IReq,
} from '../types';

import ApiError from '../utils/ApiError';
import { config } from '../config/config';

const userService = new UserService(User);

class UserController extends Controller<IUser, UserService> {

    /**
     * @description Get a user by id
     * @param {RequestInterface} req - HTTP request containing the user id
     * @param {Response} res - HTTP response containing the user document
     * @returns {Promise<void>} Resolves when the user is found
     * @throws {ApiError} when the user is not found
     */
    async get(req: IReq, res: IRes): Promise<void> {
        try {
            const id = req.user.sub;
            const filter: object = { _id: id };
            const result = await this.service.get(filter);
            if (!result) throw new ApiError(httpStatus.NOT_FOUND, 'Not found');
            res.status(httpStatus.ACCEPTED).send({ ...result, found: true });
        } catch (err) {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, err.message);
        }
    }
    
    /**
     * @description Authenticate a user and return a JWT token
     * @param {RequestInterface} req - HTTP request containing username and password
     * @param {Response} res - HTTP response containing the generated token
     * @param {NextFunction} next - Express next middleware function
     * @returns {Promise<void>} Resolves when authentication is successful
     * @throws {ApiError} when the user is not found or credentials are incorrect
     */
    async login(req: IReq, res: IRes, next: INext) {
        const { username, password } = req.body;
        const user: IUser = (await this.service.getOne({
            username
        }, { populate: 'role' }))

        if (!user) throw new ApiError(httpStatus.NOT_FOUND, 'Admin not found');

        const passwordMatch = await bcrypt.compare(`${password}`, user.password);
        if (!passwordMatch) {
            throw new ApiError(httpStatus.UNAUTHORIZED, "Wrong Credentials")
        }
        const token = await jwt.sign({ sub: user._id }, config.jwt.secret, {
            expiresIn: '1h',
        });
        res.status(httpStatus.ACCEPTED).send({
            token,
        });
    }

    /**
     * @description Register a user
     * @param {RequestInterface} req - HTTP request
     * @param {Response} res - HTTP response
     * @returns {Promise<void>} Resolves when the user is created
     * @throws {ApiError} when the username already exists or when the role is not found
     */
    async register(req: IReq, res: IRes, _next: INext): Promise<void> {
        const { username, password } = req.body;
        const checkUsername = await this.service.isUsernameUnique(username);
        if (!checkUsername) {
            throw new ApiError(httpStatus.BAD_REQUEST, 'Username already exists');
        }
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const user = await this.service.create({
            username,
            password: hashedPassword,
        });
        const token = await jwt.sign({ sub: user._id }, config.jwt.secret, {
            expiresIn: '1h',
        });
        res.status(httpStatus.CREATED).send({ ...user, token });
    }
}

export default new UserController(userService);