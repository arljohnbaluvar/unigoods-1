import { Request, Response } from 'express';
import jwt, { Secret, SignOptions } from 'jsonwebtoken';
import { Types } from 'mongoose';
import { User, IUser } from '../models/User';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret_key_here';
const JWT_EXPIRE = process.env.JWT_EXPIRE || '24h';

// Generate JWT Token
const generateToken = (user: IUser) => {
  const payload = { 
    id: user._id.toString(), 
    email: user.email, 
    name: user.name,
    role: user.role 
  };

  // Handle JWT expiration
  const options: SignOptions = {};
  
  if (typeof JWT_EXPIRE === 'string') {
    if (/^\d+$/.test(JWT_EXPIRE)) {
      // If it's a string of numbers, convert to number (seconds)
      options.expiresIn = parseInt(JWT_EXPIRE);
    } else {
      // If it's a time string (e.g., '24h', '7d', '1w', '1m', '1y')
      options.expiresIn = JWT_EXPIRE as any;
    }
  }

  return jwt.sign(payload, JWT_SECRET as Secret, options);
};

// Register user
export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password, idNumber, idPhotoUrl } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ 
      $or: [
        { email },
        { idNumber }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email ? 'email' : 'ID number';
      res.status(400).json({ message: `User with this ${field} already exists` });
      return;
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      idNumber,
      idPhotoUrl,
      university: 'STI College Tagum', // Default university
    });

    await user.save();

    // Generate token
    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        idNumber: user.idNumber,
        idPhotoUrl: user.idPhotoUrl
      },
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// Login user
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      res.status(401).json({ message: 'Invalid credentials' });
      return;
    }

    // Generate token
    const token = generateToken(user);

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        idNumber: user.idNumber,
        idPhotoUrl: user.idPhotoUrl
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// Get current user
export const getCurrentUser = async (req: Request, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ message: 'Not authorized' });
      return;
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        university: user.university,
        idNumber: user.idNumber,
        idPhotoUrl: user.idPhotoUrl
      },
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
}; 