import { Status } from '@shared';

export interface ICategory {
  id?: string;
  name: string;
  description?: string;
  parentCategoryId?: string | null;
  status: Status;
}

export type UpdateCategoryBody = Partial<ICategory>;

export type NewCreatedCategory = Omit<ICategory, 'id'>;
