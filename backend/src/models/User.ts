import mongoose from 'mongoose';
import * as argon2 from 'argon2';
import { validateEmail } from '../utils/validators';

export interface IUser extends mongoose.Document {
  name: string;
  email: string;
  password: string;
  university: string;
  role: 'user' | 'admin';
  createdAt: Date;
  lastLogin: Date;
  isActive: boolean;
  failedLoginAttempts: number;
  passwordChangedAt: Date;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
    minlength: [2, 'Name must be at least 2 characters long'],
    maxlength: [50, 'Name cannot exceed 50 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    validate: {
      validator: validateEmail,
      message: 'Please provide a valid email address',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: [8, 'Password must be at least 8 characters long'],
    select: false,
    validate: {
      validator: function(password: string) {
        // Require at least one uppercase, one lowercase, one number, and one special character
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/.test(password);
      },
      message: 'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
    },
  },
  university: {
    type: String,
    required: [true, 'Please provide a university'],
    trim: true,
    minlength: [2, 'University name must be at least 2 characters long'],
    maxlength: [100, 'University name cannot exceed 100 characters'],
  },
  role: {
    type: String,
    enum: {
      values: ['user', 'admin'],
      message: '{VALUE} is not a valid role',
    },
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  lastLogin: {
    type: Date,
    default: null,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  failedLoginAttempts: {
    type: Number,
    default: 0,
  },
  passwordChangedAt: {
    type: Date,
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret) {
      delete ret.password;
      delete ret.__v;
      return ret;
    },
  },
});

// Hash password before saving using Argon2
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    // Using Argon2id variant with enhanced security parameters
    this.password = await argon2.hash(this.password, {
      type: argon2.argon2id,
      memoryCost: 65536, // 64MB
      timeCost: 3, // 3 iterations
      parallelism: 4,
      hashLength: 32
    });
    
    if (this.isModified('password') && !this.isNew) {
      this.passwordChangedAt = new Date();
    }
    
    next();
  } catch (error) {
    next(error as Error);
  }
});

// Method to compare passwords with rate limiting check
userSchema.methods.comparePassword = async function(candidatePassword: string): Promise<boolean> {
  try {
    if (this.failedLoginAttempts >= 5) {
      const lastAttemptTime = this.lastLogin || this.createdAt;
      const lockoutDuration = 15 * 60 * 1000; // 15 minutes in milliseconds
      
      if (Date.now() - lastAttemptTime.getTime() < lockoutDuration) {
        throw new Error('Account temporarily locked. Please try again later.');
      } else {
        // Reset failed attempts after lockout period
        this.failedLoginAttempts = 0;
      }
    }

    const isMatch = await argon2.verify(this.password, candidatePassword);
    
    if (!isMatch) {
      this.failedLoginAttempts += 1;
      await this.save();
    } else {
      // Reset failed attempts on successful login
      this.failedLoginAttempts = 0;
      this.lastLogin = new Date();
      await this.save();
    }
    
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Method to check if password was changed after a token was issued
userSchema.methods.changedPasswordAfter = function(JWTTimestamp: number) {
  if (this.passwordChangedAt) {
    const changedTimestamp = this.passwordChangedAt.getTime() / 1000;
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

export default mongoose.model<IUser>('User', userSchema); 