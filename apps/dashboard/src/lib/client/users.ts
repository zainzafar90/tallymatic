import { UpdateUserReq } from "../../types/api-payloads"
import { UserDeleteRes, UserListRes, UserRes } from "../../types/api-responses"
import { deleteRequest, getRequest, postRequest } from "./common"

async function me() {
  return getRequest<UserRes>("/users/me")
}

async function retrieveUser(id: string, query?: Record<string, any>) {
  return getRequest<UserRes>(`/users/${id}`, query)
}

async function listUsers(query?: Record<string, any>) {
  return getRequest<UserListRes>(`/users`, query)
}

async function updateUser(id: string, payload: UpdateUserReq) {
  return postRequest<UserRes>(`/users/${id}`, payload)
}

async function deleteUser(id: string) {
  return deleteRequest<UserDeleteRes>(`/users/${id}`)
}

export const users = {
  me,
  retrieve: retrieveUser,
  list: listUsers,
  update: updateUser,
  delete: deleteUser,
}
