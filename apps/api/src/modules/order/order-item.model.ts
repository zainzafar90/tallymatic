import { BelongsTo, Column, DataType, ForeignKey, Model, Table } from 'sequelize-typescript';

import { ProductVariant } from '../product-variant/product-variant.model';
import { Order } from './order.model';

@Table({ tableName: 'order_items' })
export class OrderItem extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Order)
  @Column(DataType.UUID)
  orderId: string;

  @BelongsTo(() => Order)
  order: Order;

  @ForeignKey(() => ProductVariant)
  @Column(DataType.UUID)
  variantId: string;

  @BelongsTo(() => ProductVariant)
  variant: ProductVariant;

  @Column(DataType.INTEGER)
  quantity: number;

  @Column(DataType.DECIMAL(10, 2))
  price: number;

  @Column(DataType.DECIMAL(10, 2))
  totalDiscount: number;
}
