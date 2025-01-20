import { and, desc, eq, lte, sql } from 'drizzle-orm';

import { db } from '@/db';
import { orderItems, orders, products, variants } from '@/db/schema';

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
