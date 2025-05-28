export interface User {
  id: string;
  name: string;
  email: string;
  university?: string;
  role: 'admin' | 'user';
  isVerified?: boolean;
  studentIdStatus?: 'pending' | 'approved' | 'rejected';
  studentIdUrl?: string;
}

export interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  university: string;
  studentIdUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

export interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  seller?: {
    id: string;
    name: string;
    university: string;
  };
} 