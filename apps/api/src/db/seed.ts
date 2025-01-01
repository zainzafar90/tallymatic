import { config } from 'dotenv';
import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { seed } from 'drizzle-seed';
import { Pool } from 'pg';
import { faker } from '@faker-js/faker';

import { variants } from './schema';
import { categories } from './schema/category.schema';
import { customers } from './schema/customer.schema';
import { inventory } from './schema/inventory.schema';
import { orderItems, orders } from './schema/order.schema';
import { organizations } from './schema/organization.schema';
import { products } from './schema/product.schema';
import { purchaseItems, purchases } from './schema/purchase.schema';
import { stores } from './schema/store.schema';
import { suppliers } from './schema/supplier.schema';
import { tokens } from './schema/token.schema';
import { users } from './schema/user.schema';

// Load environment variables
config();

if (!process.env.DB_URL) {
  throw new Error('DB_URL is not set');
}

console.log('DB_URL:', process.env.DB_URL);

const NUMBER_OF_PRODUCTS = 1_000;
const NUMBER_OF_VARIANTS = 1_000;

const pool = new Pool({
  connectionString: process.env.DB_URL,
});

const schema = {
  organizations,
  users,
  categories,
  stores,
  products,
  variants,
  customers,
  suppliers,
  orders,
  orderItems,
  purchases,
  purchaseItems,
  inventory,
};

const db = drizzle(pool, {
  schema,
});

const generateFakeCategory = () => {
  return faker.commerce.department();
};

const generateCategories = (count: number = 10) => {
  return Array.from({ length: count }, () => generateFakeCategory());
};

const generateFakeProduct = () => {
  return faker.commerce.productName();
};

const generateProducts = (count: number = NUMBER_OF_PRODUCTS) => {
  return Array.from({ length: count }, () => generateFakeProduct());
};

const generateFakeVariant = () => {
  return faker.commerce.productMaterial();
};

const generateVariants = (count: number = NUMBER_OF_VARIANTS) => {
  return Array.from({ length: count }, () => generateFakeVariant());
};

async function main() {
  try {
    console.log('🌱 Starting seed process...');

    // Replace the manual cleanup with the new function
    await cleanupDatabase(db);

    console.log('🌱 Seeding Initiated...');

    const hashedPassword = '$2a$08$1DdxLqST2pLfpcdOZZ.eRuWJ1H/DGD33e8RK5jilXHUICxPXsnJIK'; // securePassword123

    await seed(db, schema).refine((funcs) => ({
      organizations: {
        count: 1,
        columns: {
          name: funcs.companyName({ isUnique: true }),
          email: funcs.email(),
          contact: funcs.phoneNumber({ template: '+1 (###) ###-####' }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      stores: {
        count: 6,
        columns: {
          name: funcs.companyName({ isUnique: true }),
          address: funcs.streetAddress({ isUnique: true }),
          status: funcs.valuesFromArray({ values: ['active', 'inactive'] }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      users: {
        count: 10,
        columns: {
          name: funcs.fullName(),
          email: funcs.weightedRandom([
            {
              value: funcs.default({ defaultValue: 'admin@tallymatic.com' }),
              weight: 0.2,
            },
            {
              value: funcs.email(),
              weight: 0.8,
            },
          ]),
          password: funcs.default({ defaultValue: hashedPassword }),
          isEmailVerified: funcs.boolean(),
          contact: funcs.phoneNumber({ template: '+1 (###) ###-####' }),
          role: funcs.valuesFromArray({ values: ['super-admin'] }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      categories: {
        count: 10,
        columns: {
          name: funcs.valuesFromArray({
            values: generateCategories(10),
            isUnique: true,
          }),
          description: funcs.loremIpsum({ sentencesCount: 2 }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      products: {
        count: NUMBER_OF_PRODUCTS,
        columns: {
          description: funcs.loremIpsum({ sentencesCount: 1 }),
          price: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          status: funcs.valuesFromArray({ values: ['active', 'inactive'] }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      variants: {
        count: NUMBER_OF_VARIANTS,
        columns: {
          name: funcs.valuesFromArray({
            values: generateVariants(NUMBER_OF_VARIANTS),
          }),
          sku: funcs.phoneNumber({ template: 'SKU-#######' }),
          price: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          costPrice: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          stock: funcs.int({
            minValue: 1,
            maxValue: 10,
          }),
          lowStockThreshold: funcs.int({
            minValue: 0,
            maxValue: 5,
          }),
          reorderPoint: funcs.int({
            minValue: 0,
            maxValue: 5,
          }),
          reorderQuantity: funcs.int({
            minValue: 1,
            maxValue: 10,
          }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      inventory: {
        count: 100,
        columns: {
          quantity: funcs.int({
            minValue: 1,
            maxValue: 10,
          }),
          type: funcs.valuesFromArray({ values: ['sold', 'received', 'adjusted'] }),
          notes: funcs.loremIpsum({ sentencesCount: 2 }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      customers: {
        count: 100,
        columns: {
          name: funcs.fullName(),
          email: funcs.email(),
          phone: funcs.phoneNumber({ template: '+1 (###) ###-####' }),
          address: funcs.streetAddress(),
          status: funcs.valuesFromArray({ values: ['active', 'inactive'] }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
          deletedAt: funcs.default({ defaultValue: null }),
        },
      },
      suppliers: {
        count: 120,
        columns: {
          companyName: funcs.companyName(),
          contactName: funcs.fullName(),
          email: funcs.email(),
          phone: funcs.phoneNumber({ template: '+1 (###) ###-####' }),
        },
      },
      orders: {
        count: 10,
        columns: {
          orderNumber: funcs.valuesFromArray({
            values: [
              'ORD-0001',
              'ORD-0002',
              'ORD-0003',
              'ORD-0004',
              'ORD-0005',
              'ORD-0006',
              'ORD-0007',
              'ORD-0008',
              'ORD-0009',
              'ORD-0010',
            ],
          }),
          status: funcs.valuesFromArray({ values: ['pending', 'paid', 'unpaid', 'partiallyPaid', 'refunded', 'voided'] }),
          totalAmount: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          subtotal: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          taxAmount: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          discountAmount: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          currency: funcs.valuesFromArray({
            values: ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'INR', 'BRL', 'MXN', 'ZAR'],
          }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
        },
      },
      orderItems: {
        count: 400,
        columns: {
          quantity: funcs.int({
            minValue: 1,
            maxValue: 100,
          }),
          price: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          totalDiscount: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
        },
      },

      purchases: {
        count: 10,
        columns: {
          purchaseNumber: funcs.valuesFromArray({
            values: [
              'PO-0001',
              'PO-0002',
              'PO-0003',
              'PO-0004',
              'PO-0005',
              'PO-0006',
              'PO-0007',
              'PO-0008',
              'PO-0009',
              'PO-0010',
            ],
          }),
          status: funcs.valuesFromArray({ values: ['draft', 'ordered', 'partial', 'received', 'closed'] }),
          totalAmount: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
          createdAt: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
          expectedArrivalDate: funcs.date({
            minDate: '2023-01-01',
            maxDate: '2024-12-16',
          }),
          receivedQuantity: funcs.int({
            minValue: 1,
            maxValue: 100,
          }),
          totalQuantity: funcs.int({
            minValue: 1,
            maxValue: 100,
          }),
          notes: funcs.loremIpsum({ sentencesCount: 2 }),
        },
      },
      purchaseItems: {
        count: 400,
        columns: {
          quantity: funcs.int({
            minValue: 1,
            maxValue: 100,
          }),
          unitCost: funcs.number({
            minValue: 100,
            maxValue: 1000,
          }),
        },
      },
    }));

    console.log('✅ All data seeded successfully');
    const seededOrgs = await db.select().from(organizations);
    console.log('✅ Organizations seeded:', seededOrgs.length);
    const seededUsers = await db.select().from(users);
    console.log('✅ Users seeded:', seededUsers.length);
    const seededCategories = await db.select().from(categories);
    console.log('✅ Categories seeded:', seededCategories.length);
    const seededProducts = await db.select().from(products);
    console.log('✅ Products seeded:', seededProducts.length);
    const seededStores = await db.select().from(stores);
    console.log('✅ Stores seeded:', seededStores.length);
    const seededVariants = await db.select().from(variants);
    console.log('✅ Variants seeded:', seededVariants.length);
    const seededInventory = await db.select().from(inventory);
    console.log('✅ Inventory seeded:', seededInventory.length);
    const seededCustomers = await db.select().from(customers);
    console.log('✅ Customers seeded:', seededCustomers.length);
    const seededSuppliers = await db.select().from(suppliers);
    console.log('✅ Suppliers seeded:', seededSuppliers.length);
    const seededOrders = await db.select().from(orders);
    console.log('✅ Orders seeded:', seededOrders.length);
    const seededOrderItems = await db.select().from(orderItems);
    console.log('✅ Order Items seeded:', seededOrderItems.length);
    const seededPurchases = await db.select().from(purchases);
    console.log('✅ Purchases seeded:', seededPurchases.length);
    const seededPurchaseItems = await db.select().from(purchaseItems);
    console.log('✅ Purchase Items seeded:', seededPurchaseItems.length);

    console.log('✅ All data seeded successfully');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    console.log('🌱 Closing database connection...');
    await pool.end();
  }
}

main().catch((err) => {
  console.error('Failed to seed database:', err);
  process.exit(1);
});

async function cleanupDatabase(db: any) {
  console.log('🗑️  Cleaning up existing data...');

  const tables = [
    { name: 'purchaseItems', schema: purchaseItems },
    { name: 'purchases', schema: purchases },
    { name: 'customers', schema: customers },
    { name: 'orderItems', schema: orderItems },
    { name: 'orders', schema: orders },
    { name: 'inventory', schema: inventory },
    { name: 'variants', schema: variants },
    { name: 'products', schema: products },
    { name: 'categories', schema: categories },
    { name: 'suppliers', schema: suppliers },
    { name: 'stores', schema: stores },
    { name: 'tokens', schema: tokens },
    { name: 'users', schema: users },
    { name: 'organizations', schema: organizations },
  ];

  try {
    await db.execute(sql`SET session_replication_role = 'replica'`);

    for (const table of tables) {
      try {
        await db.execute(sql.raw(`TRUNCATE TABLE "${table.name}" RESTART IDENTITY CASCADE`));
        console.log(`✓ Cleaned ${table.name}`);
      } catch (error) {
        console.log(`ℹ️ Skipping ${table.name} - ${(error as Error).message}`);
      }
    }

    await db.execute(sql`SET session_replication_role = 'origin'`);

    console.log('✨ Database cleaned');
  } catch (error) {
    console.error('Error during cleanup:', error);
    throw error;
  }
}
