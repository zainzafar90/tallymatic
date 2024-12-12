import { Dialect } from 'sequelize';
import { Sequelize } from 'sequelize-typescript';

import config from '@/config/config';
import { Category } from '@/modules/category';
import { Claim, ClaimItem } from '@/modules/claim';
import { Customer } from '@/modules/customer';
import { Inventory } from '@/modules/inventory/inventory.model';
import { Order, OrderItem } from '@/modules/order';
import { Organization } from '@/modules/organization';
import { Product } from '@/modules/product';
import { ProductVariant } from '@/modules/product-variant';
import { Purchase, PurchaseItem } from '@/modules/purchase';
import { Store } from '@/modules/store';
import { Supplier } from '@/modules/supplier';
import { Token } from '@/modules/token/token.model';
import { User } from '@/modules/user/user.model';

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

    this.database.addModels([
      Token,
      User,
      Store,
      Organization,
      Product,
      ProductVariant,
      Category,
      Inventory,
      Claim,
      ClaimItem,
      Customer,
      Supplier,
      Order,
      OrderItem,
      Purchase,
      PurchaseItem,
    ]);
  }

  isConnected() {
    return this.database.isDefined;
  }

  connect() {
    return this.database.authenticate();
  }

  sync() {
    return this.database.sync({
      alter: true,
      force: true,
    });
  }

  transaction() {
    return this.database.transaction();
  }

  close() {
    return this.database.close();
  }
}

let databaseInstance = null;

export const getDatabaseInstance = () => {
  if (!databaseInstance) {
    databaseInstance = new Database();
  }

  return databaseInstance;
};
