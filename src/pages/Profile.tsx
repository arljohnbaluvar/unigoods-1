import React from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  Grid,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';

const Profile: React.FC = () => {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Grid container spacing={4}>
            {/* Profile Header */}
            <Grid item xs={12} display="flex" alignItems="center" gap={3}>
              <Avatar
                sx={{
                  width: 100,
                  height: 100,
                  bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                }}
              >
                {user.name.charAt(0).toUpperCase()}
              </Avatar>
              <Box>
                <Typography variant="h4" gutterBottom>
                  {user.name}
                </Typography>
                <Chip
                  label={user.role === 'admin' ? 'Administrator' : 'User'}
                  color={user.role === 'admin' ? 'secondary' : 'primary'}
                  sx={{ mr: 1 }}
                />
                {user.university && (
                  <Chip label={user.university} variant="outlined" />
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Divider />
            </Grid>

            {/* Profile Details */}
            <Grid item xs={12}>
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Account Type"
                    secondary={user.role === 'admin' ? 'Administrator' : 'Regular User'}
                  />
                </ListItem>
                <ListItem>
                  <ListItemText
                    primary="Account ID"
                    secondary={user.id}
                  />
                </ListItem>
                {user.university && (
                  <ListItem>
                    <ListItemText
                      primary="University"
                      secondary={user.university}
                    />
                  </ListItem>
                )}
              </List>
            </Grid>

            {/* Admin Section */}
            {user.role === 'admin' && (
              <>
                <Grid item xs={12}>
                  <Divider />
                </Grid>
                <Grid item xs={12}>
                  <Typography variant="h6" gutterBottom>
                    Administrative Access
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    As an administrator, you have access to:
                  </Typography>
                  <List>
                    <ListItem>
                      <ListItemText primary="• User Verification Management" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• Product Moderation" />
                    </ListItem>
                    <ListItem>
                      <ListItemText primary="• System Settings" />
                    </ListItem>
                  </List>
                </Grid>
              </>
            )}
          </Grid>
        </Paper>
      </Box>
    </Container>
  );
};

export default Profile; 