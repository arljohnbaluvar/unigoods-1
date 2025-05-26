import { Router } from 'express';
import authRoutes from './auth.routes';
import productRoutes from './product.routes';
import tradeRoutes from './trade.routes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/trades', tradeRoutes);

export default router; 