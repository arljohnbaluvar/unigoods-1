import React, { createContext, useContext, useState, useCallback } from 'react';
import { VerificationRequest, User } from '../types';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';

type VerificationStatus = 'pending' | 'approved' | 'rejected';

interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface VerificationContextType {
  verificationRequests: VerificationRequest[];
  submitVerification: (studentIdUrl: string) => Promise<void>;
  approveVerification: (requestId: string) => Promise<void>;
  rejectVerification: (requestId: string, reason: string) => Promise<void>;
  getUserVerificationStatus: () => VerificationStatus | undefined;
  // Admin specific functions
  getAdminStats: () => AdminStats;
  getPendingRequests: () => VerificationRequest[];
  getVerificationsByStatus: (status: VerificationStatus) => VerificationRequest[];
  getVerificationsByUniversity: (university: string) => VerificationRequest[];
  bulkApprove: (requestIds: string[]) => Promise<void>;
  bulkReject: (requestIds: string[], reason: string) => Promise<void>;
  searchRequests: (query: string) => VerificationRequest[];
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
};

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const { user, isAdmin } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  const submitVerification = useCallback(async (studentIdUrl: string) => {
    if (!user) {
      throw new Error('User must be logged in to submit verification');
    }

    const newRequest: VerificationRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      university: user.university || '',
      studentIdUrl,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    setVerificationRequests(prev => [...prev, newRequest]);
    enqueueSnackbar('Verification request submitted successfully', { variant: 'success' });
  }, [user, enqueueSnackbar]);

  const approveVerification = useCallback(async (requestId: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can approve verifications');
    }

    setVerificationRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: user?.name
            }
          : request
      )
    );
    enqueueSnackbar('Verification request approved', { variant: 'success' });
  }, [isAdmin, user, enqueueSnackbar]);

  const rejectVerification = useCallback(async (requestId: string, reason: string) => {
    if (!isAdmin) {
      throw new Error('Only admins can reject verifications');
    }

    setVerificationRequests(prev =>
      prev.map(request =>
        request.id === requestId
          ? {
              ...request,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: user?.name,
              rejectionReason: reason
            }
          : request
      )
    );
    enqueueSnackbar('Verification request rejected', { variant: 'error' });
  }, [isAdmin, user, enqueueSnackbar]);

  const getUserVerificationStatus = useCallback((): VerificationStatus | undefined => {
    if (!user) return undefined;
    const request = verificationRequests.find(req => req.userId === user.id);
    return request?.status;
  }, [user, verificationRequests]);

  // Admin specific functions
  const getAdminStats = useCallback((): AdminStats => {
    if (!isAdmin) throw new Error('Only admins can access stats');
    
    return {
      total: verificationRequests.length,
      pending: verificationRequests.filter(req => req.status === 'pending').length,
      approved: verificationRequests.filter(req => req.status === 'approved').length,
      rejected: verificationRequests.filter(req => req.status === 'rejected').length,
    };
  }, [isAdmin, verificationRequests]);

  const getPendingRequests = useCallback((): VerificationRequest[] => {
    if (!isAdmin) throw new Error('Only admins can access pending requests');
    return verificationRequests.filter(req => req.status === 'pending');
  }, [isAdmin, verificationRequests]);

  const getVerificationsByStatus = useCallback((status: VerificationStatus): VerificationRequest[] => {
    if (!isAdmin) throw new Error('Only admins can filter requests');
    return verificationRequests.filter(req => req.status === status);
  }, [isAdmin, verificationRequests]);

  const getVerificationsByUniversity = useCallback((university: string): VerificationRequest[] => {
    if (!isAdmin) throw new Error('Only admins can filter by university');
    return verificationRequests.filter(req => req.university.toLowerCase() === university.toLowerCase());
  }, [isAdmin, verificationRequests]);

  const bulkApprove = useCallback(async (requestIds: string[]) => {
    if (!isAdmin) throw new Error('Only admins can perform bulk actions');

    setVerificationRequests(prev =>
      prev.map(request =>
        requestIds.includes(request.id)
          ? {
              ...request,
              status: 'approved',
              reviewedAt: new Date().toISOString(),
              reviewedBy: user?.name
            }
          : request
      )
    );
    enqueueSnackbar(`${requestIds.length} requests approved successfully`, { variant: 'success' });
  }, [isAdmin, user, enqueueSnackbar]);

  const bulkReject = useCallback(async (requestIds: string[], reason: string) => {
    if (!isAdmin) throw new Error('Only admins can perform bulk actions');

    setVerificationRequests(prev =>
      prev.map(request =>
        requestIds.includes(request.id)
          ? {
              ...request,
              status: 'rejected',
              reviewedAt: new Date().toISOString(),
              reviewedBy: user?.name,
              rejectionReason: reason
            }
          : request
      )
    );
    enqueueSnackbar(`${requestIds.length} requests rejected`, { variant: 'error' });
  }, [isAdmin, user, enqueueSnackbar]);

  const searchRequests = useCallback((query: string): VerificationRequest[] => {
    if (!isAdmin) throw new Error('Only admins can search requests');
    
    const searchTerm = query.toLowerCase();
    return verificationRequests.filter(req =>
      req.userName.toLowerCase().includes(searchTerm) ||
      req.university.toLowerCase().includes(searchTerm) ||
      req.status.toLowerCase().includes(searchTerm)
    );
  }, [isAdmin, verificationRequests]);

  return (
    <VerificationContext.Provider
      value={{
        verificationRequests,
        submitVerification,
        approveVerification,
        rejectVerification,
        getUserVerificationStatus,
        getAdminStats,
        getPendingRequests,
        getVerificationsByStatus,
        getVerificationsByUniversity,
        bulkApprove,
        bulkReject,
        searchRequests
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
}; 