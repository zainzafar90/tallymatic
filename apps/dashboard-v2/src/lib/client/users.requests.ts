import { UserDeleteResponse, UserListResponse, UserProfileResponse, UserResponse } from '@shared';

import { UpdateUserReq } from '../../types/api-payloads';
import { deleteRequest, getRequest, patchRequest } from './common';

async function me() {
  return getRequest<UserProfileResponse>('/v1/users/me');
}

async function retrieveUser(id: string, query?: Record<string, any>) {
  return getRequest<UserResponse>(`/v1/users/${id}`, query);
}

async function listUsers(query?: Record<string, any>) {
  return getRequest<UserListResponse>(`/v1/users`, query);
}

async function updateUser(id: string, payload: UpdateUserReq) {
  return patchRequest<UserResponse>(`/v1/users/${id}`, payload);
}

async function deleteUser(id: string) {
  return deleteRequest<UserDeleteResponse>(`/v1/users/${id}`);
}

export const users = {
  me,
  retrieve: retrieveUser,
  list: listUsers,
  update: updateUser,
  delete: deleteUser,
};
