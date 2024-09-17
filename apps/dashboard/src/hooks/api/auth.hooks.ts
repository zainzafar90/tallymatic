import { AuthResponse, EmailPassReq } from '@shared';
import { useMutation, UseMutationOptions } from '@tanstack/react-query';

import { queryClient } from '@/lib/query-client';
import { API_TOKEN_KEY } from '@/utils/common.utils';

import { client } from '../../lib/client';

const handleAuthSuccess = async (data: AuthResponse) => {
  if (data.access.token) {
    localStorage.setItem(API_TOKEN_KEY, data.access.token);
  }
};

export const useEmailPassLogin = (options?: UseMutationOptions<AuthResponse, Error, EmailPassReq>) => {
  return useMutation({
    mutationFn: (payload) => client.auth.login(payload),
    onSuccess: async (data, variables, context) => {
      await handleAuthSuccess(data);
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error, { token: string }>) => {
  return useMutation({
    mutationFn: (payload) => client.auth.logout(payload),
    onSettled(data, error, variables, context) {
      localStorage.removeItem(API_TOKEN_KEY);
      options?.onSettled?.(data, error, variables, context);
      /**
       * When the user logs out, we want to clear the query cache
       */
      queryClient.clear();
    },
    ...options,
  });
};

export const useCreateAuthUser = (options?: UseMutationOptions<AuthResponse, Error, EmailPassReq>) => {
  return useMutation({
    mutationFn: (payload) => client.auth.register(payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
