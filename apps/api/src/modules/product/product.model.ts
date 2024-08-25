import {
  BelongsTo,
  BelongsToMany,
  Column,
  DataType,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Category } from '../category';
import { Organization } from '../organization/organization.model';
import { ProductCategory } from '../product-category';
import { Store } from '../store/store.model';

export enum ProductStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  timestamps: true,
  tableName: 'products',
})
export class Product extends Model {
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

  @BelongsTo(() => Organization)
  organization: Organization;

  @ForeignKey(() => Store)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  storeId: string;

  @BelongsTo(() => Store)
  store: Store;

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
    type: DataType.DECIMAL(10, 2),
    allowNull: false,
  })
  price: number;

  @Column({
    type: DataType.ENUM(...Object.values(ProductStatus)),
    allowNull: false,
    defaultValue: ProductStatus.ACTIVE,
  })
  status: ProductStatus;

  @BelongsToMany(() => Category, () => ProductCategory)
  categories: Category[];
}
