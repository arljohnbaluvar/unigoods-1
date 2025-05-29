import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Button,
  Alert,
  Paper,
  Grid,
  CircularProgress,
  useTheme,
  alpha,
  Chip,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useVerification } from '../context/VerificationContext';

const UserVerification: React.FC = () => {
  const theme = useTheme();
  const { submitVerification, getUserVerificationStatus } = useVerification();

  const [studentIdFile, setStudentIdFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const verificationStatus = getUserVerificationStatus();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size must be less than 5MB');
        return;
      }
      // Check file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      setStudentIdFile(file);
      setError(null);
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!studentIdFile) {
      setError('Please upload your student ID');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      await submitVerification({
        university: 'STI College Tagum',
        studentIdFile,
      });
      setSuccess(true);
      // Reset form
      setStudentIdFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusColor = (status: 'pending' | 'approved' | 'rejected') => {
    switch (status) {
      case 'approved':
        return theme.palette.success.main;
      case 'rejected':
        return theme.palette.error.main;
      default:
        return theme.palette.warning.main;
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        Student ID Verification
      </Typography>

      {/* Status Card */}
      {verificationStatus && (
        <Card
          sx={{
            mb: 4,
            borderRadius: 2,
            border: `1px solid ${alpha(getStatusColor(verificationStatus.status), 0.2)}`,
          }}
        >
          <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <SchoolIcon
                  sx={{
                    fontSize: 40,
                    color: getStatusColor(verificationStatus.status),
                  }}
                />
              </Grid>
              <Grid item xs>
                <Typography variant="h6" gutterBottom>
                  Verification Status
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Chip
                    label={verificationStatus.status.toUpperCase()}
                    sx={{
                      bgcolor: alpha(getStatusColor(verificationStatus.status), 0.1),
                      color: getStatusColor(verificationStatus.status),
                      fontWeight: 'medium',
                    }}
                  />
                  {verificationStatus.status === 'rejected' && verificationStatus.rejectionReason && (
                    <Typography color="error" variant="body2">
                      Reason: {verificationStatus.rejectionReason}
                    </Typography>
                  )}
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}

      {/* Submission Form */}
      {!verificationStatus && (
        <Paper sx={{ p: 3, borderRadius: 2 }}>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6" gutterBottom>
                  Submit Verification Request
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Typography variant="body1" gutterBottom>
                  University: <strong>STI College Tagum</strong>
                </Typography>
              </Grid>

              <Grid item xs={12}>
                <Button
                  component="label"
                  variant="outlined"
                  startIcon={<UploadIcon />}
                  sx={{
                    width: '100%',
                    height: '100px',
                    borderStyle: 'dashed',
                    borderWidth: 2,
                  }}
                >
                  {studentIdFile ? studentIdFile.name : 'Upload Student ID'}
                  <input
                    type="file"
                    hidden
                    accept="image/*"
                    onChange={handleFileChange}
                  />
                </Button>
              </Grid>

              {error && (
                <Grid item xs={12}>
                  <Alert severity="error">{error}</Alert>
                </Grid>
              )}

              {success && (
                <Grid item xs={12}>
                  <Alert severity="success">
                    Verification request submitted successfully!
                  </Alert>
                </Grid>
              )}

              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={isSubmitting || !studentIdFile}
                  sx={{ height: '48px' }}
                >
                  {isSubmitting ? (
                    <CircularProgress size={24} />
                  ) : (
                    'Submit Verification Request'
                  )}
                </Button>
              </Grid>
            </Grid>
          </form>
        </Paper>
      )}

      {/* Guidelines */}
      <Box sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          Verification Guidelines
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Upload a clear photo of your valid STI College Tagum student ID
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Ensure your name and student number are clearly visible
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • File must be less than 5MB in size
        </Typography>
        <Typography variant="body2" color="text.secondary" paragraph>
          • Supported formats: JPG, PNG, JPEG
        </Typography>
      </Box>
    </Box>
  );
};

export default UserVerification; 