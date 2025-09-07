import { Request, Response, NextFunction } from 'express';
import { ProductService } from './product.service';
import { CreateProductRequest } from './dto/create-product-request.dto';
import { UpdateProductRequest } from './dto/update-product-request.dto';
import { ParamRequiredException } from '../../common/exceptions/param-required.exception';


export class ProductController {
  constructor(private readonly productService: ProductService) {}

  createProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const createRequest = new CreateProductRequest(req.body);
      const sellerId = req.body.sellerId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11'; // TODO: Extract from auth token
      const product = await this.productService.createProduct(createRequest, sellerId);
      
      res.status(201).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  getProductById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ParamRequiredException('id');
      }
      const product = await this.productService.getProductById(id);
      
      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  getAllProducts = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const {
        page = '1',
        limit = '20',
        category,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = req.query;

      const options = {
        page: parseInt(page as string),
        limit: parseInt(limit as string),
        category: category as string,
        sortBy: sortBy as 'name' | 'price' | 'quantity' | 'createdAt',
        sortOrder: sortOrder as 'asc' | 'desc',
        sellerId: req.body.sellerId || 'a0eebc99-9c0b-4ef8-bb6d-6bb9bd380a11' // TODO: Extract from auth token
      };

      const result = await this.productService.getAllProducts(options);
      
      const totalPages = Math.ceil(result.total / options.limit);
      
      res.status(200).json({
        success: true,
        data: {
          products: result.products,
          pagination: {
            page: options.page,
            limit: options.limit,
            total: result.total,
            totalPages,
            hasNext: options.page < totalPages,
            hasPrev: options.page > 1
          }
        }
      });
    } catch (error) {
      next(error);
    }
  };

  updateProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ParamRequiredException('id');
      }
      const updateRequest = new UpdateProductRequest(req.body);
      
      const product = await this.productService.updateProduct(id, updateRequest);

      res.status(200).json({
        success: true,
        data: product
      });
    } catch (error) {
      next(error);
    }
  };

  deleteProduct = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { id } = req.params;
      if (!id) {
        throw new ParamRequiredException('id');
      }
      await this.productService.deleteProduct(id);
      
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  };
}
