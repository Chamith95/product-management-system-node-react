import { Product } from '../product.enitity';

export interface ProductRepository {
  findById(id: string): Promise<Product | null>;
  findAll(options: FindAllProductsOptions): Promise<{ products: Product[]; total: number }>;
  save(entity: Product): Promise<Product>;
  update(id: string, entity: Partial<Product>): Promise<Product | null>;
  delete(id: string): Promise<boolean>;
}

export interface FindAllProductsOptions {
  page?: number;
  limit?: number;
  category?: string;
  sortBy?: 'name' | 'price' | 'quantity' | 'createdAt';
  sortOrder?: 'asc' | 'desc';
  sellerId?: string;
}
