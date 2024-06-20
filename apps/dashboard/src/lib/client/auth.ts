import { EmailPassReq } from '../../types/api-payloads';
import { EmailPassRes } from '../../types/api-responses';
import { postRequest } from './common';

async function register(payload: EmailPassReq) {
  return postRequest<EmailPassRes>('/v1/auth/register', payload);
}

async function login(payload: EmailPassReq) {
  return postRequest<EmailPassRes>('/v1/auth/login', payload);
}

async function logout() {
  return postRequest<void>('/v1/auth/logout');
}

export const auth = {
  register,
  login,
  logout,
};
