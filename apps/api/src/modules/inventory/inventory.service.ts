import { Op, Sequelize } from 'sequelize';
import { InventoryLevelsResponse, IOptions, LowStockAlertsResponse, TransactionType } from '@shared';

import { getDatabaseInstance } from '@/database/db';

import { buildPaginationOptions, transformPagination } from '../paginate/paginate';
import { Product } from '../product';
import { ProductVariant } from '../product-variant';
import { Inventory } from './inventory.model';

export const createClaimAdjustment = async (variantId: string, quantity: number, notes?: string): Promise<Inventory> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const inventoryCreated = await adjustStock(variantId, quantity, TransactionType.ADJUSTED, notes);
    await transaction.commit();

    return inventoryCreated;
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};

// export const getInventoryLevels = async (productId: string): Promise<ProductVariant[]> => {
//   return ProductVariant.findAll({
//     where: { productId },
//     attributes: ['id', 'name', 'stock', 'lowStockThreshold', 'reorderPoint', 'reorderQuantity'],
//   });
// };

export const getAllInventoryLevels = async (
  filter: Record<string, any>,
  options: IOptions,
  wildcardFields: string[] = []
): Promise<InventoryLevelsResponse> => {
  const searchFilter = {};
  for (const [key, value] of Object.entries(filter)) {
    if (wildcardFields.includes(key)) {
      searchFilter[key] = { [Op.iLike]: `%${value}%` };
    } else {
      searchFilter[key] = value;
    }
  }

  const paginationOptions = buildPaginationOptions({}, options, wildcardFields);
  const result = await ProductVariant.findAndCountAll({
    ...paginationOptions,
    attributes: ['id', 'name', 'sku', 'stock', 'lowStockThreshold', 'reorderPoint', 'reorderQuantity'],
    include: [
      {
        model: Product,
        attributes: ['name'],
        where: searchFilter,
      },
    ],
  });

  return transformPagination(result.count, result.rows, paginationOptions.offset, paginationOptions.limit);
};

export const checkLowStockAlerts = async (): Promise<LowStockAlertsResponse> => {
  const result = await ProductVariant.findAndCountAll({
    where: {
      stock: {
        [Op.lte]: Sequelize.col('lowStockThreshold'),
      },
    },
    order: [['stock', 'ASC']],
  });

  return transformPagination(result.count, result.rows, 0, result.count);
};

export const adjustStock = async (
  variantId: string,
  quantity: number,
  type: TransactionType,
  notes?: string
): Promise<Inventory> => {
  const transaction = await getDatabaseInstance().transaction();
  try {
    const variant = await ProductVariant.findByPk(variantId, { transaction });
    if (!variant) {
      throw new Error('Product variant not found');
    }

    const newStock = variant.stock + quantity;
    if (newStock < 0) {
      throw new Error('Insufficient stock');
    }

    await variant.update({ stock: newStock }, { transaction });

    const inventoryCreated = await Inventory.create(
      {
        variantId,
        quantity,
        type,
        notes,
      },
      { transaction }
    );
    await transaction.commit();

    return inventoryCreated.toJSON();
  } catch (error) {
    await transaction.rollback();
    throw error;
  }
};
