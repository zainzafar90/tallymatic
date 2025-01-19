import { Moment } from 'moment';

import { Status, TokenType } from '../enums.types';
import { RoleType } from '../role.types';

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
  organization?: IOrganization;
}

export interface IOrganization {
  id?: string;
  name: string;
  description?: string;
  status: Status;
  stores?: IStore[];
}

export interface IStore {
  id: string;
  name: string;
  organizationId: string;
  address?: string;
  status: Status;
}

export interface IStoreResponse {
  store: IStore;
}

export interface IStoreListResponse {
  results: IStore[];
  count: number;
  limit: number;
  offset: number;
  pages: number;
}
