import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ProductVariant } from '../product-variant';
import { Claim } from './claim.model';

@Table({
  timestamps: true,
  tableName: 'claim_items',
})
export class ClaimItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Claim)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  claimId: string;

  @BelongsTo(() => Claim)
  claim: Claim;

  @ForeignKey(() => ProductVariant)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  variantId: string;

  @BelongsTo(() => ProductVariant)
  variant: ProductVariant;

  @Column({
    type: DataType.INTEGER,
    allowNull: false,
  })
  quantityReported: number;

  @Column({
    type: DataType.INTEGER,
    allowNull: true,
  })
  quantityVerified: number;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  notes: string;
}
