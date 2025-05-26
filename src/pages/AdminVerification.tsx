import React, { useState } from 'react';
import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardMedia,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';

interface VerificationRequest {
  id: string;
  userId: string;
  username: string;
  idImageUrl: string;
  submissionDate: string;
  status: 'pending' | 'approved' | 'rejected';
}

const mockRequests: VerificationRequest[] = [
  {
    id: '1',
    userId: 'user123',
    username: 'john.doe',
    idImageUrl: 'https://via.placeholder.com/300x200',
    submissionDate: '2024-03-20',
    status: 'pending',
  },
  // Add more mock data as needed
];

const AdminVerification: React.FC = () => {
  const [requests, setRequests] = useState<VerificationRequest[]>(mockRequests);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const handleApprove = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'approved' } : req
    ));
  };

  const handleReject = (requestId: string) => {
    setRequests(requests.map(req =>
      req.id === requestId ? { ...req, status: 'rejected' } : req
    ));
  };

  const handleImageClick = (imageUrl: string) => {
    setSelectedImage(imageUrl);
  };

  const handleCloseDialog = () => {
    setSelectedImage(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'success';
      case 'rejected':
        return 'error';
      default:
        return 'warning';
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          ID Verification Requests
        </Typography>

        <Paper elevation={3} sx={{ p: 3, my: 2 }}>
          <Grid container spacing={3}>
            {requests.map((request) => (
              <Grid item xs={12} sm={6} md={4} key={request.id}>
                <Card>
                  <CardMedia
                    component="img"
                    height="200"
                    image={request.idImageUrl}
                    alt="Student ID"
                    sx={{ cursor: 'pointer', objectFit: 'cover' }}
                    onClick={() => handleImageClick(request.idImageUrl)}
                  />
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {request.username}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      Submitted: {request.submissionDate}
                    </Typography>
                    <Chip
                      label={request.status.toUpperCase()}
                      color={getStatusColor(request.status)}
                      size="small"
                    />
                  </CardContent>
                  {request.status === 'pending' && (
                    <CardActions>
                      <Button
                        size="small"
                        color="success"
                        onClick={() => handleApprove(request.id)}
                      >
                        Approve
                      </Button>
                      <Button
                        size="small"
                        color="error"
                        onClick={() => handleReject(request.id)}
                      >
                        Reject
                      </Button>
                    </CardActions>
                  )}
                </Card>
              </Grid>
            ))}
          </Grid>
        </Paper>
      </Box>

      <Dialog
        open={!!selectedImage}
        onClose={handleCloseDialog}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>ID Image Preview</DialogTitle>
        <DialogContent>
          {selectedImage && (
            <img
              src={selectedImage}
              alt="ID Preview"
              style={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
              }}
            />
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Close</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminVerification; 