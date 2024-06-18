import { UseMutationOptions, useMutation } from '@tanstack/react-query';

import { EmailPassReq } from '../../types/api-payloads';
import { EmailPassRes } from '../../types/api-responses';
import { client } from '../../lib/client';

export const useEmailPassLogin = (
  options?: UseMutationOptions<EmailPassRes, Error, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.auth.login(payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useLogout = (options?: UseMutationOptions<void, Error>) => {
  return useMutation({
    mutationFn: () => client.auth.logout(),
    ...options,
  });
};

export const useCreateAuthUser = (
  options?: UseMutationOptions<EmailPassRes, Error, EmailPassReq>
) => {
  return useMutation({
    mutationFn: (payload) => client.auth.register(payload),
    onSuccess: async (data, variables, context) => {
      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
