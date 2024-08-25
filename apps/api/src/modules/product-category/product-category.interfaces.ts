export interface IProductCategory {
  id?: string;
  productId: string;
  categoryId: string;
}

export type NewCreatedProductCategory = Omit<IProductCategory, 'id'>;
