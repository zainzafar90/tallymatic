import { auth } from './auth.requests';
import { categories } from './category.requests';
import { customers } from './customer.requests';
import { inventory } from './inventory.requests';
import { orders } from './order.requests';
import { products } from './product.requests';
import { stores } from './stores.requests';
import { suppliers } from './supplier.requests';
import { users } from './users.requests';
import { variants } from './variant.requests';
import { purchases } from './purchase.requests';

export const client = {
  auth,
  users,
  stores,
  products,
  categories,
  inventory,
  customers,
  suppliers,
  orders,
  variants,
  purchases,
};
