import { Database } from '../../database/db';

const database = new Database();

export const setupTestDB = () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    // Do not close the connection here
    // We'll close it in the global teardown
  });

  afterEach(async () => {
    await database.sync();
  });
};

export const closeDatabase = async () => {
  await database.close();
};
