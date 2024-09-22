import { auth } from './auth.requests';
import { categories } from './category.requests';
import { customers } from './customer.requests';
import { inventory } from './inventory.requests';
import { products } from './product.requests';
import { stores } from './stores.requests';
import { users } from './users.requests';

export const client = {
  auth,
  users,
  stores,
  products,
  categories,
  inventory,
  customers,
};
