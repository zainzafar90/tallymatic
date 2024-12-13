import config from '@/config/config';
import { logger } from '@/common/logger';
import { getDatabaseInstance } from '@/database/db';

import app from './app';

const database = getDatabaseInstance();

database.connect().then(() => {
  logger.info('Connected to PostgreSQL');
  app.listen(config.port, config.host, () => {
    logger.info(`Listening to port ${config.port}`);
  });
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
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
