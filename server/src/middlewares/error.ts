import httpStatus from 'http-status';
import { NextFunction, Response } from 'express';

import { RequestInterface } from '../types';
import ApiError from '../utils/ApiError';

/**
 * @description ErrorHandler function to send thrown exceptions as http responses to the client
 * @param {RequestInterface} _req
 * @param {Response} res
 * @param {NextFunction} _next
 * @returns {void}
 */
const errorHandler = (
    err,
    _req: RequestInterface,
    res: Response,
    _next: NextFunction,
) => {
    let error = err;
    if (!(error instanceof ApiError)) {
        const statusCode = error.statusCode || httpStatus.INTERNAL_SERVER_ERROR;
        const message = error.message || httpStatus[statusCode];
        error = new ApiError(statusCode, message, {}, err.stack);
    }
    let { statusCode, message } = error;
    res.locals.errorMessage = err.message;
    const response = {
        code: statusCode,
        message,
    };
    res.status(statusCode).send(response);
};

export default errorHandler;
