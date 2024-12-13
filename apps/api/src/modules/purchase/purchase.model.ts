import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';
import { PurchaseStatus } from '@shared';

import { Organization } from '../organization/organization.model';
import { Supplier } from '../supplier/supplier.model';
import { PurchaseItem } from './purchase-item.model';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({
  timestamps: true,
  tableName: 'purchases',
})
export class Purchase extends Model {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
    unique: true,
  })
  orderNumber: string;

  @Column({
    type: DataType.ENUM(...Object.values(PurchaseStatus)),
    allowNull: false,
    defaultValue: PurchaseStatus.DRAFT,
  })
  status: PurchaseStatus;

  @Column({
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
    defaultValue: 0,
  })
  totalAmount: number;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
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

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizationId: string;

  @ForeignKey(() => Supplier)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  supplierId: string;

  @BelongsTo(() => Organization, 'organizationId')
  organization: Organization;

  @BelongsTo(() => Supplier, 'supplierId')
  supplier: Supplier;

  @HasMany(() => PurchaseItem)
  items: PurchaseItem[];

  @BeforeCreate
  static async generateOrderNumber(instance: Purchase) {
    const transaction = await instance.sequelize.transaction();
    try {
      const maxOrder = await Purchase.findOne({
        where: { organizationId: instance.organizationId },
        attributes: [[instance.sequelize.fn('max', instance.sequelize.col('orderNumber')), 'maxNumber']],
        transaction,
      });

      let nextNumber = 1;
      if (maxOrder && maxOrder.getDataValue('maxNumber')) {
        const currentMax = parseInt(maxOrder.getDataValue('maxNumber').split('-')[1], 10);
        nextNumber = currentMax + 1;
      }

      instance.orderNumber = `PUR-${nextNumber}`;

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
