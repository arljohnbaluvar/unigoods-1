import React, { useState } from 'react';
import {
  Box,
  Button,
  Typography,
  Paper,
  Container,
  CircularProgress,
  Alert,
} from '@mui/material';
import { CloudUpload as CloudUploadIcon } from '@mui/icons-material';

interface IDVerificationProps {
  onSubmit: (file: File) => Promise<void>;
}

const IDVerification: React.FC<IDVerificationProps> = ({ onSubmit }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    setError('');
    const file = event.target.files?.[0];
    
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        setError('Please upload an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async () => {
    if (!selectedFile) return;

    try {
      setLoading(true);
      await onSubmit(selectedFile);
      // Reset form after successful submission
      setSelectedFile(null);
      setPreview('');
    } catch (err) {
      setError('Failed to upload ID. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Paper elevation={3} sx={{ p: 3, my: 4 }}>
        <Typography variant="h5" gutterBottom>
          ID Verification
        </Typography>
        
        <Typography variant="body1" sx={{ mb: 3 }}>
          Please upload a clear photo of your university ID card. This will be reviewed by our admins for verification.
        </Typography>

        <Box
          sx={{
            border: '2px dashed #ccc',
            borderRadius: 2,
            p: 3,
            textAlign: 'center',
            mb: 3,
            cursor: 'pointer',
            '&:hover': {
              borderColor: 'primary.main',
            },
          }}
          component="label"
        >
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleFileSelect}
          />
          <CloudUploadIcon sx={{ fontSize: 48, color: 'primary.main', mb: 1 }} />
          <Typography>
            {selectedFile ? selectedFile.name : 'Click or drag to upload your ID'}
          </Typography>
        </Box>

        {preview && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Preview:
            </Typography>
            <img
              src={preview}
              alt="ID Preview"
              style={{
                maxWidth: '100%',
                maxHeight: '200px',
                objectFit: 'contain',
              }}
            />
          </Box>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Button
          variant="contained"
          color="primary"
          fullWidth
          disabled={!selectedFile || loading}
          onClick={handleSubmit}
        >
          {loading ? <CircularProgress size={24} /> : 'Submit for Verification'}
        </Button>
      </Paper>
    </Container>
  );
};

export default IDVerification; 