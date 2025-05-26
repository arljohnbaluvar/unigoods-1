import { Router } from 'express';
import { check } from 'express-validator';
import * as tradeController from '../controllers/trade.controller';
import { auth } from '../middleware/auth';

const router = Router();

// Get my trades (auth required)
router.get('/my-trades', auth, tradeController.getMyTrades);

// Get single trade (auth required)
router.get('/:id', auth, tradeController.getTrade);

// Create trade (auth required)
router.post(
  '/',
  [
    auth,
    check('offeredItems', 'Offered items are required').isArray({ min: 1 }),
    check('requestedItems', 'Requested items are required').isArray({ min: 1 }),
    check('recipientId', 'Recipient ID is required').isMongoId(),
    check('message', 'Message must be a string if provided').optional().isString(),
  ],
  tradeController.createTrade
);

// Update trade status (auth required)
router.patch(
  '/:id/status',
  [
    auth,
    check('status', 'Status must be one of: accepted, rejected, completed')
      .isIn(['accepted', 'rejected', 'completed']),
  ],
  tradeController.updateTradeStatus
);

// Add message to trade (auth required)
router.post(
  '/:id/messages',
  [
    auth,
    check('message', 'Message is required').not().isEmpty(),
  ],
  tradeController.addTradeMessage
);

// Cancel trade (auth required)
router.delete('/:id', auth, tradeController.cancelTrade);

export default router; 