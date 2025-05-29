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
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [tradeDialogOpen, setTradeDialogOpen] = useState(false);
  const [tradeOffer, setTradeOffer] = useState('');

  useEffect(() => {
    // Mock product data
    const mockProduct: Product = {
      id: id || '1',
      title: 'Computer Science Textbook',
      description: 'A comprehensive guide to computer science fundamentals. Perfect for first-year students. The book is in excellent condition with minimal highlighting.',
      price: 45.99,
      category: 'Textbooks',
      condition: 'Like New',
      imageUrl: 'https://picsum.photos/600/400',
      seller: {
        id: '123',
        name: 'John Smith',
        university: 'Stanford University',
        rating: 4.5,
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
      });
      enqueueSnackbar('Product added to cart!', { variant: 'success' });
    }
  };

  const handleTrade = () => {
    if (tradeOffer.trim()) {
      enqueueSnackbar('Trade offer sent successfully!', { variant: 'success' });
      setTradeDialogOpen(false);
      setTradeOffer('');
    }
  };

  if (loading || !product) {
    return (
      <Container maxWidth="lg">
        <Box sx={{ py: 4, minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Typography>Loading...</Typography>
        </Box>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate(-1)}
          sx={{
            mb: 4,
            color: theme.palette.text.secondary,
            '&:hover': {
              color: theme.palette.primary.main,
              transform: 'translateX(-4px)',
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          Back to Products
        </Button>

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                overflow: 'hidden',
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  height: '100%',
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
                  zIndex: 0,
                },
              }}
            >
              <Box
                component="img"
                src={product.imageUrl}
                alt={product.title}
                sx={{
                  width: '100%',
                  height: 'auto',
                  maxHeight: 500,
                  objectFit: 'cover',
                  display: 'block',
                  position: 'relative',
                  zIndex: 1,
                }}
              />
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Box>
              <Box sx={{ mb: 3 }}>
                <Typography 
                  variant="h4" 
                  gutterBottom
                  sx={{
                    fontWeight: 700,
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    color: 'transparent',
                  }}
                >
                  {product.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                  <Chip
                    icon={<CategoryIcon />}
                    label={product.category}
                    size="small"
                    sx={{
                      background: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      fontWeight: 500,
                    }}
                  />
                  <Chip
                    label={product.condition}
                    size="small"
                    sx={{
                      background: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      fontWeight: 500,
                    }}
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <PriceIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                  <Typography
                    variant="h5"
                    sx={{
                      fontWeight: 700,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      color: 'transparent',
                    }}
                  >
                    ₱{product.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </Typography>
                </Box>

                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    <DescriptionIcon sx={{ color: theme.palette.text.secondary, mr: 1 }} />
                    <Typography variant="subtitle1" fontWeight={600}>
                      Description
                    </Typography>
                  </Box>
                  <Typography variant="body1" color="text.secondary" paragraph>
                    {product.description}
                  </Typography>
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Card
                    elevation={0}
                    sx={{
                      borderRadius: 3,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
                      background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.02)}, ${alpha(theme.palette.secondary.main, 0.02)})`,
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                        <Avatar 
                          sx={{ 
                            width: 48, 
                            height: 48,
                            bgcolor: theme.palette.primary.main,
                          }}
                        >
                          <SellerIcon />
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="subtitle1" fontWeight={600}>
                            {product.seller.name}
                          </Typography>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <UniversityIcon sx={{ fontSize: 16, color: theme.palette.text.secondary }} />
                            <Typography variant="body2" color="text.secondary">
                              {product.seller.university}
                            </Typography>
                          </Box>
                        </Box>
                        <Box sx={{ textAlign: 'right' }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
                            <Rating
                              value={product.seller.rating}
                              readOnly
                              precision={0.5}
                              size="small"
                              icon={<StarIcon fontSize="inherit" />}
                            />
                            <Typography variant="body2" color="text.secondary">
                              {product.seller.rating}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Box>

                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button
                    variant="contained"
                    startIcon={<AddToCartIcon />}
                    onClick={handleAddToCart}
                    disabled={user?.id === product.seller.id}
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: theme.shadows[4],
                        background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      },
                    }}
                  >
                    Add to Cart
                  </Button>
                  <Button
                    variant="outlined"
                    startIcon={<TradeIcon />}
                    onClick={() => setTradeDialogOpen(true)}
                    disabled={user?.id === product.seller.id}
                    fullWidth
                    sx={{
                      py: 1.5,
                      borderRadius: 2,
                      borderColor: alpha(theme.palette.primary.main, 0.5),
                      color: theme.palette.primary.main,
                      transition: 'all 0.2s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-2px)',
                        borderColor: theme.palette.primary.main,
                        background: alpha(theme.palette.primary.main, 0.05),
                      },
                    }}
                  >
                    Offer Trade
                  </Button>
                </Box>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Dialog
          open={tradeDialogOpen}
          onClose={() => setTradeDialogOpen(false)}
          maxWidth="sm"
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
            <TextField
              autoFocus
              margin="dense"
              label="Describe your trade offer"
              fullWidth
              multiline
              rows={4}
              value={tradeOffer}
              onChange={(e) => setTradeOffer(e.target.value)}
              placeholder="What would you like to trade with?"
              sx={{
                mt: 2,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  transition: 'all 0.2s ease-in-out',
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.02),
                  },
                  '&.Mui-focused': {
                    boxShadow: `0 0 0 2px ${alpha(theme.palette.primary.main, 0.2)}`,
                  },
                },
              }}
            />
          </DialogContent>
          <DialogActions sx={{ p: 2.5, pt: 0 }}>
            <Button
              onClick={() => setTradeDialogOpen(false)}
              sx={{
                color: theme.palette.text.secondary,
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                },
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleTrade}
              variant="contained"
              disabled={!tradeOffer.trim()}
              sx={{
                px: 3,
                borderRadius: 2,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                '&:hover': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                },
              }}
            >
              Send Offer
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default ProductDetails; 