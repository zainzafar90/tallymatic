import { AuthResponse, EmailPassReq } from '@shared';

import { postRequest } from './common';

async function register(payload: EmailPassReq) {
  return postRequest<AuthResponse>('/v1/auth/register', payload);
}

async function login(payload: EmailPassReq) {
  return postRequest<AuthResponse>('/v1/auth/login', payload);
}

async function logout(payload: { token: string }) {
  return postRequest<void>('/v1/auth/logout', payload);
}

async function refreshToken(payload: { token: string }) {
  return postRequest<AuthResponse>('/v1/auth/refresh-token', payload);
}

export const auth = {
  register,
  login,
  logout,
  refreshToken,
};
