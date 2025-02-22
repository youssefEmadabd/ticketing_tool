import express from 'express';
import logger from '../config/logger';

// Function to list all registered routes
export const listRoutes = (app: express.Application) => {
    const routes: string[] = [];
    app._router.stack.forEach((middleware: any) => {
        if (middleware.route) {
            // Route middleware
            const method = Object.keys(middleware.route.methods)[0].toUpperCase();
            routes.push(`${method} ${middleware.route.path}`);
        } else if (middleware.name === 'router') {
            // Router middleware
            middleware.handle.stack.forEach((handler: any) => {
                if (handler.route) {
                    const method = Object.keys(handler.route.methods)[0].toUpperCase();
                    routes.push(`${method} ${handler.route.path}`);
                }
            });
        }
    });

    logger.info('Available Routes:');
    routes.forEach((route) => logger.info(route));
};
