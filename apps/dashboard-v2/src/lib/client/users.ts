import { UpdateUserReq } from '../../types/api-payloads';
import { UserDeleteRes, UserListRes, UserRes } from '../../types/api-responses';
import { deleteRequest, getRequest, patchRequest, postRequest } from './common';

async function me() {
  return getRequest<UserRes>('/v1/users/me');
}

async function retrieveUser(id: string, query?: Record<string, any>) {
  return getRequest<UserRes>(`/v1/users/${id}`, query);
}

async function listUsers(query?: Record<string, any>) {
  return getRequest<UserListRes>(`/v1/users`, query);
}

async function updateUser(id: string, payload: UpdateUserReq) {
  return patchRequest<UserRes>(`/v1/users/${id}`, payload);
}

async function deleteUser(id: string) {
  return deleteRequest<UserDeleteRes>(`/v1/users/${id}`);
}

export const users = {
  me,
  retrieve: retrieveUser,
  list: listUsers,
  update: updateUser,
  delete: deleteUser,
};
