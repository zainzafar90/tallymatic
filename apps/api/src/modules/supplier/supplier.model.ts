import { Column, DataType, DefaultScope, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

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
}
