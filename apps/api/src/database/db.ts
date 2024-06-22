import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import config from '@/config/config';
import { Token } from '@/modules/token/token.postgres.model';
import { User } from '@/modules/user/user.postgres.model';

export class Database {
  // Database name to connect e.g. tallymaticdb
  private db: string;

  // Database user to connect e.g. postgres
  private user: string;

  // Database password to connect e.g. password
  private password: string;

  // Database host to connect e.g. localhost
  private host: string;

  // Database port to connect e.g. 5432
  private port: number;

  // Database dialect to connect e.g. postgres/mysql
  private dbDialect: Dialect;

  private database: Sequelize = null;

  constructor() {
    this.db = config.db.name;
    this.user = config.db.user;
    this.password = config.db.password;
    this.host = config.db.host;
    this.port = config.db.port;
    this.dbDialect = config.db.dialect;
    this.initialize();
  }

  private initialize() {
    this.database = new Sequelize({
      database: this.db,
      username: this.user,
      password: this.password,
      host: this.host,
      port: this.port,
      dialect: this.dbDialect,
      logging: false,
    });
    this.database.addModels([Token, User]);
  }

  connect() {
    return this.database.authenticate();
  }

  sync() {
    return this.database.sync({
      alter: false,
      force: false,
    });
  }
}
