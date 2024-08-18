import { Column, DataType, HasMany, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { Store } from '../store';
import { User } from '../user';

export enum OrganizationStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Table({
  timestamps: true,
  tableName: 'organizations',
})
export class Organization extends Model {
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
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.ENUM(...Object.values(OrganizationStatus)),
    allowNull: false,
    defaultValue: OrganizationStatus.ACTIVE,
  })
  status: OrganizationStatus;

  @HasMany(() => Store)
  stores: Store[];

  @HasMany(() => User)
  users: User[];
}
