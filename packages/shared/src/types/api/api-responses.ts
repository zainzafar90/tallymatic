import { IAccessAndRefreshTokens, IOrganization, IStore, IUser } from '../interfaces/resources';
import { DeleteResponse, ResourceListResponse, ResourceResponse } from './api-operations';

// Auth
export type AuthResponse = ResourceResponse<IAccessAndRefreshTokens>;
export type UserAuthResponse = ResourceResponse<{ tokens: IAccessAndRefreshTokens } & { user: IUser }>;

// Profile
export type UserProfileResponse = ResourceResponse<IUser & { organization: IOrganization }>;

// Users
export type UserResponse = ResourceResponse<IUser>;
export type UserListResponse = ResourceListResponse<IUser>;
export type UserDeleteResponse = DeleteResponse;

// Organization
export type OrganizationResponse = ResourceResponse<IOrganization>;
export type OrganizationListResponse = ResourceListResponse<IOrganization>;
export type OrganizationDeleteResponse = DeleteResponse;

// Store
export type StoreResponse = ResourceResponse<IStore>;
export type StoreListResponse = ResourceListResponse<IStore>;
export type StoreDeleteResponse = DeleteResponse;
