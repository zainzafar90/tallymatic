import { Status } from '@shared';

export interface IOrganization {
  id?: string;
  name: string;
  description?: string;
  status: Status;
}

export type UpdateOrganizationBody = Partial<IOrganization>;

export type NewCreatedOrganization = Omit<IOrganization, 'id'>;
