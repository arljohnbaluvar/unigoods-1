import React, { useState, useCallback } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from '@mui/material';
import { CloudUpload as UploadIcon } from '@mui/icons-material';
import { useVerification } from '../context/VerificationContext';
import { useSnackbar } from 'notistack';

const StudentIdSubmission: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { submitVerification, getUserVerificationStatus } = useVerification();
  const { enqueueSnackbar } = useSnackbar();
  const theme = useTheme();
  const verificationStatus = getUserVerificationStatus();

  const handleFileUpload = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!file.type.startsWith('image/')) {
      enqueueSnackbar('Please upload an image file', { variant: 'error' });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      enqueueSnackbar('File size should be less than 5MB', { variant: 'error' });
      return;
    }

    try {
      setUploading(true);

      // Create a preview URL
      const preview = URL.createObjectURL(file);
      setPreviewUrl(preview);

      // In a real application, you would upload the file to a server here
      // For now, we'll just simulate it with the preview URL
      await submitVerification(preview);

      enqueueSnackbar('Student ID submitted successfully', { variant: 'success' });
    } catch (error) {
      console.error('Error uploading file:', error);
      enqueueSnackbar('Failed to upload student ID', { variant: 'error' });
    } finally {
      setUploading(false);
    }
  }, [submitVerification, enqueueSnackbar]);

  const getStatusMessage = () => {
    switch (verificationStatus) {
      case 'approved':
        return {
          severity: 'success' as const,
          message: 'Your student ID has been verified!',
        };
      case 'rejected':
        return {
          severity: 'error' as const,
          message: 'Your student ID verification was rejected. Please submit a new one.',
        };
      case 'pending':
        return {
          severity: 'info' as const,
          message: 'Your student ID is pending verification.',
        };
      default:
        return null;
    }
  };

  const statusMessage = getStatusMessage();
  const isDisabled = uploading || (verificationStatus !== undefined && verificationStatus === 'pending');

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
        borderRadius: 2,
      }}
    >
      <Typography variant="h6" gutterBottom>
        Student ID Verification
      </Typography>
      <Typography variant="body2" color="text.secondary" paragraph>
        Please upload a clear photo of your student ID to verify your university affiliation.
      </Typography>

      {statusMessage && (
        <Alert
          severity={statusMessage.severity}
          sx={{ mb: 3, borderRadius: 2 }}
        >
          {statusMessage.message}
        </Alert>
      )}

      {(!verificationStatus || verificationStatus === 'rejected') && (
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 2,
          }}
        >
          <input
            accept="image/*"
            style={{ display: 'none' }}
            id="student-id-upload"
            type="file"
            onChange={handleFileUpload}
            disabled={isDisabled}
          />
          <label htmlFor="student-id-upload">
            <Button
              component="span"
              variant="outlined"
              startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
              disabled={isDisabled}
              sx={{
                borderRadius: 2,
                py: 1,
                px: 3,
              }}
            >
              {uploading ? 'Uploading...' : 'Upload Student ID'}
            </Button>
          </label>

          {previewUrl && (
            <Box
              sx={{
                mt: 2,
                width: '100%',
                maxWidth: 400,
                borderRadius: 2,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <img
                src={previewUrl}
                alt="Student ID Preview"
                style={{
                  width: '100%',
                  height: 'auto',
                  display: 'block',
                }}
              />
            </Box>
          )}
        </Box>
      )}
    </Paper>
  );
};

export default StudentIdSubmission; 