import express from 'express';
import { body } from 'express-validator';
import * as userController from '../controllers/user.controller';
import { authenticate } from '../middleware/auth';

const router = express.Router();

// Get user profile
router.get('/profile', authenticate, userController.getProfile);

// Update user profile
router.put(
  '/profile',
  authenticate,
  [
    body('name').trim().optional(),
    body('university').trim().optional(),
    body('bio').trim().optional(),
    body('phoneNumber').trim().optional(),
  ],
  userController.updateProfile
);

// Upload profile picture
router.post('/profile-picture', authenticate, userController.uploadProfilePicture);

// Get user's feedback
router.get('/feedback', authenticate, userController.getUserFeedback);

// Give feedback to user
router.post(
  '/feedback/:userId',
  authenticate,
  [
    body('rating').isInt({ min: 1, max: 5 }),
    body('comment').trim().notEmpty(),
  ],
  userController.giveFeedback
);

export default router; 