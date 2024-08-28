export const createQueryKeys = (baseKey: string) => ({
  all: [baseKey] as const,
  list: (params?: Record<string, unknown>) => [baseKey, 'list', params] as const,
  detail: (id?: string, params?: Record<string, unknown>) =>
    id ? [baseKey, 'detail', id, params] : ([baseKey, 'detail', params] as const),
});
