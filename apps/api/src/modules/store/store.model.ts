import { Column, DataType, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

@Table({
  timestamps: true,
  tableName: 'stores',
})
export class Store extends Model {
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
  name!: string;
  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location!: string;
}
