import { analytics } from './analytics.requests';
import { auth } from './auth.requests';
import { categories } from './category.requests';
import { customers } from './customer.requests';
import { inventory } from './inventory.requests';
import { orders } from './order.requests';
import { products } from './product.requests';
import { purchases } from './purchase.requests';
import { stores } from './stores.requests';
import { suppliers } from './supplier.requests';
import { users } from './users.requests';

export const client = {
  analytics,
  auth,
  users,
  stores,
  products,
  categories,
  inventory,
  customers,
  suppliers,
  orders,
  purchases,
};
