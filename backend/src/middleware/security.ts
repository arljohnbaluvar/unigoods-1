import { Request, Response, NextFunction } from 'express';
import rateLimit from 'express-rate-limit';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';

// Rate limiting configuration
export const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes',
  standardHeaders: true,
  legacyHeaders: false,
});

// Specific limiter for login attempts
export const loginLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // Limit each IP to 5 login requests per hour
  message: 'Too many login attempts from this IP, please try again after an hour',
  standardHeaders: true,
  legacyHeaders: false,
});

// Helmet configuration for security headers
export const helmetConfig = helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", 'data:', 'https:'],
      connectSrc: ["'self'"],
      fontSrc: ["'self'"],
      objectSrc: ["'none'"],
      mediaSrc: ["'self'"],
      frameSrc: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: true,
  crossOriginOpenerPolicy: true,
  crossOriginResourcePolicy: { policy: "same-site" },
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: true,
  referrerPolicy: { policy: 'same-origin' },
  xssFilter: true,
});

// Enhanced sanitize user input with additional XSS protection
export const sanitizeInput = (req: Request, _res: Response, next: NextFunction) => {
  const sanitizeValue = (value: any): any => {
    if (typeof value === 'string') {
      // First pass: sanitize HTML
      let sanitized = sanitizeHtml(value, {
        allowedTags: [], // No HTML tags allowed
        allowedAttributes: {}, // No attributes allowed
        disallowedTagsMode: 'recursiveEscape'
      });
      
      // Second pass: escape special characters
      sanitized = sanitized
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#x27;')
        .replace(/\//g, '&#x2F;');
      
      return sanitized;
    }
    if (value && typeof value === 'object') {
      return Array.isArray(value)
        ? value.map(sanitizeValue)
        : Object.keys(value).reduce((acc, key) => ({
            ...acc,
            [key]: sanitizeValue(value[key])
          }), {});
    }
    return value;
  };

  if (req.body) {
    req.body = sanitizeValue(req.body);
  }
  if (req.query) {
    req.query = sanitizeValue(req.query);
  }
  if (req.params) {
    req.params = sanitizeValue(req.params);
  }
  
  next();
};

// Prevent parameter pollution
export const preventParamPollution = (req: Request, _res: Response, next: NextFunction) => {
  ['sort', 'fields', 'page', 'limit'].forEach(param => {
    if (req.query[param]) {
      if (Array.isArray(req.query[param])) {
        req.query[param] = req.query[param][0];
      }
    }
  });
  next();
};

// Enhanced security headers
export const addSecurityHeaders = (_req: Request, res: Response, next: NextFunction) => {
  // Basic security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload');
  
  // Additional security headers
  res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
  res.setHeader('Cross-Origin-Resource-Policy', 'same-site');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  res.setHeader('Cross-Origin-Embedder-Policy', 'require-corp');
  
  next();
};

// Enhanced file upload validation
export const validateFileUpload = (req: Request, res: Response, next: NextFunction) => {
  const file = req.file;
  if (!file || !file.buffer) return next();

  const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
  const maxSize = 5 * 1024 * 1024; // 5MB
  
  // Check file signature/magic numbers for JPEG, PNG, and GIF
  const isValidFileSignature = (buffer: Buffer): boolean => {
    const signatures = {
      jpeg: [0xFF, 0xD8, 0xFF],
      png: [0x89, 0x50, 0x4E, 0x47],
      gif: [0x47, 0x49, 0x46, 0x38]
    };

    const fileHeader = buffer.slice(0, 4);
    
    return (
      (file.mimetype === 'image/jpeg' && fileHeader.slice(0, 3).equals(Buffer.from(signatures.jpeg))) ||
      (file.mimetype === 'image/png' && fileHeader.equals(Buffer.from(signatures.png))) ||
      (file.mimetype === 'image/gif' && fileHeader.equals(Buffer.from(signatures.gif)))
    );
  };

  if (!allowedTypes.includes(file.mimetype) || !isValidFileSignature(file.buffer)) {
    return res.status(400).json({
      status: 'error',
      message: 'Invalid file type. Only JPEG, PNG and GIF are allowed'
    });
  }

  if (file.size > maxSize) {
    return res.status(400).json({
      status: 'error',
      message: 'File too large. Maximum size is 5MB'
    });
  }

  next();
}; 