import {
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

import { Organization } from '../organization/organization.model';
import { Supplier } from '../supplier/supplier.model';
import { PurchaseItem } from './purchase-item.model';

export enum PurchaseStatus {
  DRAFT = 'draft',
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

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
}
