import { ClaimStatus, ClaimType } from './claim.model';

export interface CreateClaimReq {
  claim: {
    type: ClaimType;
    description: string;
    filedBy: string;
  };
  items: {
    variantId: string;
    quantityReported: number;
    notes?: string;
  }[];
}

export interface ClaimResponse {
  id: string;
  type: ClaimType;
  status: ClaimStatus;
  dateFiled: Date;
  dateResolved: Date | null;
  filedBy: string;
  assignedTo: string | null;
  description: string;
  resolution: string | null;
  items: {
    id: string;
    variantId: string;
    quantityReported: number;
    quantityVerified: number | null;
    notes: string | null;
  }[];
}

export interface UpdateClaimStatusReq {
  status: ClaimStatus;
}

export interface AssignClaimReq {
  userId: string;
}

export interface ResolveClaimReq {
  resolution: string;
}
