import { and, desc, eq, lte, sql } from 'drizzle-orm';

import { db } from '@/db';
import {
  categories,
  customers,
  orderItems,
  orders,
  products,
  purchaseItems,
  purchases,
  suppliers,
  variants,
} from '@/db/schema';

export const getSalesTrend = async (organizationId: string, storeId: string, days: number = 30) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const salesData = await db
    .select({
      date: sql<string>`DATE(${orders.createdAt})`,
      sales: sql<number>`SUM(${orders.totalAmount})`,
    })
    .from(orders)
    .where(
      and(eq(orders.organizationId, organizationId), eq(orders.storeId, storeId), sql`${orders.createdAt} >= ${startDate}`)
    )
    .groupBy(sql`DATE(${orders.createdAt})`)
    .orderBy(sql`DATE(${orders.createdAt})`);

  return {
    results: salesData,
    count: salesData.length,
    limit: days,
    offset: 0,
    pages: Math.ceil(salesData.length / days),
  };
};

export const getTopSellingProducts = async (
  organizationId: string,
  storeId: string,
  limit: number = 10,
  days: number = 30
) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const topProducts = await db
    .select({
      id: variants.id,
      name: sql<string>`COALESCE(${variants.name}, ${products.name})`,
      sku: variants.sku,
      totalQuantity: sql<number>`SUM(${orderItems.quantity})`,
      totalRevenue: sql<number>`SUM(${orderItems.quantity} * CAST(${orderItems.price} AS DECIMAL))`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .where(
      and(eq(orders.organizationId, organizationId), eq(orders.storeId, storeId), sql`${orders.createdAt} >= ${startDate}`)
    )
    .groupBy(variants.id, variants.name, products.name, variants.sku)
    .orderBy(desc(sql<number>`SUM(${orderItems.quantity})`))
    .limit(limit);

  return {
    results: topProducts,
    count: topProducts.length,
    limit,
    offset: 0,
    pages: Math.ceil(topProducts.length / limit),
  };
};

export const getLowStockAlerts = async (organizationId: string, storeId: string, limit: number = 10) => {
  const results = await db
    .select({
      id: variants.id,
      name: variants.name,
      sku: variants.sku,
      stock: variants.stock,
      lowStockThreshold: variants.lowStockThreshold,
      productName: products.name,
      productId: products.id,
    })
    .from(variants)
    .innerJoin(products, eq(variants.productId, products.id))
    .where(
      and(
        eq(products.organizationId, organizationId),
        eq(variants.storeId, storeId),
        lte(variants.stock, variants.lowStockThreshold)
      )
    )
    .orderBy(variants.stock)
    .limit(limit)
    .offset(0)
    .groupBy(variants.id, products.id);

  return {
    results,
    count: results.length,
    limit,
    offset: 0,
    pages: Math.ceil(results.length / limit),
  };
};

export const getProfitByCategory = async (organizationId: string, storeId: string, days: number = 30, limit: number = 5) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  const profitData = await db
    .select({
      categoryId: categories.id,
      categoryName: categories.name,
      totalRevenue: sql<number>`SUM(${orderItems.quantity} * CAST(${orderItems.price} AS DECIMAL))`,
      totalOrders: sql<number>`COUNT(DISTINCT ${orders.id})`,
    })
    .from(orderItems)
    .innerJoin(orders, eq(orderItems.orderId, orders.id))
    .innerJoin(variants, eq(orderItems.variantId, variants.id))
    .innerJoin(products, eq(variants.productId, products.id))
    .leftJoin(categories, eq(products.categoryId, categories.id))
    .where(
      and(eq(orders.organizationId, organizationId), eq(orders.storeId, storeId), sql`${orders.createdAt} >= ${startDate}`)
    )
    .groupBy(categories.id, categories.name)
    .orderBy(desc(sql<number>`SUM(${orderItems.quantity} * CAST(${orderItems.price} AS DECIMAL))`))
    .limit(limit)
    .offset(0);

  return {
    results: profitData,
    count: profitData.length,
    limit,
    offset: 0,
    pages: Math.ceil(profitData.length / limit),
  };
};

export const getRecentSales = async (organizationId: string, storeId: string, limit: number = 10) => {
  const recentSales = await db
    .select({
      id: orders.id,
      orderNumber: orders.orderNumber,
      totalAmount: orders.totalAmount,
      customerName: customers.name,
      createdAt: orders.createdAt,
      itemCount: sql<number>`COUNT(${orderItems.id})`,
    })
    .from(orders)
    .leftJoin(orderItems, eq(orders.id, orderItems.orderId))
    .leftJoin(customers, eq(orders.customerId, customers.id))
    .where(and(eq(orders.organizationId, organizationId), eq(orders.storeId, storeId)))
    .groupBy(orders.id, customers.name)
    .orderBy(desc(orders.createdAt))
    .limit(limit);

  return {
    results: recentSales,
    count: recentSales.length,
    limit,
    offset: 0,
    pages: 1,
  };
};

export const getPendingPurchaseOrders = async (organizationId: string, storeId: string, limit: number = 10) => {
  const pendingOrders = await db
    .select({
      id: purchases.id,
      purchaseNumber: purchases.purchaseNumber,
      totalAmount: purchases.totalAmount,
      supplierName: suppliers.contactName,
      createdAt: purchases.createdAt,
      itemCount: sql<number>`COUNT(${purchaseItems.id})`,
    })
    .from(purchases)
    .innerJoin(suppliers, eq(purchases.supplierId, suppliers.id))
    .innerJoin(purchaseItems, eq(purchases.id, purchaseItems.purchaseId))
    .where(and(eq(purchases.organizationId, organizationId), eq(purchases.storeId, storeId)))
    .orderBy(desc(purchases.createdAt))
    .groupBy(purchases.id, suppliers.contactName)
    .limit(limit)
    .offset(0);

  return {
    results: pendingOrders,
    count: pendingOrders.length,
    limit,
    offset: 0,
    pages: Math.ceil(pendingOrders.length / limit),
  };
};
