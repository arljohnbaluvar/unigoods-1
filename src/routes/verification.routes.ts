import { Router } from 'express';
import {
  submitVerification,
  getVerificationStatus,
  reviewVerification,
  getAllVerifications,
} from '../controllers/verification.controller';
import { protect, restrictTo } from '../middleware/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.use(protect as any);

// User routes
router.post('/submit', submitVerification as any);
router.get('/status', getVerificationStatus as any);

// Admin routes
router.get('/all', restrictTo('admin') as any, getAllVerifications as any);
router.patch('/:verificationId/review', restrictTo('admin') as any, reviewVerification as any);

export default router; 