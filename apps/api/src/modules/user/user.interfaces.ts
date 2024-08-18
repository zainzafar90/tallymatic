import { RoleType } from '@shared';

import { AccessAndRefreshTokens } from '../token/token.interfaces';

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

export type UpdateUserBody = Partial<IUser>;

export type NewRegisteredUser = Omit<IUser, 'id' | 'role' | 'isEmailVerified'>;

export type NewCreatedUser = Omit<IUser, 'id' | 'isEmailVerified'>;

export interface IUserWithTokens {
  user: IUser;
  tokens: AccessAndRefreshTokens;
}
