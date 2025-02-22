import mongoose from 'mongoose';

import { config } from './config';
import logger from './logger';

const connectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  retryWrites: false,
};

const mongoDBConnection = mongoose
  .connect(config.mongodbUrl, connectOptions)
  .then((con) => {
    logger.info('Connected to MongoDB');
    return con;
  })
  .catch((error) => logger.error(error));

export default mongoDBConnection;
