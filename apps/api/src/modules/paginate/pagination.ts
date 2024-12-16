export type PaginationParams = {
  page?: number;
  limit?: number;
};

export const getPaginationConfig = (params: PaginationParams) => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const offset = (page - 1) * limit;

  return {
    limit,
    offset,
  };
};
