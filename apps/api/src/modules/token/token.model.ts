import { BelongsTo, Column, DataType, ForeignKey, IsUUID, Model, PrimaryKey, Table } from 'sequelize-typescript';
import { TokenType } from '@shared';

import { User } from '../user/user.model';

@Table({ tableName: 'tokens', timestamps: true })
export class Token extends Model<Token> {
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
  token: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(TokenType) }),
    allowNull: false,
  })
  type: TokenType;

  @Column({ type: DataType.DATE, allowNull: false })
  expires: Date;

  @Column({
    type: DataType.BOOLEAN,
    allowNull: true,
  })
  blacklisted: boolean;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID, allowNull: false, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  userId: string;

  @BelongsTo(() => User)
  user: User;
}
