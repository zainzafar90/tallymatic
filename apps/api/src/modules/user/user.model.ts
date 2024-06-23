import bcrypt from 'bcryptjs';
import { Column, DataType, DefaultScope, HasMany, IsUUID, Model, PrimaryKey, Scopes, Table } from 'sequelize-typescript';
import { RoleType } from '@shared';

import { Token } from '../token/token.model';
import { IUser } from './user.interfaces';

@DefaultScope(() => ({
  attributes: { exclude: ['password'] },
  paranoid: true,
}))
@Scopes(() => ({
  withPassword: {
    attributes: { include: ['password'] },
  },
}))
@Table({ tableName: 'users', timestamps: true, paranoid: true })
export class User extends Model<User> {
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
    unique: true,
    allowNull: false,
    validate: {
      isEmail: true,
    },
    set(value: string) {
      this.setDataValue('email', value.toLowerCase());
    },
  })
  email: string;

  @Column({ type: DataType.STRING })
  contact: string;

  @Column({
    type: DataType.STRING,
    validate: {
      min: 8,
      max: 128,
      is: /^(?=.*[a-zA-Z])(?=.*[0-9])/, // Password must contain at least one letter and one number
    },
  })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isEmailVerified: boolean;

  @Column({
    type: DataType.ENUM({ values: Object.values(RoleType) }),
    allowNull: false,
    defaultValue: RoleType.User,
  })
  role: RoleType;

  @HasMany(() => Token)
  tokens: Token[];
}

export const hashPassword = async function (password: string): Promise<string> {
  return bcrypt.hash(password, 8);
};

export const isPasswordMatch = async function (password: string, user: IUser): Promise<boolean> {
  return bcrypt.compare(password, user.password);
};
