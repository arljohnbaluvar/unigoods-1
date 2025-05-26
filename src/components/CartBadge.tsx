import React from 'react';
import { Badge, IconButton } from '@mui/material';
import { ShoppingCart as CartIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';

interface CartBadgeProps {
  color?: 'primary' | 'secondary' | 'default' | 'error' | 'info' | 'success' | 'warning' | 'inherit';
}

const CartBadge: React.FC<CartBadgeProps> = ({ color = 'primary' }) => {
  const navigate = useNavigate();
  const { getItemCount } = useCart();

  return (
    <IconButton
      color={color}
      onClick={() => navigate('/cart')}
      aria-label="cart"
      sx={{
        '&:hover': {
          transform: 'scale(1.1)',
          transition: 'transform 0.2s',
        },
      }}
    >
      <Badge badgeContent={getItemCount()} color="error" max={99}>
        <CartIcon />
      </Badge>
    </IconButton>
  );
};

export default CartBadge; 