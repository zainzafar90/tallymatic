export type ListResponse<T> = {
  results: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
};

export type SingleItemResponse<T> = {
  [K in keyof T as `${string & K}`]: T[K];
};

export type ResourceResponse<T> = SingleItemResponse<T>;
export type ResourceListResponse<T> = ListResponse<T>;
export type DeleteResponse = void;
