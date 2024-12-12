import { Column, DataType, DefaultScope, HasMany, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Purchase } from '../purchase/purchase.model';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({
  timestamps: true,
  tableName: 'suppliers',
})
export class Supplier extends Model<Supplier> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  companyName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  contactName: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
    validate: {
      isEmail: true,
    },
  })
  email: string;

  @Column({
    type: DataType.STRING,
    allowNull: true,
  })
  phone: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  address: string;

  @HasMany(() => Purchase)
  purchases: Purchase[];
}
