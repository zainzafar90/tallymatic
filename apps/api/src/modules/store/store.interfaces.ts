export interface IStore {
  id?: string;
  name: string;
  location: string;
}

export type UpdateStoreBody = Partial<IStore>;

export type NewCreatedStore = Omit<IStore, 'id'>;
