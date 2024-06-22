import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  IsUUID,
  Model,
  PrimaryKey,
  Table,
} from 'sequelize-typescript';

import { Role } from './role.model';
import { User } from './user.postgres.model';

@DefaultScope(() => ({
  attributes: { exclude: ['createdAt', 'updatedAt', 'deletedAt'] },
}))
@Table({ tableName: 'user_roles', timestamps: true })
export class UserRole extends Model<UserRole> {
  @IsUUID(4)
  @PrimaryKey
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
  })
  id: string;

  @ForeignKey(() => User)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  userId: string;

  @ForeignKey(() => Role)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  roleId: string;

  @BelongsTo(() => User)
  user: User;

  @BelongsTo(() => Role)
  role: Role;
}
