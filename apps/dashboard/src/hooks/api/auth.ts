import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { client } from '../../lib/client';
import { EmailPassReq } from '../../types/api-payloads';
import { EmailPassRes } from '../../types/api-responses';

const handleAuthSuccess = async (data: EmailPassRes) => {
  if (data.tokens.access.token) {
    localStorage.setItem('token', data.tokens.access.token);
  }
};

export const useEmailPassLogin = (options?: UseMutationOptions<EmailPassRes, Error, EmailPassReq>) => {
  return useMutation({
    mutationFn: (payload) => client.auth.login(payload),
    onSuccess: async (data, variables, context) => {
      await handleAuthSuccess(data);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error>) => {
  return useMutation({
    mutationFn: () => client.auth.logout(),
    onSuccess: async (data, variables, context) => {
      localStorage.removeItem('token');
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useCreateAuthUser = (options?: UseMutationOptions<EmailPassRes, Error, EmailPassReq>) => {
  return useMutation({
    mutationFn: (payload) => client.auth.register(payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
