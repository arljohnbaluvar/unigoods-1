import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Button,
  useTheme,
  useMediaQuery,
  SwipeableDrawer,
  Divider,
  Card,
  CardContent,
  CardMedia,
  Badge,
  Avatar,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Home as HomeIcon,
  Store as StoreIcon,
  SwapHoriz as TradeIcon,
  Person as ProfileIcon,
  ExitToApp as LogoutIcon,
  Close as CloseIcon,
  Delete as DeleteIcon,
  AdminPanelSettings as AdminIcon,
  ShoppingCart as CartIcon,
  Message as MessageIcon,
} from '@mui/icons-material';
import CartBadge from './CartBadge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { useMessage } from '../context/MessageContext';

const drawerWidth = 280;

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartDrawerOpen, setCartDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();
  const { items, removeItem, getTotal } = useCart();
  const { logout, user } = useAuth();
  const { getUnreadCount } = useMessage();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const toggleCartDrawer = (open: boolean) => {
    setCartDrawerOpen(open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Products', icon: <StoreIcon />, path: '/products' },
    { text: 'Trade', icon: <TradeIcon />, path: '/trades' },
    { 
      text: 'Messages', 
      icon: (
        <Badge badgeContent={getUnreadCount()} color="primary">
          <MessageIcon />
        </Badge>
      ), 
      path: '/messages' 
    },
    { text: 'Profile', icon: <ProfileIcon />, path: '/profile' },
  ];

  if (user?.role === 'admin') {
    menuItems.push({
      text: 'Admin Panel',
      icon: <AdminIcon />,
      path: '/admin/verification',
    });
  }

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderBottom: 1,
          borderColor: 'secondary.main',
          height: 80,
        }}
      >
        <Logo height={60} />
      </Box>
      
      {user && (
        <Box sx={{ p: 2, borderBottom: 1, borderColor: 'secondary.main' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
            <Avatar sx={{ bgcolor: 'primary.main' }}>
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography variant="subtitle1" noWrap>
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.university || 'Admin'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ flexGrow: 1, pt: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={Link}
            to={item.path}
            selected={location.pathname === item.path}
            sx={{
              mx: 1,
              borderRadius: 1,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: 'secondary.light',
                '&:hover': {
                  bgcolor: 'secondary.light',
                },
              },
            }}
          >
            <ListItemIcon sx={{ color: 'primary.main', minWidth: 40 }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text}
              primaryTypographyProps={{
                fontSize: '0.9rem',
                fontWeight: location.pathname === item.path ? 600 : 400,
              }}
            />
          </ListItem>
        ))}
      </List>

      <Box sx={{ p: 2, borderTop: 1, borderColor: 'secondary.main' }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{ borderRadius: 2 }}
        >
          Logout
        </Button>
      </Box>
    </Box>
  );

  const cartDrawer = (
    <Box
      sx={{
        width: 320,
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        bgcolor: 'background.default',
      }}
      role="presentation"
    >
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        p: 2,
        borderBottom: 1,
        borderColor: 'secondary.main',
      }}>
        <Typography variant="h6" color="primary">Shopping Cart</Typography>
        <IconButton onClick={() => toggleCartDrawer(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center' 
          }}>
            <Typography color="text.secondary" align="center">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Card 
              key={item.id} 
              sx={{ 
                mb: 2,
                '&:hover': {
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ display: 'flex' }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: 88, 
                    height: 88, 
                    objectFit: 'cover',
                    borderRadius: '12px 0 0 12px',
                  }}
                  image={item.imageUrl}
                  alt={item.title}
                />
                <CardContent sx={{ flex: 1, p: 2 }}>
                  <Typography variant="subtitle2" noWrap>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Qty: {item.quantity}
                  </Typography>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      mt: 1,
                    }}
                  >
                    <Typography variant="subtitle2" color="primary">
                      ${(item.price * item.quantity).toFixed(2)}
                    </Typography>
                    <IconButton
                      size="small"
                      color="error"
                      onClick={() => removeItem(item.id)}
                      sx={{ 
                        '&:hover': { 
                          bgcolor: 'error.light',
                          color: 'error.contrastText',
                        },
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </CardContent>
              </Box>
            </Card>
          ))
        )}
      </Box>

      {items.length > 0 && (
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'secondary.main' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1">Total:</Typography>
            <Typography variant="subtitle1" color="primary" fontWeight="600">
              ${getTotal().toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              toggleCartDrawer(false);
              navigate('/cart');
            }}
            sx={{ borderRadius: 2 }}
          >
            View Cart & Checkout
          </Button>
        </Box>
      )}
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', bgcolor: 'background.default', minHeight: '100vh' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          bgcolor: 'background.paper',
          borderBottom: 1,
          borderColor: 'secondary.main',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
            <Typography variant="h6" color="text.primary">
              {menuItems.find((item) => item.path === location.pathname)?.text ||
                'UniGoods'}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
            <Logo height={40} />
          </Box>
          <IconButton 
            color="primary"
            onClick={() => toggleCartDrawer(true)}
            sx={{ 
              mr: 1,
              '&:hover': { bgcolor: 'secondary.light' },
            }}
          >
            <Badge badgeContent={items.length} color="secondary">
              <CartIcon />
            </Badge>
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
            },
          }}
        >
          {drawer}
        </Drawer>
      </Box>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          mt: { xs: 7, sm: 8 },
        }}
      >
        {children}
      </Box>

      <SwipeableDrawer
        anchor="right"
        open={cartDrawerOpen}
        onClose={() => toggleCartDrawer(false)}
        onOpen={() => toggleCartDrawer(true)}
      >
        {cartDrawer}
      </SwipeableDrawer>
    </Box>
  );
};

export default Layout; 