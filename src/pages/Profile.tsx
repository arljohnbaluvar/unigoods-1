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
  useTheme,
  alpha,
} from '@mui/material';
import { useAuth } from '../context/AuthContext';
import StudentIdSubmission from '../components/StudentIdSubmission';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const theme = useTheme();

  if (!user) {
    return null;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Grid container spacing={3}>
          {/* Profile Header */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                p: 3,
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
                <Avatar
                  sx={{
                    width: 100,
                    height: 100,
                    bgcolor: user.role === 'admin' ? 'secondary.main' : 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography variant="h4" gutterBottom>
                    {user.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                    <Chip
                      label={user.role === 'admin' ? 'Administrator' : 'Student'}
                      color={user.role === 'admin' ? 'secondary' : 'primary'}
                    />
                    {user.university && (
                      <Chip label={user.university} variant="outlined" />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Student ID Verification Section */}
          {user.role !== 'admin' && (
            <Grid item xs={12}>
              <StudentIdSubmission />
            </Grid>
          )}

          {/* Profile Details */}
          <Grid item xs={12}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 2,
                border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              }}
            >
              <List>
                <ListItem>
                  <ListItemText
                    primary="Email"
                    secondary={user.email}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      color: 'text.secondary',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                    }}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="University"
                    secondary={user.university || 'Not specified'}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      color: 'text.secondary',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                    }}
                  />
                </ListItem>
                <Divider component="li" />
                <ListItem>
                  <ListItemText
                    primary="Account Type"
                    secondary={user.role === 'admin' ? 'Administrator' : 'Student'}
                    primaryTypographyProps={{
                      variant: 'subtitle2',
                      color: 'text.secondary',
                    }}
                    secondaryTypographyProps={{
                      variant: 'body1',
                      color: 'text.primary',
                    }}
                  />
                </ListItem>
              </List>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 