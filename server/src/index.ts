import { config } from './config/config';
import logger from './config/logger';
import app from './app';

let server;

/**
 * Closes the server and then exits the process with a status of 1.
 *
 * Should be called when the process receives a SIGTERM or SIGINT signal.
 */
const exitHandler = (): void => {
  if (server)
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  else process.exit(1);
};

/**
 * Handles unexpected errors by logging them and then exiting the process.
 *
 * This function is meant to be passed to process.on('uncaughtException') and
 * process.on('unhandledRejection').
 *
 * @param {Error} error The error to be logged.
 */
const unexpectedErrorHandler = (error: Error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) server.close();
});


app.listen(config.port, () => {
  logger.info(`Listening to port ${config.port}`);
});
