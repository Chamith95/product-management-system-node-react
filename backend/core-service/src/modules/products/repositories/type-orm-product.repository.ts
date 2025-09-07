import { Repository } from 'typeorm';
import { Product } from '../product.enitity';
import { ProductRepository, FindAllProductsOptions } from './product.repository';
import { AppDataSource } from '../../../common';

export class TypeOrmProductRepository implements ProductRepository {
  private repository: Repository<Product>;

  constructor() {
    this.repository = AppDataSource.getRepository(Product);
  }

  async findById(id: string): Promise<Product | null> {
    return await this.repository.findOne({ where: { id: id } });
  }

  async findAll(options: FindAllProductsOptions): Promise<{ products: Product[]; total: number }> {
    const {
      page = 1,
      limit = 20,
      category,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      sellerId
    } = options;

    const queryBuilder = this.repository.createQueryBuilder('product');

    if (category) {
      queryBuilder.andWhere('product.category = :category', { category });
    }

    if (sellerId) {
      queryBuilder.andWhere('product.sellerId = :sellerId', { sellerId });
    }
    const sortColumn = `product.${sortBy}`;
    queryBuilder.orderBy(sortColumn, sortOrder.toUpperCase() as 'ASC' | 'DESC');

    const offset = (page - 1) * limit;
    queryBuilder.skip(offset).take(limit);

    const [products, total] = await queryBuilder.getManyAndCount();

    return { products, total };
  }

  async save(product: Product): Promise<Product> {
    return await this.repository.save(product);
  }

  async update(id: string, productData: Partial<Product>): Promise<Product | null> {
    const result = await this.repository.update(id, productData);
    if (result.affected === 0) {
      return null;
    }
    return await this.findById(id);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.repository.delete(id);
    if (result.affected != 0) {
      return true;
    }
    return false;
  }
}
