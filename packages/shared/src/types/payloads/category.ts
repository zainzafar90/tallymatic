import { ResourceListResponse } from '../api/api-operations';
import { Status } from '../enums.types';

interface BaseCategory {
  id: string;
  name: string;
  description?: string;
  status: Status;
  organizationId: string;
  createdAt: Date;
  updatedAt: Date;
  deletedAt?: Date;
}

/* ----------------------------
 * LIST VIEW TYPES
 * ---------------------------- */
export type ICategory = BaseCategory;

/* -----------------------------
 * CREATE/UPDATE OPERATION TYPES
 * ----------------------------- */
export interface CreateCategoryReq {
  name: string;
  description?: string;
}

export interface UpdateCategoryReq extends Partial<CreateCategoryReq> {
  status?: Status;
}

/* ----------------------------
 * RESPONSES
 * ---------------------------- */
export type CategoryListResponse = ResourceListResponse<ICategory>;
