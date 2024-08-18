import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Organization } from '../organization/organization.model';

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
  name: string;

  @Column({
    type: DataType.STRING,
    allowNull: false,
  })
  location: string;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizationId: string;

  @BelongsTo(() => Organization)
  organization: Organization;
}
