import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import { Trade, Product, User } from '../models';
import mongoose from 'mongoose';

interface AuthRequest extends Request {
  user?: any;
}

export const getMyTrades = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const trades = await Trade.find({
      $or: [
        { 'initiator.id': userId },
        { 'recipient.id': userId },
      ],
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Trade.countDocuments({
      $or: [
        { 'initiator.id': userId },
        { 'recipient.id': userId },
      ],
    });

    res.json({
      trades,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
      total,
    });
  } catch (error) {
    console.error('Get trades error:', error);
    res.status(500).json({ message: 'Server error while fetching trades' });
  }
};

export const getTrade = async (req: AuthRequest, res: Response) => {
  try {
    const trade = await Trade.findById(req.params.id)
      .populate('offeredItems')
      .populate('requestedItems');

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Check if user is part of the trade
    const userId = req.user.id;
    if (trade.initiator.id.toString() !== userId && trade.recipient.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to view this trade' });
    }

    res.json(trade);
  } catch (error) {
    console.error('Get trade error:', error);
    res.status(500).json({ message: 'Server error while fetching trade' });
  }
};

export const createTrade = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { offeredItems, requestedItems, recipientId, message } = req.body;

    // Verify all items exist and are available
    const offered = await Product.find({
      _id: { $in: offeredItems },
      'owner.id': req.user.id,
      isAvailable: true,
    });

    if (offered.length !== offeredItems.length) {
      return res.status(400).json({ message: 'One or more offered items are invalid or unavailable' });
    }

    const requested = await Product.find({
      _id: { $in: requestedItems },
      'owner.id': recipientId,
      isAvailable: true,
    });

    if (requested.length !== requestedItems.length) {
      return res.status(400).json({ message: 'One or more requested items are invalid or unavailable' });
    }

    // Get recipient details
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const trade = new Trade({
      initiator: {
        id: req.user.id,
        name: req.user.name,
      },
      recipient: {
        id: recipient._id,
        name: recipient.name,
      },
      offeredItems,
      requestedItems,
      messages: message ? [{
        sender: req.user.id,
        message,
      }] : [],
    });

    await trade.save();

    // Mark items as unavailable
    await Product.updateMany(
      { _id: { $in: [...offeredItems, ...requestedItems] } },
      { isAvailable: false }
    );

    res.status(201).json(trade);
  } catch (error) {
    console.error('Create trade error:', error);
    res.status(500).json({ message: 'Server error while creating trade' });
  }
};

export const updateTradeStatus = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { status } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Only recipient can accept/reject, both can complete
    const userId = req.user.id;
    if (status !== 'completed' && trade.recipient.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }

    if (status === 'completed' && 
        trade.initiator.id.toString() !== userId && 
        trade.recipient.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this trade' });
    }

    // Handle status update
    if (status === 'rejected') {
      // Make items available again
      await Product.updateMany(
        { _id: { $in: [...trade.offeredItems, ...trade.requestedItems] } },
        { isAvailable: true }
      );
    }

    trade.status = status;
    await trade.save();

    res.json(trade);
  } catch (error) {
    console.error('Update trade status error:', error);
    res.status(500).json({ message: 'Server error while updating trade status' });
  }
};

export const addTradeMessage = async (req: AuthRequest, res: Response) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Check if user is part of the trade
    const userId = req.user.id;
    if (trade.initiator.id.toString() !== userId && trade.recipient.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to message in this trade' });
    }

    trade.messages.push({
      sender: userId,
      message,
      createdAt: new Date(),
    });

    await trade.save();
    res.json(trade);
  } catch (error) {
    console.error('Add trade message error:', error);
    res.status(500).json({ message: 'Server error while adding message' });
  }
};

export const cancelTrade = async (req: AuthRequest, res: Response) => {
  try {
    const trade = await Trade.findById(req.params.id);

    if (!trade) {
      return res.status(404).json({ message: 'Trade not found' });
    }

    // Only initiator can cancel pending trades
    const userId = req.user.id;
    if (trade.initiator.id.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to cancel this trade' });
    }

    if (trade.status !== 'pending') {
      return res.status(400).json({ message: 'Can only cancel pending trades' });
    }

    // Make items available again
    await Product.updateMany(
      { _id: { $in: [...trade.offeredItems, ...trade.requestedItems] } },
      { isAvailable: true }
    );

    await trade.deleteOne();
    res.json({ message: 'Trade cancelled successfully' });
  } catch (error) {
    console.error('Cancel trade error:', error);
    res.status(500).json({ message: 'Server error while cancelling trade' });
  }
}; 