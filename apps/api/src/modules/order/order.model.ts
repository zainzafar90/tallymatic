import {
  BeforeCreate,
  BelongsTo,
  Column,
  DataType,
  DefaultScope,
  ForeignKey,
  HasMany,
  Model,
  Table,
} from 'sequelize-typescript';
import { OrderStatus } from '@shared';

import { Customer } from '../customer/customer.model';
import { Store } from '../store/store.model'; // Assuming you have a Store model
import { OrderItem } from './order-item.model';

@DefaultScope(() => ({
  attributes: { include: ['createdAt', 'updatedAt'] },
}))
@Table({ tableName: 'orders' })
export class Order extends Model {
  @Column({
    type: DataType.UUID,
    defaultValue: DataType.UUIDV4,
    primaryKey: true,
  })
  id: string;

  @ForeignKey(() => Customer)
  @Column({
    type: DataType.UUID,
    allowNull: false,
  })
  customerId: string;

  @ForeignKey(() => Store)
  @Column(DataType.UUID)
  storeId: string;

  @BelongsTo(() => Store)
  store: Store;

  @BelongsTo(() => Customer)
  customer: Customer;

  @Column(DataType.STRING)
  orderNumber: string;

  @Column(DataType.DATE)
  closedAt: Date;

  @Column(DataType.STRING)
  currency: string;

  @Column({
    type: DataType.ENUM({ values: Object.values(OrderStatus) }),
    allowNull: false,
  })
  status: OrderStatus;

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

  @BeforeCreate
  static async generateOrderNumber(instance: Order) {
    const transaction = await instance.sequelize.transaction();
    try {
      const maxOrder = await Order.findOne({
        where: { storeId: instance.storeId },
        attributes: [[instance.sequelize.fn('max', instance.sequelize.col('orderNumber')), 'maxNumber']],
        transaction,
      });

      let nextNumber = 1;
      if (maxOrder && maxOrder.getDataValue('maxNumber')) {
        const currentMax = parseInt(maxOrder.getDataValue('maxNumber').split('-')[1], 10);
        nextNumber = currentMax + 1;
      }

      instance.orderNumber = `ORD-${nextNumber}`;

      await transaction.commit();
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  }
}
