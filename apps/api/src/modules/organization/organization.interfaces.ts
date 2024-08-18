import { OrganizationStatus } from './organization.model';

export interface IOrganization {
  id?: string;
  name: string;
  description?: string;
  status: OrganizationStatus;
}

export type UpdateOrganizationBody = Partial<IOrganization>;

export type NewCreatedOrganization = Omit<IOrganization, 'id'>;
