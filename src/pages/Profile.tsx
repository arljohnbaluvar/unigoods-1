import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Paper,
  Grid,
  Avatar,
  Button,
  TextField,
  IconButton,
} from '@mui/material';
import {
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
} from '@mui/icons-material';
import { useAuth } from '../context/AuthContext';
import { useSnackbar } from 'notistack';
import UserVerification from '../pages/UserVerification';

const Profile: React.FC = () => {
  const { user, updateProfile } = useAuth();
  const { enqueueSnackbar } = useSnackbar();
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(user?.name || '');

  if (!user) return null;

  const handleSave = async () => {
    try {
      await updateProfile({ name: editedName });
      setIsEditing(false);
      enqueueSnackbar('Profile updated successfully', { variant: 'success' });
    } catch (error) {
      enqueueSnackbar('Failed to update profile', { variant: 'error' });
    }
  };

  const handleCancel = () => {
    setEditedName(user.name);
    setIsEditing(false);
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Profile
        </Typography>
        
        <Grid container spacing={4}>
          {/* User Info Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                <Avatar
                  sx={{
                    width: 80,
                    height: 80,
                    mr: 2,
                    bgcolor: 'primary.main',
                    fontSize: '2rem',
                  }}
                >
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ flexGrow: 1 }}>
                  {isEditing ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <TextField
                        value={editedName}
                        onChange={(e) => setEditedName(e.target.value)}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ maxWidth: 300 }}
                      />
                      <IconButton onClick={handleSave} color="primary" size="small">
                        <SaveIcon />
                      </IconButton>
                      <IconButton onClick={handleCancel} color="error" size="small">
                        <CancelIcon />
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="h5">{user.name}</Typography>
                      <IconButton onClick={() => setIsEditing(true)} size="small">
                        <EditIcon />
                      </IconButton>
                    </Box>
                  )}
                  <Typography variant="body1" color="text.secondary">
                    {user.email}
                  </Typography>
                  {user.university && (
                    <Typography variant="body2" color="text.secondary">
                      {user.university}
                    </Typography>
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Verification Section */}
          <Grid item xs={12}>
            <UserVerification />
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
};

export default Profile; 