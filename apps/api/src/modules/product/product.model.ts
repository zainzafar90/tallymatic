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
import { ProductStatus } from '@shared';

import { Category } from '../category';
import { Organization } from '../organization/organization.model';
import { ProductVariant } from '../product-variant';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({
  timestamps: true,
  tableName: 'products',
})
export class Product extends Model<Product> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizationId: string;

  @ForeignKey(() => Category)
  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  categoryId: string;

  @BelongsTo(() => Organization)
  organization: Organization;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  storeId: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  name: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(ProductStatus) }),
    allowNull: false,
    defaultValue: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @BelongsTo(() => Category)
  category: Category;

  @HasMany(() => ProductVariant)
  variants: ProductVariant[];
}
