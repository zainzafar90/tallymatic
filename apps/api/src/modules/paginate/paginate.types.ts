export interface QueryResult<T> {
  results: T[];
  pages: number;
  offset: number;
  limit: number;
  count: number;
}

export interface IOptions {
  sortBy?: string;
  projectBy?: string;
  populate?: string;
  limit?: number;
  offset?: number;
}
