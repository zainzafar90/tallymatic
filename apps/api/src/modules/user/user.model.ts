import bcrypt from 'bcryptjs';
import {
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  IsUUID,
  Model,
  PrimaryKey,
  Scopes,
  Table,
} from 'sequelize-typescript';
import { IUser, RoleType } from '@shared';

import { Organization } from '../organization';
import { Token } from '../token/token.model';

@DefaultScope(() => ({
  attributes: { exclude: ['password', 'deletedAt'], include: ['createdAt', 'updatedAt'] },
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
      len: [8, 128],
      customValidator(value: string) {
        if (!/(?=.*[a-zA-Z])(?=.*[0-9])/.test(value)) {
          throw new Error('Password must contain at least one letter and one number');
        }
      },
    },
  })
  password: string;

  @Column({ type: DataType.BOOLEAN, allowNull: false, defaultValue: false })
  isEmailVerified: boolean;

  @Column({
    type: DataType.ENUM({ values: Object.values(RoleType) }),
    allowNull: false,
    defaultValue: RoleType.Member,
  })
  role: RoleType;

  @ForeignKey(() => Organization)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  organizationId: string;

  @HasMany(() => Token)
  tokens: Token[];

  @BelongsTo(() => Organization)
  organization: Organization;

  toJSON(): object {
    const values = Object.assign({}, this.get());
    delete values.password;
    return values;
  }
}

export const hashPassword = async function (password: string): Promise<string> {
  return bcrypt.hash(password, 8);
};

export const isPasswordMatch = async function (password: string, user: IUser): Promise<boolean> {
  return bcrypt.compare(password, user.password);
};
