import { config } from '@/config/config';
import { logger } from '@/common/logger';
import { db } from '@/db';
import { organizations } from '@/db/schema';

import app from './app';

app.listen(config.port, async () => {
  logger.info(`Listening to port ${config.port}`);

  const newOrganization = {
    name: 'Tallymatic',
    address: '123 Main St, Anytown, USA',
  };

  await db.insert(organizations).values(newOrganization);
  logger.info('New organization created!');
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let server: any;

const exitHandler = () => {
  console.log('Exit Handler');
  if (server) {
    console.log('Server Close');
    server.close(async () => {
      logger.info('Server closed');
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
