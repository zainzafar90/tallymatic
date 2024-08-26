import { Database } from '@/database/db';

const database = new Database();

export const setupTestDB = () => {
  beforeAll(async () => {
    await database.connect();
  });

  afterAll(async () => {
    await database.close();
  });
};
