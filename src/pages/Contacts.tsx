import React, { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemSecondaryAction,
  Avatar,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Divider,
  Paper,
  Alert,
  Tooltip,
  Zoom,
  useTheme,
  alpha,
  Grid,
  Card,
  CardContent,
} from '@mui/material';
import {
  Person as PersonIcon,
  Block as BlockIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  LocationOn as LocationIcon,
  Message as MessageIcon,
  Schedule as ScheduleIcon,
  ShoppingBag as ShoppingBagIcon,
} from '@mui/icons-material';
import { useContacts } from '../context/ContactContext';
import { useLocation } from 'react-router-dom';

interface Contact {
  id: string;
  name: string;
  university: string;
  email: string;
  phone: string;
  isBlocked?: boolean;
  avatarUrl?: string;
}

interface LocationState {
  fromCashPayment?: boolean;
  items?: any[];
  total?: number;
  meetupDetails?: {
    location: string;
    time: string;
  };
}

const Contacts: React.FC = () => {
  const theme = useTheme();
  const { contacts = [], addContact, removeContact, blockContact, unblockContact } = useContacts();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [newContact, setNewContact] = useState({
    name: '',
    university: '',
    email: '',
    phone: '',
  });
  const [error, setError] = useState<string | null>(null);
  const location = useLocation();
  const state = location.state as LocationState;

  const handleAddContact = () => {
    if (!newContact.name || !newContact.email || !newContact.university) {
      setError('Name, email, and university are required');
      return;
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(newContact.email)) {
      setError('Please enter a valid email address');
      return;
    }

    addContact(newContact);
    setAddDialogOpen(false);
    setNewContact({
      name: '',
      university: '',
      email: '',
      phone: '',
    });
    setError(null);
  };

  const handleInputChange = (field: keyof typeof newContact) => (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewContact((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    setError(null);
  };

  // Helper function to get avatar text
  const getAvatarText = (name: string) => {
    return name ? name.charAt(0).toUpperCase() : '?';
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        {state?.fromCashPayment && (
          <Paper sx={{ p: 3, mb: 4 }}>
            <Alert severity="info" sx={{ mb: 3 }}>
              Please contact the seller(s) below to arrange the cash payment and meetup.
            </Alert>
            
            <Typography variant="h6" gutterBottom>
              Order Details
            </Typography>
            
            <List>
              {state.items?.map((item) => (
                <ListItem key={item.id}>
                  <ListItemAvatar>
                    <Avatar>
                      <ShoppingBagIcon />
                    </Avatar>
                  </ListItemAvatar>
                  <ListItemText
                    primary={item.title}
                    secondary={`Seller: ${item.seller?.name || 'Xian Dela Cruz'} (${item.seller?.university || 'STI College Tagum'})`}
                  />
                  <ListItemSecondaryAction>
                    <Typography variant="subtitle1">
                      ₱{item.price.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                    </Typography>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </List>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Seller Contact Information
              </Typography>
              <Typography variant="body1">
                Name: Xian Dela Cruz
              </Typography>
              <Typography variant="body1">
                University: STI College Tagum
              </Typography>
              <Typography variant="body1">
                Contact: +63 912 345 6789
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h6">
                Total Amount:
              </Typography>
              <Typography variant="h6" color="primary">
                ₱{(state.total || 0).toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </Typography>
            </Box>
          </Paper>
        )}

        <Typography variant="h4" gutterBottom>
          Contacts
        </Typography>

        <Grid container spacing={3}>
          {contacts?.map((contact) => (
            <Grid item xs={12} sm={6} md={4} key={contact.id}>
              <Card>
                <CardContent>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <Avatar
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.main',
                        fontSize: '1.5rem',
                        mr: 2,
                      }}
                    >
                      {getAvatarText(contact.name)}
                    </Avatar>
                    <Box>
                      <Typography variant="h6">{contact.name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {contact.university}
                      </Typography>
                    </Box>
                  </Box>

                  <List dense>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <PhoneIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Phone"
                        secondary={contact.phone || 'No phone number'}
                      />
                      {contact.phone && (
                        <ListItemSecondaryAction>
                          <IconButton edge="end" color="primary" href={`tel:${contact.phone}`}>
                            <PhoneIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>

                    <ListItem>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          <EmailIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary="Email"
                        secondary={contact.email}
                      />
                      <ListItemSecondaryAction>
                        <IconButton edge="end" color="primary" href={`mailto:${contact.email}`}>
                          <EmailIcon />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Box sx={{ py: 4 }}>
          <Box 
            sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              mb: 4,
              '& h4': {
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 'bold',
              }
            }}
          >
            <Typography variant="h4">
              Contacts
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => setAddDialogOpen(true)}
              sx={{
                borderRadius: 2,
                px: 3,
                py: 1,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: theme.shadows[4],
                },
              }}
            >
              Add Contact
            </Button>
          </Box>

          <Paper 
            elevation={0}
            sx={{ 
              borderRadius: 3,
              overflow: 'hidden',
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              boxShadow: `0 4px 20px ${alpha(theme.palette.common.black, 0.05)}`,
            }}
          >
            {contacts.length === 0 ? (
              <Box 
                sx={{ 
                  p: 6, 
                  textAlign: 'center',
                  background: `linear-gradient(45deg, ${alpha(theme.palette.primary.light, 0.05)}, ${alpha(theme.palette.secondary.light, 0.05)})`,
                }}
              >
                <Typography 
                  color="text.secondary"
                  sx={{
                    fontSize: '1.1rem',
                    fontWeight: 500,
                  }}
                >
                  No contacts yet. Add some contacts to get started!
                </Typography>
              </Box>
            ) : (
              <List sx={{ p: 0 }}>
                {contacts.map((contact, index) => (
                  <React.Fragment key={contact.id}>
                    <ListItem
                      sx={{
                        transition: 'all 0.2s ease-in-out',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.primary.main, 0.05),
                        },
                        py: 2,
                      }}
                    >
                      <ListItemAvatar>
                        <Avatar 
                          src={contact.avatarUrl}
                          sx={{ 
                            width: 50, 
                            height: 50,
                            bgcolor: contact.isBlocked ? 'grey.300' : 'primary.main',
                            transition: 'all 0.2s ease-in-out',
                          }}
                        >
                          <PersonIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Typography 
                            variant="h6" 
                            sx={{ 
                              fontSize: '1.1rem',
                              fontWeight: 600,
                              color: contact.isBlocked ? 'text.disabled' : 'text.primary',
                            }}
                          >
                            {contact.name}
                          </Typography>
                        }
                        secondary={
                          <Box sx={{ mt: 0.5 }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 0.5 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <SchoolIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {contact.university}
                                </Typography>
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                <Typography variant="body2" color="text.secondary">
                                  {contact.email}
                                </Typography>
                              </Box>
                              {contact.phone && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                  <PhoneIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                                  <Typography variant="body2" color="text.secondary">
                                    {contact.phone}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          </Box>
                        }
                      />
                      <ListItemSecondaryAction sx={{ right: 16 }}>
                        <Tooltip 
                          title={contact.isBlocked ? "Unblock Contact" : "Block Contact"}
                          TransitionComponent={Zoom}
                          arrow
                        >
                          <IconButton
                            edge="end"
                            aria-label={contact.isBlocked ? 'unblock' : 'block'}
                            onClick={() =>
                              contact.isBlocked
                                ? unblockContact(contact.id)
                                : blockContact(contact.id)
                            }
                            sx={{ 
                              mr: 1,
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: contact.isBlocked 
                                  ? alpha(theme.palette.success.main, 0.1)
                                  : alpha(theme.palette.error.main, 0.1),
                              }
                            }}
                          >
                            <BlockIcon
                              sx={{
                                color: contact.isBlocked ? theme.palette.error.main : alpha(theme.palette.text.secondary, 0.4),
                                transition: 'all 0.2s ease-in-out',
                              }}
                            />
                          </IconButton>
                        </Tooltip>
                        <Tooltip 
                          title="Remove Contact" 
                          TransitionComponent={Zoom}
                          arrow
                        >
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => removeContact(contact.id)}
                            sx={{
                              transition: 'all 0.2s ease-in-out',
                              '&:hover': {
                                backgroundColor: alpha(theme.palette.error.main, 0.1),
                                '& .MuiSvgIcon-root': {
                                  color: theme.palette.error.main,
                                }
                              }
                            }}
                          >
                            <DeleteIcon sx={{ color: alpha(theme.palette.text.secondary, 0.4) }} />
                          </IconButton>
                        </Tooltip>
                      </ListItemSecondaryAction>
                    </ListItem>
                    {index < contacts.length - 1 && (
                      <Divider sx={{ ml: 9, mr: 2 }} />
                    )}
                  </React.Fragment>
                ))}
              </List>
            )}
          </Paper>
        </Box>

        {/* Add Contact Dialog */}
        <Dialog
          open={addDialogOpen}
          onClose={() => {
            setAddDialogOpen(false);
            setError(null);
          }}
          maxWidth="sm"
          fullWidth
          PaperProps={{
            sx: {
              borderRadius: 3,
              p: 1,
            }
          }}
        >
          <DialogTitle sx={{ 
            pb: 1,
            '& .MuiTypography-root': {
              fontSize: '1.5rem',
              fontWeight: 600,
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
            }
          }}>
            Add New Contact
          </DialogTitle>
          <DialogContent>
            {error && (
              <Alert 
                severity="error" 
                sx={{ 
                  mb: 2,
                  borderRadius: 2,
                }}
              >
                {error}
              </Alert>
            )}
            <Box sx={{ pt: 1 }}>
              <TextField
                autoFocus
                margin="dense"
                label="Name"
                fullWidth
                value={newContact.name}
                onChange={handleInputChange('name')}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <PersonIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                margin="dense"
                label="University"
                fullWidth
                value={newContact.university}
                onChange={handleInputChange('university')}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <SchoolIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                margin="dense"
                label="Email"
                type="email"
                fullWidth
                value={newContact.email}
                onChange={handleInputChange('email')}
                required
                sx={{ mb: 2 }}
                InputProps={{
                  startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
              <TextField
                margin="dense"
                label="Phone (optional)"
                fullWidth
                value={newContact.phone}
                onChange={handleInputChange('phone')}
                InputProps={{
                  startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />,
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 2 }}>
            <Button 
              onClick={() => setAddDialogOpen(false)}
              sx={{ 
                borderRadius: 2,
                px: 3,
                color: 'text.secondary',
                '&:hover': {
                  backgroundColor: alpha(theme.palette.text.secondary, 0.05),
                }
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddContact}
              variant="contained"
              startIcon={<CheckIcon />}
              sx={{
                borderRadius: 2,
                px: 3,
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                transition: 'all 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-1px)',
                  boxShadow: theme.shadows[2],
                }
              }}
            >
              Add Contact
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </Container>
  );
};

export default Contacts; 