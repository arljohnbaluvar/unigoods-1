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
  alpha,
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
  Contacts as ContactsIcon,
  Add as AddIcon,
} from '@mui/icons-material';
import CartBadge from './CartBadge';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import Logo from './Logo';
import { useSnackbar } from 'notistack';

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
  const { enqueueSnackbar } = useSnackbar();
  const isSmUp = useMediaQuery(theme.breakpoints.up('sm'));

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

  const handleRemoveItem = (itemId: string, itemTitle: string) => {
    removeItem(itemId);
    enqueueSnackbar(`Removed ${itemTitle} from cart`, { 
      variant: 'success'
    });
  };

  const menuItems = [
    { text: 'Home', icon: <HomeIcon />, path: '/dashboard' },
    { text: 'Products', icon: <StoreIcon />, path: '/products' },
    { text: 'Sell Product', icon: <AddIcon />, path: '/sell' },
    { text: 'Trade', icon: <TradeIcon />, path: '/trades' },
    { text: 'Contacts', icon: <ContactsIcon />, path: '/contacts' },
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
          p: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
        }}
      >
        <Logo height={50} />
      </Box>
      
      {user && (
        <Box sx={{ p: 3, borderBottom: 1, borderColor: 'divider' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar 
              sx={{ 
                width: 48, 
                height: 48,
                bgcolor: theme.palette.primary.main,
                fontSize: '1.2rem',
                fontWeight: 600,
              }}
            >
              {user.name.charAt(0).toUpperCase()}
            </Avatar>
            <Box>
              <Typography 
                variant="subtitle1" 
                noWrap
                sx={{ 
                  fontWeight: 600,
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  color: 'transparent',
                }}
              >
                {user.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" noWrap>
                {user.university || 'Admin'}
              </Typography>
            </Box>
          </Box>
        </Box>
      )}

      <List sx={{ flexGrow: 1, pt: 2, px: 2 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          return (
            <ListItem
              button
              key={item.text}
              component={Link}
              to={item.path}
              selected={isSelected}
              sx={{
                mb: 1,
                borderRadius: 2,
                overflow: 'hidden',
                position: 'relative',
                height: 48,
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  height: '100%',
                  width: isSelected ? '100%' : '0%',
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.08)}, ${alpha(theme.palette.secondary.main, 0.08)})`,
                  transition: 'width 0.3s ease-in-out',
                },
                '&:hover::before': {
                  width: '100%',
                },
                '&.Mui-selected': {
                  backgroundColor: 'transparent',
                },
              }}
            >
              <ListItemIcon 
                sx={{ 
                  minWidth: 40,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.secondary,
                  transition: 'color 0.2s ease-in-out',
                }}
              >
                {item.icon}
              </ListItemIcon>
              <ListItemText 
                primary={item.text}
                primaryTypographyProps={{
                  fontSize: '0.9rem',
                  fontWeight: isSelected ? 600 : 500,
                  color: isSelected ? theme.palette.primary.main : theme.palette.text.primary,
                  sx: { transition: 'color 0.2s ease-in-out' },
                }}
              />
              {isSelected && (
                <Box
                  sx={{
                    position: 'absolute',
                    right: 0,
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: 4,
                    height: 20,
                    borderRadius: '4px 0 0 4px',
                    background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  }}
                />
              )}
            </ListItem>
          );
        })}
      </List>

      <Box sx={{ p: 2 }}>
        <Button
          fullWidth
          variant="outlined"
          color="primary"
          onClick={handleLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderRadius: 2,
            py: 1.2,
            borderColor: alpha(theme.palette.primary.main, 0.2),
            background: alpha(theme.palette.primary.main, 0.02),
            '&:hover': {
              borderColor: theme.palette.primary.main,
              background: alpha(theme.palette.primary.main, 0.05),
              transform: 'translateY(-1px)',
            },
          }}
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
        p: 3,
        background: `linear-gradient(45deg, ${alpha(theme.palette.primary.main, 0.05)}, ${alpha(theme.palette.secondary.main, 0.05)})`,
      }}>
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
          Shopping Cart
        </Typography>
        <IconButton 
          onClick={() => toggleCartDrawer(false)}
          sx={{
            '&:hover': {
              background: alpha(theme.palette.primary.main, 0.1),
            },
          }}
        >
          <CloseIcon />
        </IconButton>
      </Box>
      
      <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
        {items.length === 0 ? (
          <Box sx={{ 
            height: '100%', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 2,
            opacity: 0.7,
          }}>
            <CartIcon sx={{ fontSize: 48, color: 'text.secondary' }} />
            <Typography color="text.secondary" variant="subtitle1">
              Your cart is empty
            </Typography>
          </Box>
        ) : (
          items.map((item) => (
            <Card 
              key={item.id} 
              sx={{ 
                mb: 2,
                borderRadius: 2,
                overflow: 'hidden',
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              <Box sx={{ display: 'flex', p: 1 }}>
                <CardMedia
                  component="img"
                  sx={{ 
                    width: 88, 
                    height: 88, 
                    objectFit: 'cover',
                  }}
                  image={item.imageUrl}
                  alt={item.title}
                />
                <CardContent sx={{ flex: 1, p: 2 }}>
                  <Typography 
                    variant="subtitle2" 
                    noWrap
                    sx={{ fontWeight: 600 }}
                  >
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
                    <Typography 
                      variant="subtitle2" 
                      sx={{
                        background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                        backgroundClip: 'text',
                        WebkitBackgroundClip: 'text',
                        color: 'transparent',
                        fontWeight: 600,
                      }}
                    >
                      ₱{(item.price * item.quantity).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => handleRemoveItem(item.id, item.title)}
                      sx={{ 
                        color: theme.palette.error.light,
                        '&:hover': { 
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
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
        <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider' }}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight={500}>
              Total:
            </Typography>
            <Typography 
              variant="subtitle1" 
              sx={{
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 600,
              }}
            >
              ₱{getTotal().toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </Typography>
          </Box>
          <Button
            variant="contained"
            fullWidth
            onClick={() => {
              toggleCartDrawer(false);
              navigate('/cart');
            }}
            sx={{
              borderRadius: 2,
              py: 1.2,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              '&:hover': {
                background: `linear-gradient(45deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              },
            }}
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
          borderColor: 'divider',
        }}
      >
        <Toolbar sx={{ height: 70 }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ 
              mr: 2, 
              display: { sm: 'none' },
              color: theme.palette.text.primary,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Box sx={{ display: { xs: 'none', sm: 'block' }, flexGrow: 1 }}>
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
              {menuItems.find((item) => item.path === location.pathname)?.text ||
                'UniGoods'}
            </Typography>
          </Box>
          <Box sx={{ display: { xs: 'flex', sm: 'none' }, flexGrow: 1, justifyContent: 'center' }}>
            <Logo height={40} />
          </Box>
          <IconButton 
            onClick={() => toggleCartDrawer(true)}
            sx={{ 
              borderRadius: 2,
              width: 40,
              height: 40,
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-1px)',
                backgroundColor: alpha(theme.palette.primary.main, 0.1),
              },
            }}
          >
            <Badge 
              badgeContent={items.length} 
              color="primary"
              sx={{
                '& .MuiBadge-badge': {
                  background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                },
              }}
            >
              <CartIcon sx={{ color: theme.palette.text.primary }} />
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
              borderRight: 'none',
              boxShadow: '1px 0 8px rgba(0, 0, 0, 0.1)',
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
              borderRight: 'none',
              boxShadow: '1px 0 8px rgba(0, 0, 0, 0.1)',
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
        PaperProps={{
          sx: {
            boxShadow: '-1px 0 8px rgba(0, 0, 0, 0.1)',
          },
        }}
      >
        {cartDrawer}
      </SwipeableDrawer>
    </Box>
  );
};

export default Layout;