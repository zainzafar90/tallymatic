import { Moment } from 'moment';

import { Status, TokenType } from '../enums.types';
import { RoleType } from '../role.types';

type Dates = {
  createdAt?: Date;
  updatedAt?: Date;
};

export type IAccessAndRefreshTokens = {
  access: {
    token: string;
    expires: Date;
  };
  refresh: {
    token: string;
    expires: Date;
  };
};

export interface IToken {
  token: string;
  user: string;
  type: TokenType;
  expires: Moment;
  blacklisted?: boolean;
}

export interface IUser {
  id?: string;
  name: string;
  email: string;
  password?: string;
  isEmailVerified: boolean;
  organizationId: string;
  contact?: string;
  role: RoleType;
}

export interface IOrganization {
  id?: string;
  name: string;
  description?: string;
  status: Status;
}

export interface IStore {
  id?: string;
  name: string;
  location: string;
  organizationId: string;
}

export interface IProduct extends Dates {
  id: string;
  name: string;
  description?: string;
  status: Status;
  categoryId?: string;
  variants: IProductVariant[];
}

export interface ICategory extends Dates {
  id: string;
  name: string;
  description?: string;
  parentCategoryId?: string | null;
  status: Status;
}

export interface IProductVariant {
  id?: string;
  name: string;
  sku: string;
  price: number;
  costPrice: number;
  stock: number;
  status: Status;
}
