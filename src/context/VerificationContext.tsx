import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { useSnackbar } from 'notistack';

interface VerificationRequest {
  id: string;
  userId: string;
  userName: string;
  userEmail: string;
  university: string;
  studentIdUrl: string;
  submittedAt: string;
  status: 'pending' | 'approved' | 'rejected';
  reviewedAt?: string;
  reviewedBy?: string;
  rejectionReason?: string;
}

interface AdminStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

interface VerificationContextType {
  verificationRequests: VerificationRequest[];
  submitVerification: (data: { university: string; studentIdFile: File }) => Promise<void>;
  approveVerification: (requestId: string) => Promise<void>;
  rejectVerification: (requestId: string, reason: string) => Promise<void>;
  getUserVerificationStatus: () => VerificationRequest | undefined;
  getAdminStats: () => AdminStats;
  getPendingRequests: () => VerificationRequest[];
  getVerificationsByStatus: (status: 'pending' | 'approved' | 'rejected') => VerificationRequest[];
}

const VerificationContext = createContext<VerificationContextType | undefined>(undefined);

export const VerificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [verificationRequests, setVerificationRequests] = useState<VerificationRequest[]>([]);
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();

  // Load verification requests from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem('verificationRequests');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        console.log('Loaded verification requests from localStorage:', parsed);
        setVerificationRequests(Array.isArray(parsed) ? parsed : []);
      } catch (error) {
        console.error('Error parsing verification requests:', error);
        localStorage.removeItem('verificationRequests');
        setVerificationRequests([]);
      }
    } else {
      console.log('No verification requests found in localStorage');
      setVerificationRequests([]);
    }
  }, []);

  // Helper function to update localStorage
  const updateStorage = useCallback((requests: VerificationRequest[]) => {
    console.log('Updating verification requests in storage:', requests);
    // Ensure we're storing an array
    const requestsArray = Array.isArray(requests) ? requests : [];
    localStorage.setItem('verificationRequests', JSON.stringify(requestsArray));
    setVerificationRequests(requestsArray);
  }, []);

  const submitVerification = useCallback(async ({ university, studentIdFile }: { university: string; studentIdFile: File }) => {
    if (!user) {
      throw new Error('User must be logged in to submit verification');
    }

    console.log('=== Verification Submission Debug ===');
    console.log('1. Starting submission process');
    console.log('2. Current user:', user);
    console.log('3. File being uploaded:', studentIdFile);

    // Convert file to base64
    const reader = new FileReader();
    const studentIdUrl = await new Promise<string>((resolve, reject) => {
      reader.onload = () => {
        console.log('4. File converted to base64 successfully');
        resolve(reader.result as string);
      }
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(studentIdFile);
    });

    const newRequest: VerificationRequest = {
      id: Date.now().toString(),
      userId: user.id,
      userName: user.name,
      userEmail: user.email,
      university,
      studentIdUrl,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    console.log('5. Created new request:', newRequest);
    console.log('6. Current requests in state:', verificationRequests);
    
    // Ensure we're working with arrays
    const currentRequests = Array.isArray(verificationRequests) ? verificationRequests : [];
    const updatedRequests = [...currentRequests, newRequest];
    
    console.log('7. Updated requests to save:', updatedRequests);
    updateStorage(updatedRequests);
    console.log('8. Storage updated');
    console.log('9. Checking localStorage after update:', localStorage.getItem('verificationRequests'));
    console.log('================================');
    
    enqueueSnackbar('Verification request submitted successfully', { variant: 'success' });
  }, [user, verificationRequests, enqueueSnackbar, updateStorage]);

  const getVerificationsByStatus = useCallback((status: 'pending' | 'approved' | 'rejected') => {
    if (user?.role !== 'admin') {
      throw new Error('Only admins can filter requests');
    }
    console.log('Getting verifications by status:', status);
    console.log('Current verification requests:', verificationRequests);
    // Ensure we're working with an array
    const requestsArray = Array.isArray(verificationRequests) ? verificationRequests : [];
    const filtered = requestsArray.filter(req => req.status === status);
    console.log('Filtered requests:', filtered);
    return filtered;
  }, [user, verificationRequests]);

  const approveVerification = useCallback(async (requestId: string) => {
    if (user?.role !== 'admin') {
      throw new Error('Only admins can approve verifications');
    }

    const currentRequests = Array.isArray(verificationRequests) ? verificationRequests : [];
    const updatedRequests = currentRequests.map(request =>
      request.id === requestId
        ? {
            ...request,
            status: 'approved' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.name
          }
        : request
    );

    updateStorage(updatedRequests);
    enqueueSnackbar('Verification request approved', { variant: 'success' });
  }, [user, verificationRequests, enqueueSnackbar, updateStorage]);

  const rejectVerification = useCallback(async (requestId: string, reason: string) => {
    if (user?.role !== 'admin') {
      throw new Error('Only admins can reject verifications');
    }

    const currentRequests = Array.isArray(verificationRequests) ? verificationRequests : [];
    const updatedRequests = currentRequests.map(request =>
      request.id === requestId
        ? {
            ...request,
            status: 'rejected' as const,
            reviewedAt: new Date().toISOString(),
            reviewedBy: user.name,
            rejectionReason: reason
          }
        : request
    );

    updateStorage(updatedRequests);
    enqueueSnackbar('Verification request rejected', { variant: 'error' });
  }, [user, verificationRequests, enqueueSnackbar, updateStorage]);

  const getUserVerificationStatus = useCallback(() => {
    if (!user) return undefined;
    const requestsArray = Array.isArray(verificationRequests) ? verificationRequests : [];
    return requestsArray.find(req => req.userId === user.id);
  }, [user, verificationRequests]);

  const getAdminStats = useCallback((): AdminStats => {
    if (user?.role !== 'admin') {
      throw new Error('Only admins can access stats');
    }
    
    const requestsArray = Array.isArray(verificationRequests) ? verificationRequests : [];
    return {
      total: requestsArray.length,
      pending: requestsArray.filter(req => req.status === 'pending').length,
      approved: requestsArray.filter(req => req.status === 'approved').length,
      rejected: requestsArray.filter(req => req.status === 'rejected').length,
    };
  }, [user, verificationRequests]);

  const getPendingRequests = useCallback(() => {
    if (user?.role !== 'admin') {
      throw new Error('Only admins can access pending requests');
    }
    const requestsArray = Array.isArray(verificationRequests) ? verificationRequests : [];
    return requestsArray.filter(req => req.status === 'pending');
  }, [user, verificationRequests]);

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
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (context === undefined) {
    throw new Error('useVerification must be used within a VerificationProvider');
  }
  return context;
}; 