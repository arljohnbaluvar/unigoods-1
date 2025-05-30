import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  Container,
  Paper,
  Grid,
  Chip,
  IconButton,
  Divider,
  Card,
  CardContent,
  Rating,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  useTheme,
  alpha,
  Tooltip,
  Zoom,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  SwapHoriz as TradeIcon,
  Person as SellerIcon,
  School as UniversityIcon,
  Category as CategoryIcon,
  KeyboardArrowLeft as BackIcon,
  Star as StarIcon,
  AddShoppingCart as AddToCartIcon,
  LocalOffer as PriceIcon,
  Description as DescriptionIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import { useTradeContext } from '../context/TradeContext';

interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  category: string;
  condition: string;
  imageUrl: string;
  seller: {
    id: string;
    name: string;
    university: string;
    rating: number;
  };
}

const ProductDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const theme = useTheme();
  const { addItem } = useCart();
  const { user } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const { userItems, addProposal } = useTradeContext();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');
  const [tradeMessage, setTradeMessage] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Mock product data
    const mockProduct: Product = {
      id: id || '5',
      title: 'MacBook Pro 2021',
      description: 'Experience unparalleled performance with the M1 Pro chip MacBook Pro 2021. Featuring 16GB RAM and 512GB SSD storage, this powerhouse is perfect for computer science students and developers. The device is in excellent condition with minimal signs of use.',
      price: 50000.00,
      category: 'Electronics',
      condition: 'Like New',
      imageUrl: '/images/macbook.jpg',
      seller: {
        id: '5',
        name: 'Xian Dela Cruz',
        university: 'STI College Tagum',
        rating: 4.9,
      },
    };

    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [id]);

  const handleAddToCart = () => {
    if (product) {
      addItem({
        id: product.id,
        title: product.title,
        price: product.price,
        quantity: 1,
        imageUrl: product.imageUrl,
        seller: {
          id: product.seller.id,
          name: product.seller.name,
          university: product.seller.university,
          rating: product.seller.rating,
        },
      });
      enqueueSnackbar('Product added to cart!', { variant: 'success' });
    }
  };

  const handleTradeSubmit = () => {
    if (!selectedItem || !tradeMessage.trim()) {
      setError('Please select an item and write a message');
      return;
    }

    const selectedTradeItem = userItems.find((item) => item.id === selectedItem);
    if (!selectedTradeItem || !product || !user) {
      setError('Invalid trade data');
      return;
    }

    addProposal({
      proposedItemId: selectedTradeItem.id,
      requestedItemId: product.id,
      proposerId: user.id,
      proposerName: user.name,
      receiverId: product.seller.id,
      receiverName: product.seller.name,
      message: tradeMessage,
      proposedItem: selectedTradeItem,
      requestedItem: {
        ...product,
        owner: product.seller
      },
    });

    setTradeDialogOpen(false);
    setSelectedItem('');
    setTradeMessage('');
    setError(null);
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!product) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error">Product not found</Alert>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/products')}
          sx={{ mt: 2 }}
        >
          Back to Products
        </Button>
      </Box>
    );
  }

  const isOwnProduct = user?.id === product.seller.id;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<BackIcon />}
        onClick={() => navigate('/products')}
        sx={{ mb: 3 }}
      >
        Back to Products
      </Button>

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper
            elevation={0}
            sx={{
              borderRadius: 3,
              overflow: 'hidden',
              position: 'relative',
              height: '100%',
              minHeight: 400,
            }}
          >
            <Box
              component="img"
              src={product.imageUrl}
              alt={product.title}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
            />
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Box>
            <Typography variant="h4" gutterBottom>
              {product.title}
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              <PriceIcon color="primary" />
              <Typography variant="h5" color="primary">
                ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
              <Chip
                icon={<CategoryIcon />}
                label={product.category}
                color="primary"
                variant="outlined"
              />
              <Chip
                label={product.condition}
                color={
                  product.condition === 'New' ? 'success' :
                  product.condition === 'Like New' ? 'info' :
                  product.condition === 'Good' ? 'primary' :
                  'default'
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Typography
                variant="body1"
                sx={{
                  whiteSpace: 'pre-wrap',
                  color: theme.palette.text.secondary,
                }}
              >
                {product.description}
              </Typography>
            </Box>

            <Divider sx={{ my: 3 }} />

            <Card
              elevation={0}
              sx={{
                mb: 3,
                background: alpha(theme.palette.primary.main, 0.05),
                borderRadius: 3,
              }}
            >
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  Seller Information
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Avatar sx={{ bgcolor: theme.palette.primary.main }}>
                    <SellerIcon />
                  </Avatar>
                  <Box>
                    <Typography variant="subtitle1">
                      {product.seller.name}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <UniversityIcon fontSize="small" color="action" />
                      <Typography variant="body2" color="text.secondary">
                        {product.seller.university}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Rating
                        value={product.seller.rating}
                        precision={0.1}
                        size="small"
                        readOnly
                      />
                      <Typography variant="body2" color="text.secondary">
                        ({product.seller.rating})
                      </Typography>
                    </Box>
                  </Box>
                </Box>
              </CardContent>
            </Card>

            {!isOwnProduct && (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddToCartIcon />}
                    onClick={handleAddToCart}
                    fullWidth
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TradeIcon />}
                    onClick={() => {
                      if (userItems.length === 0) {
                        navigate('/my-items');
                      } else {
                        setTradeDialogOpen(true);
                      }
                    }}
                    fullWidth
                  >
                    {userItems.length === 0 ? 'Add Items to Trade' : 'Propose Trade'}
                  </Button>
                </Box>
                {userItems.length === 0 && (
                  <Alert severity="info" sx={{ mt: 1 }}>
                    You need to add some items to your inventory before you can propose a trade. Click the button above to add items.
                  </Alert>
                )}
              </Box>
            )}
          </Box>
        </Grid>
      </Grid>

      <Dialog
        open={tradeDialogOpen}
        onClose={() => {
          setTradeDialogOpen(false);
          setSelectedItem('');
          setTradeMessage('');
          setError(null);
        }}
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
            Make a Trade Offer
          </Typography>
        </DialogTitle>

        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {userItems.length === 0 ? (
            <Alert severity="info">
              You don't have any items to trade. Please add some items first.
            </Alert>
          ) : (
            <>
              <FormControl fullWidth sx={{ mb: 3 }}>
                <InputLabel>Select Item to Trade</InputLabel>
                <Select
                  value={selectedItem}
                  label="Select Item to Trade"
                  onChange={(e) => setSelectedItem(e.target.value)}
                >
                  {userItems.map((item) => (
                    <MenuItem key={item.id} value={item.id}>
                      {item.title} ({item.condition})
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <TextField
                label="Message to Seller"
                multiline
                rows={4}
                value={tradeMessage}
                onChange={(e) => setTradeMessage(e.target.value)}
                fullWidth
                placeholder="Explain why you want to trade and any additional details..."
              />

              {selectedItem && (
                <Box sx={{ mt: 3 }}>
                  <Typography variant="subtitle1" gutterBottom>
                    Trade Preview
                  </Typography>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Your Item
                          </Typography>
                          <Typography variant="body1">
                            {userItems.find((item) => item.id === selectedItem)?.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Condition: {userItems.find((item) => item.id === selectedItem)?.condition}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                    <Grid item xs={6}>
                      <Card elevation={0} sx={{ height: '100%' }}>
                        <CardContent>
                          <Typography variant="subtitle2" color="text.secondary">
                            Requested Item
                          </Typography>
                          <Typography variant="body1">
                            {product.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Condition: {product.condition}
                          </Typography>
                        </CardContent>
                      </Card>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3 }}>
          <Button
            onClick={() => {
              setTradeDialogOpen(false);
              setSelectedItem('');
              setTradeMessage('');
              setError(null);
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleTradeSubmit}
            disabled={!selectedItem || !tradeMessage.trim() || userItems.length === 0}
          >
            Send Trade Proposal
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ProductDetails; 