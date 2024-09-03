import { UserDeleteResponse, UserListResponse, UserProfileResponse, UserResponse } from '@shared';
import { QueryKey, useMutation, UseMutationOptions, useQuery, UseQueryOptions } from '@tanstack/react-query';

import { client } from '@/lib/client';
import { queryClient } from '@/lib/query-client';
import { queryKeysFactory } from '@/lib/query-key-factory';
import { UpdateUserReq } from '@/types/api-payloads';

const USERS_QUERY_KEY = 'users' as const;
export const usersQueryKeys = queryKeysFactory(USERS_QUERY_KEY);

export const useMe = (options?: UseQueryOptions<UserProfileResponse, Error, UserProfileResponse, QueryKey>) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.users.me(),
    queryKey: usersQueryKeys.detail('me'),
    ...options,
  });

  return {
    data,
    ...rest,
  };
};

export const useUser = (
  id: string,
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<UserResponse, Error, UserResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.users.retrieve(id, query),
    queryKey: usersQueryKeys.detail(id),
    ...options,
  });

  return { ...data, ...rest };
};

export const useUsers = (
  query?: Record<string, any>,
  options?: Omit<UseQueryOptions<UserListResponse, Error, UserListResponse, QueryKey>, 'queryFn' | 'queryKey'>
) => {
  const { data, ...rest } = useQuery({
    queryFn: () => client.users.list(query),
    queryKey: usersQueryKeys.list(query),
    ...options,
  });

  return { ...data, ...rest };
};

export const useUpdateUser = (id: string, options?: UseMutationOptions<UserResponse, Error, UpdateUserReq>) => {
  return useMutation({
    mutationFn: (payload) => client.users.update(id, payload),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.list() });

      // We invalidate the me query in case the user updates their own profile
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail('me') });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};

export const useDeleteUser = (id: string, options?: UseMutationOptions<UserDeleteResponse, Error, void>) => {
  return useMutation({
    mutationFn: () => client.users.delete(id),
    onSuccess: (data, variables, context) => {
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.list() });

      // We invalidate the me query in case the user updates their own profile
      queryClient.invalidateQueries({ queryKey: usersQueryKeys.detail('me') });

      options?.onSuccess?.(data, variables, context);
    },
    ...options,
  });
};
