import { BelongsTo, Column, DataType, ForeignKey, HasMany, Model, Table } from 'sequelize-typescript';
import { FinancialStatus, FulfillmentStatus } from '@shared';

import { Customer } from '../customer/customer.model';
import { OrderItem } from './order-item.model';

@Table({ tableName: 'orders' })
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Customer)
  @Column(DataType.UUID)
  customerId: string;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column(DataType.STRING)
  number: string;

  @Column(DataType.DATE)
  closedAt: Date;

  @Column(DataType.STRING)
  currency: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(FinancialStatus) }),
    allowNull: false,
  })
  financialStatus: FinancialStatus;

  @Column({
    type: DataType.ENUM({ values: Object.values(FulfillmentStatus) }),
    allowNull: false,
  })
  fulfillmentStatus: FulfillmentStatus;

  @Column(DataType.DECIMAL(10, 2))
  total: number;

  @Column(DataType.DECIMAL(10, 2))
  subtotal: number;

  @Column(DataType.DECIMAL(10, 2))
  totalTax: number;

  @Column(DataType.DECIMAL(10, 2))
  totalDiscount: number;

  @HasMany(() => OrderItem)
  items: OrderItem[];
}
