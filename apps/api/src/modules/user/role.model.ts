import { BelongsToMany, Column, DataType, DefaultScope, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';

import { RoleType } from '../permissions/permission.interface';
import { UserRole } from './user-role.model';
import { User } from './user.postgres.model';

@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt'] },
}))
@Table({ tableName: 'roles', timestamps: true })
export class Role extends Model<Role> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @Column({
    type: DataType.ENUM(...Object.values(RoleType)),
    allowNull: false,
    unique: true,
  })
  name: RoleType;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];
}
