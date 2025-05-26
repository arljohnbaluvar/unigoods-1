import React from 'react';
import {
  Grid,
  Paper,
  Typography,
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import {
  ShoppingCart as CartIcon,
  Store as StoreIcon,
  SwapHoriz as TradeIcon,
  Notifications as NotificationIcon,
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  const quickActions = [
    {
      title: 'Browse Products',
      description: 'Explore available university items',
      icon: <StoreIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/products'),
    },
    {
      title: 'My Cart',
      description: 'View your shopping cart',
      icon: <CartIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/cart'),
    },
    {
      title: 'Trade Items',
      description: 'Trade items with other students',
      icon: <TradeIcon sx={{ fontSize: 40 }} />,
      action: () => navigate('/trade'),
    },
  ];

  const recentActivities = [
    {
      id: 'prod123',
      type: 'product',
      title: 'New Product Listed',
      description: 'Chemistry Textbook - 8th Edition',
      time: '2 hours ago',
    },
    {
      id: 'trade456',
      type: 'trade',
      title: 'Trade Request',
      description: 'Someone wants to trade for your Physics notes',
      time: '5 hours ago',
    },
    {
      id: 'prod789',
      type: 'product',
      title: 'Price Drop Alert',
      description: 'Calculator TI-84 is now 15% off',
      time: '1 day ago',
    },
  ];

  const handleViewDetails = (activity: any) => {
    switch (activity.type) {
      case 'product':
        navigate(`/products/${activity.id}`);
        break;
      case 'trade':
        navigate(`/trades`);
        break;
      default:
        console.warn('Unknown activity type:', activity.type);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Welcome Back!
      </Typography>

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12}>
          <Typography variant="h6" gutterBottom>
            Quick Actions
          </Typography>
          <Grid container spacing={2}>
            {quickActions.map((action, index) => (
              <Grid item xs={12} sm={6} md={4} key={index}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                  }}
                  onClick={action.action}
                >
                  {action.icon}
                  <Typography variant="h6" sx={{ mt: 1 }}>
                    {action.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" align="center">
                    {action.description}
                  </Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Recent Activities */}
        <Grid item xs={12} md={8}>
          <Typography variant="h6" gutterBottom>
            Recent Activities
          </Typography>
          <Grid container spacing={2}>
            {recentActivities.map((activity, index) => (
              <Grid item xs={12} key={index}>
                <Card>
                  <CardContent>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <NotificationIcon color="primary" sx={{ mr: 1 }} />
                      <Typography variant="h6">{activity.title}</Typography>
                    </Box>
                    <Typography variant="body1">{activity.description}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {activity.time}
                    </Typography>
                  </CardContent>
                  <CardActions>
                    <Button 
                      size="small" 
                      onClick={() => handleViewDetails(activity)}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Grid>

        {/* Statistics */}
        <Grid item xs={12} md={4}>
          <Typography variant="h6" gutterBottom>
            Your Statistics
          </Typography>
          <Paper sx={{ p: 2 }}>
            <Typography variant="body1" gutterBottom>
              Items Listed: 3
            </Typography>
            <Typography variant="body1" gutterBottom>
              Active Trades: 1
            </Typography>
            <Typography variant="body1" gutterBottom>
              Items Sold: 5
            </Typography>
            <Typography variant="body1">
              Items Purchased: 2
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Dashboard; 