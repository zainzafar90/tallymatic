import { CategoryStatus } from './category.model';

export interface ICategory {
  id?: string;
  name: string;
  description?: string;
  parentCategoryId?: string | null;
  status: CategoryStatus;
}

export type UpdateCategoryBody = Partial<ICategory>;

export type NewCreatedCategory = Omit<ICategory, 'id'>;
