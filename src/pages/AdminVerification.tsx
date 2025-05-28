import React, { useState, useMemo } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Chip,
  Avatar,
  Link,
  Divider,
  useTheme,
  alpha,
  Tab,
  Tabs,
  IconButton,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Checkbox,
  TableContainer,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  Paper as MuiPaper,
} from '@mui/material';
import {
  CheckCircle as ApproveIcon,
  Cancel as RejectIcon,
  School as SchoolIcon,
  Person as PersonIcon,
  AccessTime as TimeIcon,
  Search as SearchIcon,
  FilterList as FilterIcon,
  CheckBox as SelectAllIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useVerification } from '../context/VerificationContext';
import { format } from 'date-fns';
import { VerificationRequest } from '../types';

type TabValue = 'all' | 'pending' | 'approved' | 'rejected';

const AdminVerification: React.FC = () => {
  const {
    verificationRequests,
    approveVerification,
    rejectVerification,
    getAdminStats,
    getPendingRequests,
    getVerificationsByStatus,
    getVerificationsByUniversity,
    bulkApprove,
    bulkReject,
    searchRequests,
  } = useVerification();

  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [openRejectDialog, setOpenRejectDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState<TabValue>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [universityFilter, setUniversityFilter] = useState<string>('');
  const [selectedRequests, setSelectedRequests] = useState<string[]>([]);
  const theme = useTheme();

  const stats = useMemo(() => getAdminStats(), [getAdminStats]);

  const universities = useMemo(() => {
    const uniqueUniversities = new Set(verificationRequests.map(req => req.university));
    return Array.from(uniqueUniversities);
  }, [verificationRequests]);

  const filteredRequests = useMemo(() => {
    let requests: VerificationRequest[] = [];

    // First, filter by tab
    if (currentTab === 'all') {
      requests = verificationRequests;
    } else {
      requests = getVerificationsByStatus(currentTab);
    }

    // Then, filter by university if selected
    if (universityFilter) {
      requests = requests.filter(req => req.university === universityFilter);
    }

    // Finally, apply search query
    if (searchQuery) {
      requests = searchRequests(searchQuery);
    }

    return requests;
  }, [currentTab, universityFilter, searchQuery, verificationRequests, getVerificationsByStatus, searchRequests]);

  const handleApprove = async (requestId: string) => {
    try {
      await approveVerification(requestId);
    } catch (error) {
      console.error('Error approving verification:', error);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    try {
      await rejectVerification(selectedRequest, rejectionReason);
      setOpenRejectDialog(false);
      setRejectionReason('');
      setSelectedRequest(null);
    } catch (error) {
      console.error('Error rejecting verification:', error);
    }
  };

  const handleBulkApprove = async () => {
    try {
      await bulkApprove(selectedRequests);
      setSelectedRequests([]);
    } catch (error) {
      console.error('Error bulk approving verifications:', error);
    }
  };

  const handleBulkReject = async () => {
    try {
      await bulkReject(selectedRequests, rejectionReason);
      setOpenRejectDialog(false);
      setRejectionReason('');
      setSelectedRequests([]);
    } catch (error) {
      console.error('Error bulk rejecting verifications:', error);
    }
  };

  const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.checked) {
      setSelectedRequests(filteredRequests.map(req => req.id));
    } else {
      setSelectedRequests([]);
    }
  };

  const handleSelectRequest = (requestId: string) => {
    setSelectedRequests(prev =>
      prev.includes(requestId)
        ? prev.filter(id => id !== requestId)
        : [...prev, requestId]
    );
  };

  const getStatusColor = (status: string) => {
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
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {/* Header and Stats */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom fontWeight="bold">
              Student ID Verification Requests
            </Typography>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h4" color="text.primary">
                  {stats.total}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.warning.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="warning.main">Pending</Typography>
                <Typography variant="h4" color="warning.main">
                  {stats.pending}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.success.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="success.main">Approved</Typography>
                <Typography variant="h4" color="success.main">
                  {stats.approved}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.error.main, 0.1)}`,
              }}
            >
              <CardContent>
                <Typography variant="h6" color="error.main">Rejected</Typography>
                <Typography variant="h4" color="error.main">
                  {stats.rejected}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Filters and Search */}
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="Search by name or university..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={12} md={4}>
              <FormControl fullWidth>
                <InputLabel>Filter by University</InputLabel>
                <Select
                  value={universityFilter}
                  onChange={(e) => setUniversityFilter(e.target.value)}
                  label="Filter by University"
                >
                  <MenuItem value="">All Universities</MenuItem>
                  {universities.map((uni) => (
                    <MenuItem key={uni} value={uni}>
                      {uni}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4}>
              <Tabs
                value={currentTab}
                onChange={(_, value) => setCurrentTab(value)}
                variant="scrollable"
                scrollButtons="auto"
              >
                <Tab label="All" value="all" />
                <Tab label="Pending" value="pending" />
                <Tab label="Approved" value="approved" />
                <Tab label="Rejected" value="rejected" />
              </Tabs>
            </Grid>
          </Grid>
        </Box>

        {/* Bulk Actions */}
        {selectedRequests.length > 0 && (
          <Box sx={{ mb: 2, p: 2, bgcolor: alpha(theme.palette.primary.main, 0.05), borderRadius: 2 }}>
            <Grid container spacing={2} alignItems="center">
              <Grid item>
                <Typography variant="body1">
                  {selectedRequests.length} requests selected
                </Typography>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="success"
                  startIcon={<ApproveIcon />}
                  onClick={handleBulkApprove}
                >
                  Approve Selected
                </Button>
              </Grid>
              <Grid item>
                <Button
                  variant="contained"
                  color="error"
                  startIcon={<RejectIcon />}
                  onClick={() => setOpenRejectDialog(true)}
                >
                  Reject Selected
                </Button>
              </Grid>
            </Grid>
          </Box>
        )}

        {/* Requests Table */}
        <TableContainer component={MuiPaper} elevation={0}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={selectedRequests.length > 0 && selectedRequests.length < filteredRequests.length}
                    checked={selectedRequests.length === filteredRequests.length}
                    onChange={handleSelectAll}
                  />
                </TableCell>
                <TableCell>Student</TableCell>
                <TableCell>University</TableCell>
                <TableCell>Submitted</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRequests.map((request) => (
                <TableRow key={request.id}>
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedRequests.includes(request.id)}
                      onChange={() => handleSelectRequest(request.id)}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Avatar sx={{ bgcolor: alpha(theme.palette.primary.main, 0.1) }}>
                        {request.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Typography>{request.userName}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{request.university}</TableCell>
                  <TableCell>{format(new Date(request.submittedAt), 'PPp')}</TableCell>
                  <TableCell>
                    <Chip
                      label={request.status.toUpperCase()}
                      sx={{
                        bgcolor: alpha(getStatusColor(request.status), 0.1),
                        color: getStatusColor(request.status),
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Link
                        href={request.studentIdUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button size="small" variant="outlined">
                          View ID
                        </Button>
                      </Link>
                      {request.status === 'pending' && (
                        <>
                          <IconButton
                            color="success"
                            onClick={() => handleApprove(request.id)}
                            size="small"
                          >
                            <ApproveIcon />
                          </IconButton>
                          <IconButton
                            color="error"
                            onClick={() => {
                              setSelectedRequest(request.id);
                              setOpenRejectDialog(true);
                            }}
                            size="small"
                          >
                            <RejectIcon />
                          </IconButton>
                        </>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        {filteredRequests.length === 0 && (
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: alpha(theme.palette.primary.main, 0.02),
              borderRadius: 2,
            }}
          >
            <Typography variant="h6" color="text.secondary">
              No verification requests found
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {searchQuery
                ? 'Try adjusting your search or filters'
                : 'New requests will appear here when students submit their IDs'}
            </Typography>
          </Box>
        )}
      </Box>

      {/* Reject Dialog */}
      <Dialog
        open={openRejectDialog}
        onClose={() => {
          setOpenRejectDialog(false);
          setRejectionReason('');
        }}
      >
        <DialogTitle>
          {selectedRequests.length > 0
            ? `Reject ${selectedRequests.length} Requests`
            : 'Reject Verification Request'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Reason for rejection"
            fullWidth
            multiline
            rows={4}
            value={rejectionReason}
            onChange={(e) => setRejectionReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRejectDialog(false)}>Cancel</Button>
          <Button
            onClick={() => {
              if (selectedRequests.length > 0) {
                handleBulkReject();
              } else {
                handleReject();
              }
            }}
            color="error"
            variant="contained"
          >
            Reject
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default AdminVerification; 