import React, { useState } from 'react';
import {
  Container,
  Box,
  TextField,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Avatar,
  IconButton,
  Paper,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Snackbar,
  Alert,
  Divider,
} from '@mui/material';
import {
  Search as SearchIcon,
  Message as MessageIcon,
  Person as PersonIcon,
  School as SchoolIcon,
} from '@mui/icons-material';
import { useMessage } from '../context/MessageContext';
import { useNavigate } from 'react-router-dom';

// Mock users data - replace with API call
const mockUsers = [
  {
    id: 'user1',
    name: 'Sarah Chen',
    university: 'State University',
    avatar: '',
    joinedDate: '2023',
    major: 'Computer Science',
    year: 'Junior'
  },
  {
    id: 'user2',
    name: 'James Wilson',
    university: 'Tech Institute',
    avatar: '',
    joinedDate: '2023',
    major: 'Mechanical Engineering',
    year: 'Senior'
  },
  {
    id: 'user3',
    name: 'Maria Garcia',
    university: 'City College',
    avatar: '',
    joinedDate: '2024',
    major: 'Business Administration',
    year: 'Sophomore'
  },
  {
    id: 'user4',
    name: 'David Kim',
    university: 'State University',
    avatar: '',
    joinedDate: '2024',
    major: 'Biology',
    year: 'Freshman'
  },
  {
    id: 'user5',
    name: 'Emily Johnson',
    university: 'Tech Institute',
    avatar: '',
    joinedDate: '2023',
    major: 'Physics',
    year: 'Senior'
  },
  {
    id: 'user6',
    name: 'Michael Patel',
    university: 'City College',
    avatar: '',
    joinedDate: '2024',
    major: 'Psychology',
    year: 'Junior'
  }
];

const FindUsers: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [messageDialogOpen, setMessageDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<typeof mockUsers[0] | null>(null);
  const [messageContent, setMessageContent] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const { sendMessage } = useMessage();
  const navigate = useNavigate();

  const filteredUsers = mockUsers.filter(user =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.university.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.major.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleMessageClick = (user: typeof mockUsers[0]) => {
    setSelectedUser(user);
    setMessageDialogOpen(true);
  };

  const handleSendMessage = () => {
    try {
      if (selectedUser && messageContent.trim()) {
        sendMessage(selectedUser.id, messageContent.trim());
        setMessageDialogOpen(false);
        setMessageContent('');
        setSelectedUser(null);
        setSuccess(true);
        navigate('/messages');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
          Find Users
        </Typography>

        <Paper sx={{ p: 2, mb: 3 }}>
          <TextField
            fullWidth
            placeholder="Search users by name, university, or major..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
          />
        </Paper>

        <Paper>
          <List>
            {filteredUsers.length === 0 ? (
              <ListItem>
                <ListItemText
                  primary="No users found"
                  secondary="Try a different search term"
                />
              </ListItem>
            ) : (
              filteredUsers.map((user, index) => (
                <React.Fragment key={user.id}>
                  <ListItem
                    secondaryAction={
                      <IconButton
                        edge="end"
                        aria-label="message"
                        onClick={() => handleMessageClick(user)}
                      >
                        <MessageIcon />
                      </IconButton>
                    }
                  >
                    <ListItemAvatar>
                      <Avatar>
                        {user.name.charAt(0)}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={user.name}
                      secondary={
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <SchoolIcon fontSize="small" />
                            <Typography variant="body2">
                              {user.university}
                            </Typography>
                          </Box>
                          <Typography variant="body2" color="text.secondary">
                            {user.major} • {user.year}
                          </Typography>
                        </Box>
                      }
                    />
                  </ListItem>
                  {index < filteredUsers.length - 1 && <Divider />}
                </React.Fragment>
              ))
            )}
          </List>
        </Paper>
      </Box>

      {/* Message Dialog */}
      <Dialog
        open={messageDialogOpen}
        onClose={() => setMessageDialogOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Message {selectedUser?.name}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            multiline
            rows={4}
            variant="outlined"
            label="Your message"
            fullWidth
            value={messageContent}
            onChange={(e) => setMessageContent(e.target.value)}
            sx={{ mt: 2 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setMessageDialogOpen(false)}>Cancel</Button>
          <Button
            onClick={handleSendMessage}
            variant="contained"
            disabled={!messageContent.trim()}
          >
            Send Message
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={success}
        autoHideDuration={3000}
        onClose={() => setSuccess(false)}
        message="Message sent successfully"
      />

      {/* Error Snackbar */}
      <Snackbar
        open={!!error}
        autoHideDuration={6000}
        onClose={() => setError(null)}
      >
        <Alert onClose={() => setError(null)} severity="error">
          {error}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default FindUsers; 