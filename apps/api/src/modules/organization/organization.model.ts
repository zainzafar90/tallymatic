import { Column, DataType, HasMany, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { Status } from '@shared';

import { Store } from '../store';
import { User } from '../user';

@Table({
  timestamps: true,
  tableName: 'organizations',
})
export class Organization extends Model<Organization> {
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
    type: DataType.ENUM({ values: Object.values(Status) }),
    allowNull: false,
    defaultValue: Status.ACTIVE,
  })
  status: Status;

  @HasMany(() => Store)
  stores: Store[];

  @HasMany(() => User)
  users: User[];
}
