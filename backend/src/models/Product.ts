import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  title: string;
  description: string;
  condition: 'New' | 'Like New' | 'Good' | 'Fair';
  imageUrl: string;
  owner: {
    id: mongoose.Types.ObjectId;
    name: string;
    university: string;
  };
  category?: string;
  tags?: string[];
  isAvailable: boolean;
  views: number;
  favorites: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
  condition: {
    type: String,
    required: true,
    enum: ['New', 'Like New', 'Good', 'Fair'],
  },
  imageUrl: {
    type: String,
    required: true,
  },
  owner: {
    id: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    university: {
      type: String,
      required: true,
    },
  },
  category: {
    type: String,
    trim: true,
  },
  tags: [{
    type: String,
    trim: true,
  }],
  isAvailable: {
    type: Boolean,
    default: true,
  },
  views: {
    type: Number,
    default: 0,
  },
  favorites: [{
    type: Schema.Types.ObjectId,
    ref: 'User',
  }],
}, {
  timestamps: true,
});

// Create text index for search functionality
productSchema.index({ 
  title: 'text', 
  description: 'text',
  tags: 'text',
});

export default mongoose.model<IProduct>('Product', productSchema); 