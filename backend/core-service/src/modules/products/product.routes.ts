import { Router } from 'express';
import { ProductController } from './product.controller';
import { ProductService } from './product.service';
import { TypeOrmProductRepository } from './repositories/type-orm-product.repository';

const router = Router();

// Dependency injection
const productRepository = new TypeOrmProductRepository();
const productService = new ProductService(productRepository);
const productController = new ProductController(productService);

// Routes
router.post('/', productController.createProduct);
router.get('/', productController.getAllProducts);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

export default router;
