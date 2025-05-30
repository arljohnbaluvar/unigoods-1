import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Chip,
  Divider,
  Tab,
  Tabs,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  Avatar,
  IconButton,
  Tooltip,
  CircularProgress,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import {
  SwapHoriz as TradeIcon,
  Message as MessageIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  Person as PersonIcon,
  School as SchoolIcon,
  Send as SendIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import { useTradeContext } from '../context/TradeContext';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { format } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Mock current user ID (replace with actual auth)
const CURRENT_USER_ID = 'user1';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

const TabPanel: React.FC<TabPanelProps> = ({ children, value, index }) => {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`trade-tabpanel-${index}`}
      aria-labelledby={`trade-tab-${index}`}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
};

const TradeProposals: React.FC = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { proposals, updateProposalStatus, getUserProposals, loading, error, addMessage, userItems } = useTradeContext();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [tabValue, setTabValue] = useState(0);
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedProposal, setSelectedProposal] = useState<any>(null);
  const [replyMessage, setReplyMessage] = useState('');
  
  // Modify state for trade dialog
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [tradeMode, setTradeMode] = useState<'existing' | 'new'>('existing');
  const [selectedItem, setSelectedItem] = useState('');
  const [offeredItemDetails, setOfferedItemDetails] = useState({
    title: '',
    description: '',
    condition: '',
    category: '',
    price: '',
    imageUrl: '',
  });
  const [desiredItemTitle, setDesiredItemTitle] = useState('');
  const [desiredItemDescription, setDesiredItemDescription] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');

  const conditions = ['New', 'Like New', 'Good', 'Fair'];
  const categories = ['Electronics', 'Books', 'Clothing', 'Accessories', 'Other'];

  if (!user) return null;

  const userProposals = getUserProposals(user.id);
  const receivedProposals = userProposals.filter(
    (p) => p.receiverId === user.id && p.status === 'pending'
  );
  const sentProposals = userProposals.filter(
    (p) => p.proposerId === user.id
  );
  const completedProposals = userProposals.filter(
    (p) => p.status === 'completed'
  );

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleAcceptProposal = (proposalId: string) => {
    updateProposalStatus(proposalId, 'accepted');
  };

  const handleRejectProposal = (proposalId: string) => {
    updateProposalStatus(proposalId, 'rejected');
  };

  const handleCompleteProposal = (proposalId: string) => {
    updateProposalStatus(proposalId, 'completed');
  };

  const handleOpenMessage = (proposal: any) => {
    setSelectedProposal(proposal);
    setMessageDialogOpen(true);
  };

  const handleSendReply = () => {
    if (!replyMessage.trim() || !selectedProposal || !user) return;

    addMessage(selectedProposal.id, replyMessage, user.id, user.name);
    setReplyMessage('');
  };

  const handleTradeDialogOpen = () => {
    setTradeDialogOpen(true);
  };

  const handleTradeDialogClose = () => {
    setTradeDialogOpen(false);
    setTradeMode('existing');
    setSelectedItem('');
    setOfferedItemDetails({
      title: '',
      description: '',
      condition: '',
      category: '',
      price: '',
      imageUrl: '',
    });
    setDesiredItemTitle('');
    setDesiredItemDescription('');
    setTradeMessage('');
  };

  const handleOfferedItemChange = (field: string) => (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setOfferedItemDetails(prev => ({
      ...prev,
      [field]: event.target.value
    }));
  };

  const handleTradeSubmit = () => {
    if (tradeMode === 'existing' && !selectedItem) {
      enqueueSnackbar('Please select an item to trade', { variant: 'error' });
      return;
    }

    if (tradeMode === 'new') {
      const { title, description, condition, category, imageUrl } = offeredItemDetails;
      const price = parseFloat(offeredItemDetails.price);
      
      if (!title || !description || !condition || !category || !imageUrl || isNaN(price) || price <= 0) {
        enqueueSnackbar('Please fill in all item details', { variant: 'error' });
        return;
      }
    }

    if (!desiredItemTitle || !desiredItemDescription || !tradeMessage) {
      enqueueSnackbar('Please fill in all fields', { variant: 'error' });
      return;
    }

    // Here you would typically submit the trade proposal
    enqueueSnackbar('Trade proposal submitted successfully!', { variant: 'success' });
    handleTradeDialogClose();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" gutterBottom>
          Trade Proposals
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleTradeDialogOpen}
        >
          Trade Product
        </Button>
      </Box>

      <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            borderBottom: 1,
            borderColor: 'divider',
            '& .MuiTab-root': {
              py: 2,
            },
          }}
        >
          <Tab label={`Received (${receivedProposals.length})`} />
          <Tab label={`Sent (${sentProposals.length})`} />
          <Tab label={`Completed (${completedProposals.length})`} />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          {receivedProposals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No trade proposals received
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {receivedProposals.map((proposal) => (
                <Grid item key={proposal.id} xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              They Want
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.requestedItem.imageUrl}
                                alt={proposal.requestedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.requestedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.requestedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.requestedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              They Offer
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.proposedItem.imageUrl}
                                alt={proposal.proposedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.proposedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.proposedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.proposedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {proposal.proposerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Sent {format(new Date(proposal.createdAt), 'PPp')}
                              </Typography>
                            </Box>
                          </Box>

                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {proposal.message}
                          </Typography>

                          {proposal.messages.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Messages
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                {proposal.messages.map((msg: any) => {
                                  return (
                                    <Box key={msg.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle2">
                                          {msg.senderName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {format(new Date(msg.createdAt), 'PPp')}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2">
                                        {msg.message}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Paper>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', gap: 2 }}>
                            <Button
                              variant="contained"
                              color="success"
                              startIcon={<CheckIcon />}
                              onClick={() => handleAcceptProposal(proposal.id)}
                            >
                              Accept
                            </Button>
                            <Button
                              variant="contained"
                              color="error"
                              startIcon={<CloseIcon />}
                              onClick={() => handleRejectProposal(proposal.id)}
                            >
                              Reject
                            </Button>
                            <Button
                              variant="outlined"
                              startIcon={<MessageIcon />}
                              onClick={() => handleOpenMessage(proposal)}
                            >
                              Reply
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          {sentProposals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No trade proposals sent
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {sentProposals.map((proposal) => (
                <Grid item key={proposal.id} xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              You Want
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.requestedItem.imageUrl}
                                alt={proposal.requestedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.requestedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.requestedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.requestedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              You Offered
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.proposedItem.imageUrl}
                                alt={proposal.proposedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.proposedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.proposedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.proposedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                To: {proposal.receiverName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Sent {format(new Date(proposal.createdAt), 'PPp')}
                              </Typography>
                            </Box>
                            <Chip
                              label={proposal.status}
                              color={
                                proposal.status === 'pending' ? 'warning' :
                                proposal.status === 'accepted' ? 'success' :
                                proposal.status === 'rejected' ? 'error' :
                                'default'
                              }
                              size="small"
                              sx={{ ml: 'auto' }}
                            />
                          </Box>

                          <Typography variant="body1" sx={{ mb: 2 }}>
                            {proposal.message}
                          </Typography>

                          {proposal.messages.length > 0 && (
                            <Box sx={{ mb: 2 }}>
                              <Typography variant="subtitle2" gutterBottom>
                                Messages
                              </Typography>
                              <Paper variant="outlined" sx={{ p: 2, borderRadius: 2 }}>
                                {proposal.messages.map((msg: any) => {
                                  return (
                                    <Box key={msg.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                                        <Typography variant="subtitle2">
                                          {msg.senderName}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                          {format(new Date(msg.createdAt), 'PPp')}
                                        </Typography>
                                      </Box>
                                      <Typography variant="body2">
                                        {msg.message}
                                      </Typography>
                                    </Box>
                                  );
                                })}
                              </Paper>
                            </Box>
                          )}

                          <Box sx={{ display: 'flex', gap: 2 }}>
                            {proposal.status === 'accepted' && (
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => handleCompleteProposal(proposal.id)}
                              >
                                Mark as Completed
                              </Button>
                            )}
                            <Button
                              variant="outlined"
                              startIcon={<MessageIcon />}
                              onClick={() => handleOpenMessage(proposal)}
                            >
                              Send Message
                            </Button>
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          {completedProposals.length === 0 ? (
            <Box sx={{ textAlign: 'center', py: 4 }}>
              <Typography color="text.secondary">
                No completed trades
              </Typography>
            </Box>
          ) : (
            <Grid container spacing={3}>
              {completedProposals.map((proposal) => (
                <Grid item key={proposal.id} xs={12}>
                  <Card sx={{ borderRadius: 3 }}>
                    <CardContent>
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {proposal.proposerId === user.id ? 'You Wanted' : 'They Wanted'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.requestedItem.imageUrl}
                                alt={proposal.requestedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.requestedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.requestedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.requestedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12} sm={6}>
                          <Box>
                            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                              {proposal.proposerId === user.id ? 'You Offered' : 'They Offered'}
                            </Typography>
                            <Box sx={{ display: 'flex', gap: 2 }}>
                              <CardMedia
                                component="img"
                                image={proposal.proposedItem.imageUrl}
                                alt={proposal.proposedItem.title}
                                sx={{ width: 100, height: 100, borderRadius: 2, objectFit: 'cover' }}
                              />
                              <Box>
                                <Typography variant="subtitle1">
                                  {proposal.proposedItem.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Condition: {proposal.proposedItem.condition}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                  Category: {proposal.proposedItem.category}
                                </Typography>
                              </Box>
                            </Box>
                          </Box>
                        </Grid>

                        <Grid item xs={12}>
                          <Divider sx={{ my: 2 }} />
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1">
                                {proposal.proposerId === user.id ? proposal.receiverName : proposal.proposerName}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                Completed {format(new Date(proposal.createdAt), 'PPp')}
                              </Typography>
                            </Box>
                            <Chip
                              label="Completed"
                              color="success"
                              size="small"
                              sx={{ ml: 'auto' }}
                            />
                          </Box>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </TabPanel>
      </Paper>

      {/* New Trade Dialog */}
      <Dialog
        open={tradeDialogOpen}
        onClose={handleTradeDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            background: theme.palette.background.paper,
          },
        }}
      >
        <DialogTitle>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }}
          >
            Create New Trade Proposal
          </Typography>
        </DialogTitle>

        <DialogContent>
          <Box sx={{ mt: 2 }}>
            <Typography variant="subtitle1" gutterBottom>
              What would you like to trade?
            </Typography>

            <Box sx={{ mb: 3 }}>
              <FormControl component="fieldset">
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant={tradeMode === 'existing' ? 'contained' : 'outlined'}
                    onClick={() => setTradeMode('existing')}
                  >
                    Choose Existing Item
                  </Button>
                  <Button
                    variant={tradeMode === 'new' ? 'contained' : 'outlined'}
                    onClick={() => setTradeMode('new')}
                  >
                    Add New Item
                  </Button>
                </Box>
              </FormControl>
            </Box>

            {tradeMode === 'existing' ? (
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Your Item to Trade</InputLabel>
                <Select
                  value={selectedItem}
                  label="Select Your Item to Trade"
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  {userItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title} ({item.condition})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            ) : (
              <Box sx={{ mb: 3 }}>
                <TextField
                  label="Item Title"
                  value={offeredItemDetails.title}
                  onChange={handleOfferedItemChange('title')}
                  fullWidth
                  margin="normal"
                  placeholder="e.g., MacBook Pro 2021"
                />
                <TextField
                  label="Item Description"
                  value={offeredItemDetails.description}
                  onChange={handleOfferedItemChange('description')}
                  fullWidth
                  multiline
                  rows={3}
                  margin="normal"
                  placeholder="Describe your item (specifications, features, etc.)"
                />
                <FormControl fullWidth margin="normal">
                  <InputLabel>Condition</InputLabel>
                  <Select
                    value={offeredItemDetails.condition}
                    label="Condition"
                    onChange={(e) => handleOfferedItemChange('condition')({ target: { value: e.target.value } } as any)}
                  >
                    {conditions.map((condition) => (
                      <MenuItem key={condition} value={condition}>
                        {condition}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <FormControl fullWidth margin="normal">
                  <InputLabel>Category</InputLabel>
                  <Select
                    value={offeredItemDetails.category}
                    label="Category"
                    onChange={(e) => handleOfferedItemChange('category')({ target: { value: e.target.value } } as any)}
                  >
                    {categories.map((category) => (
                      <MenuItem key={category} value={category}>
                        {category}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  label="Price"
                  value={offeredItemDetails.price}
                  onChange={handleOfferedItemChange('price')}
                  fullWidth
                  margin="normal"
                  type="number"
                  InputProps={{
                    startAdornment: <Typography>₱</Typography>,
                  }}
                />
                <TextField
                  label="Image URL"
                  value={offeredItemDetails.imageUrl}
                  onChange={handleOfferedItemChange('imageUrl')}
                  fullWidth
                  margin="normal"
                  placeholder="Enter the URL of your item's image"
                />
              </Box>
            )}

            <Typography variant="subtitle1" gutterBottom sx={{ mt: 3 }}>
              What are you looking for?
            </Typography>

            <TextField
              label="Desired Item Title"
              value={desiredItemTitle}
              onChange={(e) => setDesiredItemTitle(e.target.value)}
              fullWidth
              margin="normal"
              placeholder="e.g., MacBook Pro, TI-84 Calculator"
            />

            <TextField
              label="Desired Item Description"
              value={desiredItemDescription}
              onChange={(e) => setDesiredItemDescription(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              placeholder="Describe the item you're looking for (condition, specifications, etc.)"
            />

            <TextField
              label="Additional Message"
              value={tradeMessage}
              onChange={(e) => setTradeMessage(e.target.value)}
              fullWidth
              multiline
              rows={3}
              margin="normal"
              placeholder="Add any additional details or requirements for the trade"
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button onClick={handleTradeDialogClose}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTradeSubmit}
            disabled={
              (tradeMode === 'existing' && !selectedItem) ||
              (tradeMode === 'new' && (!offeredItemDetails.title || !offeredItemDetails.description || !offeredItemDetails.condition || !offeredItemDetails.category || !offeredItemDetails.imageUrl || !offeredItemDetails.price)) ||
              !desiredItemTitle ||
              !desiredItemDescription ||
              !tradeMessage
            }
            startIcon={<TradeIcon />}
          >
            Submit Trade Proposal
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={messageDialogOpen}
        onClose={() => {
          setMessageDialogOpen(false);
          setSelectedProposal(null);
          setReplyMessage('');
        }}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Send Message
        </DialogTitle>
        <DialogContent>
          {selectedProposal && (
            <>
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Trade Details
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedProposal.proposedItem.title} ↔️ {selectedProposal.requestedItem.title}
                </Typography>
              </Box>

              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle2" gutterBottom>
                  Message History
                </Typography>
                <Paper variant="outlined" sx={{ p: 2, mb: 2, maxHeight: 200, overflow: 'auto' }}>
                  {selectedProposal.messages.map((msg: any) => (
                    <Box key={msg.id} sx={{ mb: 2, '&:last-child': { mb: 0 } }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                        <Typography variant="subtitle2">
                          {msg.senderName}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {format(new Date(msg.createdAt), 'PPp')}
                        </Typography>
                      </Box>
                      <Typography variant="body2">
                        {msg.message}
                      </Typography>
                    </Box>
                  ))}
                </Paper>
              </Box>

              <TextField
                label="Your Message"
                multiline
                rows={4}
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                fullWidth
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => {
              setMessageDialogOpen(false);
              setSelectedProposal(null);
              setReplyMessage('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSendReply}
            disabled={!replyMessage.trim()}
            endIcon={<SendIcon />}
          >
            Send
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default TradeProposals; 