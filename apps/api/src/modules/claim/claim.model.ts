import { Column, DataType, HasMany, Model, Table } from 'sequelize-typescript';

import { ClaimItem } from './claim-item.model';

export enum ClaimType {
  SHORTAGE = 'shortage',
  OVERAGE = 'overage',
  DAMAGE = 'damage',
  QUALITY = 'quality',
  OTHER = 'other',
}

export enum ClaimStatus {
  OPEN = 'open',
  INVESTIGATING = 'investigating',
  RESOLVED = 'resolved',
  REJECTED = 'rejected',
}

@Table({
  timestamps: true,
  tableName: 'claims',
})
export class Claim extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ClaimType),
    allowNull: false,
  })
  type: ClaimType;

  @Column({
    type: DataType.ENUM,
    values: Object.values(ClaimStatus),
    allowNull: false,
    defaultValue: ClaimStatus.OPEN,
  })
  status: ClaimStatus;

  @Column({
    type: DataType.DATE,
    allowNull: false,
    defaultValue: DataType.NOW,
  })
  dateFiled: Date;

  @Column({
    type: DataType.DATE,
    allowNull: true,
  })
  dateResolved: Date;

  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  filedBy: string;

  @Column({
    type: DataType.UUID,
    allowNull: true,
  })
  assignedTo: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  description: string;

  @Column({
    type: DataType.TEXT,
    allowNull: true,
  })
  resolution: string;

  @HasMany(() => ClaimItem)
  items: ClaimItem[];
}
