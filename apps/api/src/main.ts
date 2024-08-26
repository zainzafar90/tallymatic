import config from '@/config/config';
import { logger } from '@/common/logger';
import { Database } from '@/database/db';

import app from './app';

const database = new Database();
database.connect().then(() => {
  logger.info('Connected to PostgreSQL');
  app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

let server: any;

const exitHandler = () => {
  console.log('Exit Handler');
  if (server) {
    console.log('Server Close');
    server.close(async () => {
      logger.info('Server closed');
      await database.close();
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

const unexpectedErrorHandler = (error: string) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});
