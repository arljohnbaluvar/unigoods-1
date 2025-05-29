import { Request, Response } from 'express';
import { Verification } from '../models/Verification';

// Submit verification request
export const submitVerification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { studentIdUrl } = req.body;
    const userId = req.user.id;

    // Check if there's a pending or approved verification
    const existingVerification = await Verification.findOne({
      userId,
      status: { $in: ['pending', 'approved'] },
    });

    if (existingVerification) {
      return res.status(400).json({
        message: existingVerification.status === 'pending'
          ? 'You already have a pending verification request'
          : 'You are already verified',
      });
    }

    // Create new verification request
    const verification = new Verification({
      userId,
      userName: req.user.name,
      university: 'STI College Tagum',
      studentIdUrl,
    });

    await verification.save();

    res.status(201).json({
      message: 'Verification request submitted successfully',
      verification,
    });
  } catch (error) {
    console.error('Verification submission error:', error);
    res.status(500).json({ message: 'Server error during verification submission' });
  }
};

// Get user's verification status
export const getVerificationStatus = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const userId = req.user.id;
    const verification = await Verification.findOne({ userId }).sort({ submittedAt: -1 });

    if (!verification) {
      return res.status(404).json({ message: 'No verification request found' });
    }

    res.json({ verification });
  } catch (error) {
    console.error('Get verification status error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Review verification request
export const reviewVerification = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const { verificationId } = req.params;
    const { status, rejectionReason } = req.body;
    const adminId = req.user.id;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    if (status === 'rejected' && !rejectionReason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const verification = await Verification.findById(verificationId);
    if (!verification) {
      return res.status(404).json({ message: 'Verification request not found' });
    }

    if (verification.status !== 'pending') {
      return res.status(400).json({ message: 'This verification request has already been reviewed' });
    }

    verification.status = status;
    verification.reviewedAt = new Date();
    verification.reviewedBy = adminId;
    if (status === 'rejected') {
      verification.rejectionReason = rejectionReason;
    }

    await verification.save();

    res.json({
      message: `Verification request ${status}`,
      verification,
    });
  } catch (error) {
    console.error('Review verification error:', error);
    res.status(500).json({ message: 'Server error during verification review' });
  }
};

// Admin: Get all verification requests
export const getAllVerifications = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    const query = status ? { status } : {};

    const verifications = await Verification.find(query)
      .sort({ submittedAt: -1 });

    res.json({ verifications });
  } catch (error) {
    console.error('Get all verifications error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 