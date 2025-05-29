import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  useTheme,
  Tab,
  Tabs,
  Avatar,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  Visibility as ViewIcon,
  School as SchoolIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useVerification } from '../context/VerificationContext';
import { useAuth } from '../context/AuthContext';

const AdminVerification: React.FC = () => {
  const theme = useTheme();
  const { user } = useAuth();
  const {
    verificationRequests,
    approveVerification,
    rejectVerification,
    getVerificationsByStatus,
  } = useVerification();

  // Force refresh of data
  useEffect(() => {
    // Check localStorage directly
    const storedData = localStorage.getItem('verificationRequests');
    console.log('=== Admin Panel Storage Check ===');
    console.log('Raw localStorage data:', storedData);
    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        console.log('Parsed localStorage data:', parsed);
      } catch (err) {
        console.error('Error parsing localStorage data:', err);
      }
    }
    console.log('Current verificationRequests from context:', verificationRequests);
    console.log('================================');
  }, [verificationRequests]);

  // Add detailed debugging
  console.log('==== Admin Panel Debug Info ====');
  console.log('1. Current user:', user);
  console.log('2. User role:', user?.role);
  console.log('3. Raw verification requests:', verificationRequests);
  console.log('4. Is verificationRequests an array?', Array.isArray(verificationRequests));
  console.log('5. Length of requests:', verificationRequests?.length);
  console.log('================================');

  const [tabValue, setTabValue] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState<any>(null);
  const [viewImageDialog, setViewImageDialog] = useState(false);
  const [rejectDialog, setRejectDialog] = useState(false);
  const [rejectionNote, setRejectionNote] = useState('');

  useEffect(() => {
    console.log('AdminVerification mounted');
    console.log('Current user:', user);
    console.log('All verification requests:', verificationRequests);
  }, [user, verificationRequests]);

  // Get requests by status
  const pendingRequests = getVerificationsByStatus('pending');
  const approvedRequests = getVerificationsByStatus('approved');
  const rejectedRequests = getVerificationsByStatus('rejected');

  console.log('Pending requests:', pendingRequests);
  console.log('Approved requests:', approvedRequests);
  console.log('Rejected requests:', rejectedRequests);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleViewImage = (request: any) => {
    console.log('Viewing image for request:', request);
    setSelectedRequest(request);
    setViewImageDialog(true);
  };

  const handleApprove = async (request: any) => {
    try {
      console.log('Approving request:', request);
      await approveVerification(request.id);
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleReject = (request: any) => {
    console.log('Opening reject dialog for request:', request);
    setSelectedRequest(request);
    setRejectDialog(true);
  };

  const confirmReject = async () => {
    if (selectedRequest && rejectionNote.trim()) {
      try {
        console.log('Rejecting request:', selectedRequest, 'with note:', rejectionNote);
        await rejectVerification(selectedRequest.id, rejectionNote);
        setRejectDialog(false);
        setRejectionNote('');
        setSelectedRequest(null);
      } catch (error) {
        console.error('Error rejecting request:', error);
      }
    }
  };

  const renderVerificationCard = (request: any) => (
            <Card
      key={request.id}
              sx={{
        mb: 2,
                borderRadius: 2,
        boxShadow: theme.shadows[2],
        transition: 'transform 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-2px)',
        },
              }}
            >
              <CardContent>
        <Grid container spacing={2} alignItems="center">
          <Grid item>
            <Avatar
              sx={{
                bgcolor: theme.palette.primary.main,
                width: 56,
                height: 56,
              }}
            >
              <PersonIcon />
            </Avatar>
          </Grid>
          <Grid item xs>
            <Typography variant="h6">{request.userName}</Typography>
            <Typography variant="body2" color="text.secondary">
              Email: {request.userEmail}
                </Typography>
            <Box sx={{ mt: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              <SchoolIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
              <Typography variant="body2" color="text.secondary">
                {request.university}
                </Typography>
            </Box>
          </Grid>

              <Grid item>
            <Box sx={{ display: 'flex', gap: 1, flexDirection: 'column', alignItems: 'flex-end' }}>
              <Typography variant="caption" color="text.secondary">
                Submitted: {new Date(request.submittedAt).toLocaleDateString()}
                </Typography>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                <Tooltip title="View ID">
                  <IconButton
                    size="small"
                    onClick={() => handleViewImage(request)}
                    sx={{ color: theme.palette.info.main }}
                  >
                    <ViewIcon />
                  </IconButton>
                </Tooltip>
                      {request.status === 'pending' && (
                        <>
                    <Tooltip title="Approve">
                          <IconButton
                            size="small"
                        onClick={() => handleApprove(request)}
                        sx={{ color: theme.palette.success.main }}
                          >
                            <ApproveIcon />
                          </IconButton>
                    </Tooltip>
                    <Tooltip title="Reject">
                          <IconButton
                            size="small"
                        onClick={() => handleReject(request)}
                        sx={{ color: theme.palette.error.main }}
                          >
                            <RejectIcon />
                          </IconButton>
                    </Tooltip>
                        </>
                      )}
                    </Box>
            </Box>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  );

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Student ID Verification
        </Typography>

        <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            sx={{
              '& .MuiTab-root': {
                minWidth: 120,
                fontWeight: 600,
              },
            }}
          >
            <Tab
              label={`Pending (${pendingRequests.length})`}
              sx={{ color: theme.palette.warning.main }}
            />
            <Tab
              label={`Approved (${approvedRequests.length})`}
              sx={{ color: theme.palette.success.main }}
            />
            <Tab
              label={`Rejected (${rejectedRequests.length})`}
              sx={{ color: theme.palette.error.main }}
            />
          </Tabs>
          </Box>

        <Box sx={{ mt: 2 }}>
          {tabValue === 0 && pendingRequests.map(renderVerificationCard)}
          {tabValue === 1 && approvedRequests.map(renderVerificationCard)}
          {tabValue === 2 && rejectedRequests.map(renderVerificationCard)}
      </Box>

        {/* View ID Image Dialog */}
        <Dialog
          open={viewImageDialog}
          onClose={() => setViewImageDialog(false)}
          maxWidth="md"
          fullWidth
        >
          <DialogTitle>Student ID - {selectedRequest?.userName}</DialogTitle>
          <DialogContent>
            <Box
              component="img"
              src={selectedRequest?.studentIdUrl}
              alt="Student ID"
              sx={{
                width: '100%',
                height: 'auto',
                maxHeight: '70vh',
                objectFit: 'contain',
                borderRadius: 1,
                mt: 2
              }}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setViewImageDialog(false)}>Close</Button>
          </DialogActions>
        </Dialog>

      {/* Reject Dialog */}
      <Dialog
          open={rejectDialog}
          onClose={() => setRejectDialog(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Reject Verification Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
              value={rejectionNote}
              onChange={(e) => setRejectionNote(e.target.value)}
              sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
            <Button onClick={() => setRejectDialog(false)}>Cancel</Button>
          <Button
              onClick={confirmReject}
            color="error"
            variant="contained"
              disabled={!rejectionNote.trim()}
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
      </Box>
    </Container>
  );
};

export default AdminVerification; 