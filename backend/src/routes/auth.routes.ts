import { Router } from 'express';
import { check } from 'express-validator';
import * as authController from '../controllers/auth.controller';

const router = Router();

// Register user
router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password must be 6 or more characters').isLength({ min: 6 }),
    check('university', 'University is required').not().isEmpty(),
  ],
  authController.register
);

// Login user
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  authController.login
);

// Verify email
router.get('/verify/:token', authController.verifyEmail);

// Forgot password
router.post(
  '/forgot-password',
  [check('email', 'Please include a valid email').isEmail()],
  authController.forgotPassword
);

// Reset password
router.post(
  '/reset-password/:token',
  [check('password', 'Password must be 6 or more characters').isLength({ min: 6 })],
  authController.resetPassword
);

export default router; 