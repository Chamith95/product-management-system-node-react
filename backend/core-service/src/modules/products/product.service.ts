import { ProductRepository, FindAllProductsOptions } from './repositories/product.repository';
import { Product } from './product.enitity';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { UpdateProductRequest } from './dto/update-product-request.dto';
import { validate } from 'class-validator';
import { ValidationException, NotFoundException } from '../../common';

export class ProductService {
  constructor(private readonly productRepository: ProductRepository) {}

  async createProduct(createRequest: CreateProductRequest, sellerId: string): Promise<Product> {
    // Validate the request
    const errors = await validate(createRequest);
    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      );
      throw new ValidationException('Invalid product data', errorMessages);
    }

    const product = new Product();
    Object.assign(product, createRequest, { sellerId });
    return await this.productRepository.save(product);
  }

  async getProductById(id: string): Promise<Product> {
    const product = await this.productRepository.findById(id);
    if (!product) {
      throw new NotFoundException('Product', id);
    }
    return product;
  }

  async getAllProducts(options: FindAllProductsOptions): Promise<{ products: Product[]; total: number }> {
    const defaultOptions: FindAllProductsOptions = {
      page: 1,
      limit: 20,
      sortBy: 'createdAt',
      sortOrder: 'desc',
      ...options
    };

    return await this.productRepository.findAll(defaultOptions);
  }

  async updateProduct(id: string, updateRequest: UpdateProductRequest): Promise<Product> {
    // Validate the request
    const errors = await validate(updateRequest);
    if (errors.length > 0) {
      const errorMessages = errors.map(error => 
        Object.values(error.constraints || {}).join(', ')
      );
      throw new ValidationException('Invalid update data', errorMessages);
    }

    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product', id);
    }

    const updatedProduct = await this.productRepository.update(id, updateRequest);
    if (!updatedProduct) {
      throw new NotFoundException('Product', id);
    }

    return updatedProduct;
  }

  async deleteProduct(id: string): Promise<void> {
    if (!id) {
      throw new NotFoundException('Product', id);
    }
    const existingProduct = await this.productRepository.findById(id);
    if (!existingProduct) {
      throw new NotFoundException('Product', id);
    }

    const deleted = await this.productRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException('Product', id);
    }
  }
}
