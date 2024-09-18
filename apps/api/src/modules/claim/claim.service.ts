import { Op } from 'sequelize';

import { getDatabaseInstance } from '@/database/db';

import { inventoryService } from '../inventory';
import { ClaimItem } from './claim-item.model';
import { Claim, ClaimStatus } from './claim.model';

export const createClaim = async (claimData: Partial<Claim>, items: Partial<ClaimItem>[]): Promise<Claim> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const claim = await Claim.create(claimData, { transaction });

    for (const item of items) {
      await ClaimItem.create({ ...item, claimId: claim.id }, { transaction });
    }

    await transaction.commit();

    return claim;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const updateClaimStatus = async (claimId: string, status: ClaimStatus): Promise<Claim> => {
  const claim = await Claim.findByPk(claimId);
  if (!claim) {
    throw new Error('Claim not found');
  }

  return claim.update({ status });
};

export const assignClaim = async (claimId: string, userId: string): Promise<Claim> => {
  const claim = await Claim.findByPk(claimId);
  if (!claim) {
    throw new Error('Claim not found');
  }

  return claim.update({ assignedTo: userId });
};

export const resolveClaim = async (claimId: string, resolution: string): Promise<Claim> => {
  const transaction = await getDatabaseInstance().transaction();

  try {
    const claim = await Claim.findByPk(claimId, {
      include: [ClaimItem],
      transaction,
    });

    if (!claim) {
      throw new Error('Claim not found');
    }

    for (const item of claim.items) {
      if (item.quantityVerified !== null) {
        const adjustment = item.quantityVerified - item.quantityReported;
        await inventoryService.createClaimAdjustment(
          item.variantId,
          adjustment,
          `Claim resolution adjustment for claim ${claimId}`
        );
      }
    }

    const claimUpdated = await claim.update(
      {
        status: ClaimStatus.RESOLVED,
        resolution,
        dateResolved: new Date(),
      },
      { transaction }
    );

    await transaction.commit();

    return claimUpdated;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

export const getClaimsByVariant = async (variantId: string): Promise<Claim[]> => {
  return Claim.findAll({
    include: [
      {
        model: ClaimItem,
        where: { variantId },
      },
    ],
  });
};

export const getClaimsByDateRange = async (startDate: Date, endDate: Date): Promise<Claim[]> => {
  return Claim.findAll({
    where: {
      dateFiled: {
        [Op.between]: [startDate, endDate],
      },
    },
  });
};
