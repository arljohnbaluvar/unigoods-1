import { Router } from 'express';
import { check } from 'express-validator';
import * as productController from '../controllers/product.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Get all products (public)
router.get('/', productController.getAllProducts);

// Get single product (public)
router.get('/:id', productController.getProduct);

// Create product (auth required)
router.post(
  '/',
  [
    auth,
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('condition', 'Condition must be one of: New, Like New, Good, Fair')
      .isIn(['New', 'Like New', 'Good', 'Fair']),
    check('imageUrl', 'Image URL is required').not().isEmpty(),
  ],
  productController.createProduct
);

// Update product (auth required)
router.put(
  '/:id',
  [
    auth,
    check('title', 'Title is required if provided').optional().not().isEmpty(),
    check('description', 'Description is required if provided').optional().not().isEmpty(),
    check('condition', 'Condition must be one of: New, Like New, Good, Fair')
      .optional()
      .isIn(['New', 'Like New', 'Good', 'Fair']),
    check('imageUrl', 'Image URL is required if provided').optional().not().isEmpty(),
  ],
  productController.updateProduct
);

// Delete product (auth required)
router.delete('/:id', auth, productController.deleteProduct);

// Search products (public)
router.get('/search/:query', productController.searchProducts);

// Get products by category (public)
router.get('/category/:category', productController.getProductsByCategory);

export default router; 