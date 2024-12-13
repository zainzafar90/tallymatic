import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { PurchaseStatus } from '@shared';

import { Store } from '../store/store.model';
import { Supplier } from '../supplier/supplier.model';
import { PurchaseItem } from './purchase-item.model';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({ tableName: 'purchases' })
export class Purchase extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column(DataType.STRING)
  orderNumber: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(PurchaseStatus) }),
    allowNull: false,
    defaultValue: PurchaseStatus.DRAFT,
  })
  status: PurchaseStatus;

  @Column(DataType.DECIMAL(10, 2))
  totalAmount: number;

  @Column(DataType.DATE)
  expectedArrivalDate: Date;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  receivedQuantity: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
    defaultValue: 0,
  })
  totalQuantity: number;

  @Column(DataType.TEXT)
  notes: string;

  @ForeignKey(() => Supplier)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  supplierId: string;

  @ForeignKey(() => Store)
  @Column(DataType.UUID)
  storeId: string;

  @BelongsTo(() => Store)
  store: Store;

  @BelongsTo(() => Supplier)
  supplier: Supplier;

  @HasMany(() => PurchaseItem)
  items: PurchaseItem[];

  @BeforeCreate
  static async generateOrderNumber(instance: Purchase) {
    const transaction = await instance.sequelize.transaction();
    try {
      const maxOrder = await Purchase.findOne({
        where: { storeId: instance.storeId },
        attributes: [[instance.sequelize.fn('max', instance.sequelize.col('orderNumber')), 'maxNumber']],
        transaction,
      });

      let nextNumber = 1;
      if (maxOrder && maxOrder.getDataValue('maxNumber')) {
        const currentMax = parseInt(maxOrder.getDataValue('maxNumber').split('-')[1], 10);
        nextNumber = currentMax + 1;
      }

      instance.orderNumber = `PO-${nextNumber}`;

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
