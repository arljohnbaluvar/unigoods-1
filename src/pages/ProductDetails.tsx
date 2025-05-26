import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Divider,
  TextField,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Snackbar,
  Alert,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  SwapHoriz as TradeIcon,
  Message as MessageIcon,
  Person as PersonIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useTradeContext } from '../context/TradeContext';
import { useMessage } from '../context/MessageContext';

// Mock product data (replace with API call later)
const mockProduct = {
  id: '1',
  title: 'Calculus Textbook - 10th Edition',
  description: 'Like new condition, barely used. All pages intact. Perfect for first-year calculus students. Includes online access code (unused). Minor highlighting in first two chapters.',
  price: 45.99,
  condition: 'Like New',
  category: 'Textbooks',
  imageUrl: 'https://via.placeholder.com/500x600',
  seller: {
    id: 'seller1',
    name: 'John Doe',
    university: 'State University',
    rating: 4.5,
    joinedDate: '2023-09',
    avatarUrl: 'https://via.placeholder.com/40',
  },
  details: {
    isbn: '978-0123456789',
    author: 'James Stewart',
    edition: '10th',
    publisher: 'Cengage Learning',
    year: '2023',
  },
};

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [tradeMessage, setTradeMessage] = useState('');
  const [addedToCart, setAddedToCart] = useState(false);
  const [selectedTradeItem, setSelectedTradeItem] = useState<string>('');
  const { addItem } = useCart();
  const { userItems, addProposal } = useTradeContext();
  const { sendMessage } = useMessage();
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [messageContent, setMessageContent] = useState('');
  const [messageError, setMessageError] = useState<string | null>(null);
  const [messageSuccess, setMessageSuccess] = useState(false);

  const handleAddToCart = () => {
    const cartItem = {
      id: mockProduct.id,
      title: mockProduct.title,
      price: mockProduct.price,
      quantity: quantity,
      imageUrl: mockProduct.imageUrl,
      seller: mockProduct.seller,
    };
    
    addItem(cartItem);
    setAddedToCart(true);
    
    setTimeout(() => {
      setAddedToCart(false);
    }, 2000);
  };

  const handleTradeRequest = () => {
    if (!selectedTradeItem) {
      return;
    }

    const selectedItem = userItems.find((item) => item.id === selectedTradeItem);
    if (!selectedItem) {
      return;
    }

    const proposal = {
      proposedItemId: selectedItem.id,
      requestedItemId: mockProduct.id,
      proposerId: 'user1', // Replace with actual user ID
      receiverId: mockProduct.seller.id,
      message: tradeMessage,
      proposedItem: selectedItem,
      requestedItem: {
        id: mockProduct.id,
        title: mockProduct.title,
        condition: mockProduct.condition,
        imageUrl: mockProduct.imageUrl,
        description: mockProduct.description,
        owner: {
          id: mockProduct.seller.id,
          name: mockProduct.seller.name,
          university: mockProduct.seller.university,
        },
      },
    };

    addProposal(proposal);
    setTradeDialogOpen(false);
    setTradeMessage('');
    setSelectedTradeItem('');
  };

  const handleMessageSeller = () => {
    setMessageDialogOpen(true);
  };

  const handleSendMessage = () => {
    try {
      if (messageContent.trim()) {
        sendMessage(mockProduct.seller.id, messageContent.trim());
        setMessageDialogOpen(false);
        setMessageContent('');
        setMessageSuccess(true);
      }
    } catch (err) {
      setMessageError('Failed to send message. Please try again.');
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={4}>
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Paper elevation={2}>
              <img
                src={mockProduct.imageUrl}
                alt={mockProduct.title}
                style={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: '600px',
                  objectFit: 'contain',
                }}
              />
            </Paper>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Typography variant="h4" gutterBottom>
              {mockProduct.title}
            </Typography>
            
            <Box sx={{ mb: 2 }}>
              <Chip
                label={mockProduct.condition}
                color="primary"
                sx={{ mr: 1 }}
              />
              <Chip label={mockProduct.category} />
            </Box>

            <Typography variant="h5" color="primary" gutterBottom>
              ${mockProduct.price.toFixed(2)}
            </Typography>

            <Typography variant="body1" paragraph>
              {mockProduct.description}
            </Typography>

            <Box sx={{ mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Product Details
              </Typography>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    ISBN
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {mockProduct.details.isbn}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Author
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {mockProduct.details.author}
                  </Typography>
                </Grid>
                <Grid item xs={4}>
                  <Typography variant="body2" color="text.secondary">
                    Edition
                  </Typography>
                </Grid>
                <Grid item xs={8}>
                  <Typography variant="body2">
                    {mockProduct.details.edition}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Divider sx={{ my: 3 }} />

            {/* Actions */}
            <Box sx={{ mb: 3 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <TextField
                    type="number"
                    label="Quantity"
                    value={quantity}
                    onChange={(e) => setQuantity(Number(e.target.value))}
                    inputProps={{ min: 1, max: 99 }}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={8}>
                  <Button
                    variant="contained"
                    startIcon={<CartIcon />}
                    onClick={handleAddToCart}
                    color={addedToCart ? "success" : "primary"}
                    fullWidth
                  >
                    {addedToCart ? "Added to Cart!" : "Add to Cart"}
                  </Button>
                </Grid>
              </Grid>
            </Box>

            <Grid container spacing={2}>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<TradeIcon />}
                  onClick={() => setTradeDialogOpen(true)}
                  fullWidth
                >
                  Propose Trade
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  variant="outlined"
                  startIcon={<MessageIcon />}
                  onClick={handleMessageSeller}
                  fullWidth
                >
                  Message Seller
                </Button>
              </Grid>
            </Grid>

            <Divider sx={{ my: 3 }} />

            {/* Seller Info */}
            <Box>
              <Typography variant="h6" gutterBottom>
                About the Seller
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Avatar
                  src={mockProduct.seller.avatarUrl}
                  alt={mockProduct.seller.name}
                  sx={{ mr: 2 }}
                >
                  <PersonIcon />
                </Avatar>
                <Box>
                  <Typography variant="subtitle1">
                    {mockProduct.seller.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {mockProduct.seller.university}
                  </Typography>
                </Box>
              </Box>
              <Typography variant="body2" color="text.secondary">
                Member since {mockProduct.seller.joinedDate}
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Box>

      {/* Trade Dialog */}
      <Dialog
        open={tradeDialogOpen}
        onClose={() => setTradeDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Propose a Trade</DialogTitle>
        <DialogContent>
          <Typography variant="body2" paragraph>
            Select one of your items to trade for {mockProduct.title}
          </Typography>

          {userItems.length === 0 ? (
            <Typography color="text.secondary">
              You don't have any items to trade. Add some items first!
            </Typography>
          ) : (
            <Box sx={{ mb: 3 }}>
              <FormControl fullWidth>
                <InputLabel>Select Item to Trade</InputLabel>
                <Select
                  value={selectedTradeItem}
                  onChange={(e) => setSelectedTradeItem(e.target.value)}
                  label="Select Item to Trade"
                >
                  {userItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title} - {item.condition}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
          )}

          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            label="Your trade proposal message"
            fullWidth
            value={tradeMessage}
            onChange={(e) => setTradeMessage(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setTradeDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleTradeRequest}
            variant="contained"
            disabled={!selectedTradeItem || !tradeMessage.trim()}
          >
            Send Proposal
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>Message {mockProduct.seller.name}</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            label="Your message"
            fullWidth
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Message Success Snackbar */}
      <Snackbar
        open={messageSuccess}
        autoHideDuration={3000}
        onClose={() => setMessageSuccess(false)}
        message="Message sent successfully"
      />

      {/* Message Error Snackbar */}
      <Snackbar
        open={!!messageError}
        autoHideDuration={6000}
        onClose={() => setMessageError(null)}
      >
        <Alert onClose={() => setMessageError(null)} severity="error">
          {messageError}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default ProductDetails; 