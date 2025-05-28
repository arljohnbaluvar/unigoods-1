import React from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  IconButton,
  Divider,
  Paper,
  Tooltip,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  BookmarkBorder as SaveIcon,
  ShoppingCart as CartIcon,
} from '@mui/icons-material';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

// Types
interface CartItem {
  id: string;
  title: string;
  price: number;
  quantity: number;
  imageUrl: string;
  seller: {
    name: string;
    university: string;
  };
}

// Mock data (replace with actual state management later)
const initialCartItems: CartItem[] = [
  {
    id: '1',
    title: 'Calculus Textbook - 10th Edition',
    price: 45.99,
    quantity: 1,
    imageUrl: 'https://via.placeholder.com/200x300',
    seller: {
      name: 'John Doe',
      university: 'State University',
    },
  },
];

const Cart: React.FC = () => {
  const {
    items,
    savedItems,
    removeItem,
    updateQuantity,
    getTotal,
    saveForLater,
    moveToCart,
    removeSavedItem,
  } = useCart();
  const navigate = useNavigate();

  const handleUpdateQuantity = (itemId: string, currentQuantity: number, change: number) => {
    const newQuantity = Math.max(1, currentQuantity + change);
    updateQuantity(itemId, newQuantity);
  };

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Shopping Cart
        </Typography>

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            {items.length === 0 ? (
              <Paper sx={{ p: 3, textAlign: 'center' }}>
                <Typography variant="h6" color="text.secondary">
                  Your cart is empty
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => navigate('/products')}
                  sx={{ mt: 2 }}
                >
                  Browse Products
                </Button>
              </Paper>
            ) : (
              items.map((item) => (
                <Card key={item.id} sx={{ mb: 2 }}>
                  <Grid container>
                    <Grid item xs={12} sm={4}>
                      <CardMedia
                        component="img"
                        height="200"
                        image={item.imageUrl}
                        alt={item.title}
                        sx={{ objectFit: 'contain' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={8}>
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.seller ? `Seller: ${item.seller.name} (${item.seller.university})` : 'No seller information'}
                        </Typography>
                        <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                          ${item.price.toFixed(2)}
                        </Typography>
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            mt: 2,
                            gap: 2,
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center' }}>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)}
                            >
                              <RemoveIcon />
                            </IconButton>
                            <Typography sx={{ mx: 2 }}>{item.quantity}</Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)}
                            >
                              <AddIcon />
                            </IconButton>
                          </Box>
                          <Box sx={{ display: 'flex', gap: 1 }}>
                            <Tooltip title="Save for later">
                              <IconButton
                                color="primary"
                                onClick={() => saveForLater(item.id)}
                              >
                                <SaveIcon />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Remove from cart">
                              <IconButton
                                color="error"
                                onClick={() => removeItem(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </Box>
                      </CardContent>
                    </Grid>
                  </Grid>
                </Card>
              ))
            )}

            {/* Saved Items Section */}
            {savedItems.length > 0 && (
              <Box sx={{ mt: 4 }}>
                <Typography variant="h5" gutterBottom>
                  Saved for Later
                </Typography>
                {savedItems.map((item) => (
                  <Card key={item.id} sx={{ mb: 2 }}>
                    <Grid container>
                      <Grid item xs={12} sm={4}>
                        <CardMedia
                          component="img"
                          height="200"
                          image={item.imageUrl}
                          alt={item.title}
                          sx={{ objectFit: 'contain' }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={8}>
                        <CardContent>
                          <Typography variant="h6" gutterBottom>
                            {item.title}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {item.seller ? `Seller: ${item.seller.name} (${item.seller.university})` : 'No seller information'}
                          </Typography>
                          <Typography variant="h6" color="primary" sx={{ mt: 2 }}>
                            ${item.price.toFixed(2)}
                          </Typography>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'flex-end',
                              mt: 2,
                              gap: 1,
                            }}
                          >
                            <Tooltip title="Move to cart">
                              <Button
                                variant="outlined"
                                startIcon={<CartIcon />}
                                onClick={() => moveToCart(item.id)}
                              >
                                Move to Cart
                              </Button>
                            </Tooltip>
                            <Tooltip title="Remove from saved items">
                              <IconButton
                                color="error"
                                onClick={() => removeSavedItem(item.id)}
                              >
                                <DeleteIcon />
                              </IconButton>
                            </Tooltip>
                          </Box>
                        </CardContent>
                      </Grid>
                    </Grid>
                  </Card>
                ))}
              </Box>
            )}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, position: 'sticky', top: 24 }}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography>Subtotal ({items.length} items)</Typography>
                  </Grid>
                  <Grid item>
                    <Typography>${getTotal().toFixed(2)}</Typography>
                  </Grid>
                </Grid>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Box sx={{ my: 2 }}>
                <Grid container justifyContent="space-between">
                  <Grid item>
                    <Typography variant="h6">Total</Typography>
                  </Grid>
                  <Grid item>
                    <Typography variant="h6">
                      ${getTotal().toFixed(2)}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={handleCheckout}
                disabled={items.length === 0}
              >
                Proceed to Checkout
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Cart; 