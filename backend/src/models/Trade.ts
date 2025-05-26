import mongoose, { Document, Schema } from 'mongoose';

interface ITradeMessage {
  sender: mongoose.Types.ObjectId;
  message: string;
  createdAt: Date;
}

export interface ITrade extends Document {
  initiator: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  recipient: {
    id: mongoose.Types.ObjectId;
    name: string;
  };
  offeredItems: mongoose.Types.ObjectId[];
  requestedItems: mongoose.Types.ObjectId[];
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  messages: ITradeMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const tradeMessageSchema = new Schema<ITradeMessage>({
  sender: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  message: {
    type: String,
    required: true,
    trim: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const tradeSchema = new Schema<ITrade>({
  initiator: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  recipient: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
  },
  offeredItems: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  requestedItems: [{
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  }],
  status: {
    type: String,
    enum: ['pending', 'accepted', 'rejected', 'completed'],
    default: 'pending',
  },
  messages: [tradeMessageSchema],
}, {
  timestamps: true,
});

// Create compound index for efficient querying
tradeSchema.index({ 
  'initiator.id': 1, 
  'recipient.id': 1,
  status: 1,
});

export default mongoose.model<ITrade>('Trade', tradeSchema); 