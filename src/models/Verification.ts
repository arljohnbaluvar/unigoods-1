import mongoose from 'mongoose';
import { IUser } from './User';

export interface IVerification extends mongoose.Document {
  userId: IUser['_id'];
  userName: string;
  university: string;
  studentIdUrl: string;
  submittedAt: Date;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: Date;
  reviewedBy?: string;
  rejectionReason?: string;
}

const verificationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  university: {
    type: String,
    required: true,
    default: 'STI College Tagum',
  },
  studentIdUrl: {
    type: String,
    required: true,
  },
  submittedAt: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending',
  },
  reviewedAt: {
    type: Date,
  },
  reviewedBy: {
    type: String,
  },
  rejectionReason: {
    type: String,
  },
});

export const Verification = mongoose.model<IVerification>('Verification', verificationSchema); 