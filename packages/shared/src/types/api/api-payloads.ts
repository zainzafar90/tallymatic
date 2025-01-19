import { IOrganization, IStore, IUser } from '../interfaces/resources';

// Auth
export type EmailPassReq = { email: string; password: string };

// Users
export type CreateUserReq = Omit<IUser, 'id' | 'isEmailVerified' | 'organization'>;
export type UpdateUserReq = Partial<IUser>;
export type RegisterUserReq = Omit<IUser, 'id' | 'role' | 'isEmailVerified' | 'organization'>;

// Organization
export type CreateOrganizationReq = Omit<IOrganization, 'id' | 'stores'>;
export type UpdateOrganizationReq = Partial<IOrganization>;

// Store
export type CreateStoreReq = Omit<IStore, 'id' | 'organization'>;
export type UpdateStoreReq = Partial<IStore>;
