import { ProductService } from '../product.service';
import { ProductRepository } from '../repositories/product.repository';
import { Product, ProductCategory } from '../product.enitity';
import { CreateProductRequest } from '../dto/create-product-request.dto';
import { UpdateProductRequest } from '../dto/update-product-request.dto';
import { NotFoundException } from '../../../common/exceptions/not-found,exception';
import { beforeEach, describe, expect, it, jest } from '@jest/globals';

// Mock repository
const mockProductRepository: jest.Mocked<ProductRepository> = {
  findById: jest.fn(),
  findAll: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
};

describe('ProductService', () => {
  let productService: ProductService;

  beforeEach(() => {
    productService = new ProductService(mockProductRepository);
    jest.clearAllMocks();
  });

  describe('createProduct', () => {
    it('should create a product successfully', async () => {
      // Arrange
      const createRequest = new CreateProductRequest({
        name: 'Test Product',
        description: 'Test Description',
        price: 29.99,
        quantity: 10,
        category: ProductCategory.ELECTRONICS,
      });
      const sellerId = 'seller-123';
      const expectedProduct = new Product();
      expectedProduct.name = createRequest.name;
      expectedProduct.description = createRequest.description;
      expectedProduct.price = createRequest.price;
      expectedProduct.quantity = createRequest.quantity;
      expectedProduct.category = createRequest.category;
      expectedProduct.sellerId = sellerId;

      mockProductRepository.save.mockResolvedValue(expectedProduct);

      // Act
      const result = await productService.createProduct(createRequest, sellerId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'Test Product',
          description: 'Test Description',
          price: 29.99,
          quantity: 10,
          category: ProductCategory.ELECTRONICS,
          sellerId: 'seller-123',
        })
      );
    });
  });

  describe('getProductById', () => {
    it('should return product when found', async () => {
      // Arrange
      const productId = 'product-123';
      const expectedProduct = new Product();
      expectedProduct.name = 'Test Product';
      expectedProduct.description = 'Test Description';
      expectedProduct.price = 29.99;
      expectedProduct.quantity = 10;
      expectedProduct.category = ProductCategory.ELECTRONICS;
      expectedProduct.sellerId = 'seller-123';

      mockProductRepository.findById.mockResolvedValue(expectedProduct);

      // Act
      const result = await productService.getProductById(productId);

      // Assert
      expect(result).toEqual(expectedProduct);
      expect(mockProductRepository.findById).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Arrange
      const productId = 'non-existent-id';
      mockProductRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(productService.getProductById(productId))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('updateProduct', () => {
    it('should update product successfully', async () => {
      // Arrange
      const productId = 'product-123';
      const updateRequest = new UpdateProductRequest({
        name: 'Updated Product',
        price: 39.99,
      });
      const existingProduct = new Product();
      existingProduct.name = 'Original Product';
      existingProduct.description = 'Original Description';
      existingProduct.price = 29.99;
      existingProduct.quantity = 10;
      existingProduct.category = ProductCategory.ELECTRONICS;
      existingProduct.sellerId = 'seller-123';

      const updatedProduct = new Product();
      updatedProduct.name = updateRequest.name ?? existingProduct.name;
      updatedProduct.description = existingProduct.description;
      updatedProduct.price = updateRequest.price ?? existingProduct.price;
      updatedProduct.quantity = existingProduct.quantity;
      updatedProduct.category = existingProduct.category;
      updatedProduct.sellerId = existingProduct.sellerId;

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.update.mockResolvedValue(updatedProduct);

      // Act
      const result = await productService.updateProduct(productId, updateRequest);

      // Assert
      expect(result).toEqual(updatedProduct);
      expect(mockProductRepository.update).toHaveBeenCalledWith(productId, updateRequest);
    });

    it('should throw NotFoundException when product not found', async () => {
      // Arrange
      const productId = 'non-existent-id';
      const updateRequest = new UpdateProductRequest({ name: 'Updated Product' });
      mockProductRepository.findById.mockResolvedValue(null);

      // Act & Assert
      await expect(productService.updateProduct(productId, updateRequest))
        .rejects
        .toThrow(NotFoundException);
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', async () => {
      // Arrange
      const productId = 'product-123';
      const existingProduct = new Product();
      existingProduct.name = 'Test Product';
      existingProduct.description = 'Test Description';
      existingProduct.price = 29.99;
      existingProduct.quantity = 10;
      existingProduct.category = ProductCategory.ELECTRONICS;
      existingProduct.sellerId = 'seller-123';

      mockProductRepository.findById.mockResolvedValue(existingProduct);
      mockProductRepository.delete.mockResolvedValue(true);

      // Act
      await productService.deleteProduct(productId);

      // Assert
      expect(mockProductRepository.delete).toHaveBeenCalledWith(productId);
    });

    it('should throw NotFoundException when product not found', async () => {
      const productId = 'non-existent-id';
      mockProductRepository.findById.mockResolvedValue(null);

      await expect(productService.deleteProduct(productId))
        .rejects
        .toThrow(NotFoundException);
    });
  });
});
