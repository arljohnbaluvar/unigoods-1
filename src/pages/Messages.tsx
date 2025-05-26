import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Paper,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Divider,
  TextField,
  IconButton,
  Box,
  Badge,
  Alert,
  Snackbar,
  Button,
} from '@mui/material';
import {
  Send as SendIcon,
  Person as PersonIcon,
  PersonAdd as PersonAddIcon,
} from '@mui/icons-material';
import { useMessage } from '../context/MessageContext';
import { format, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const Messages: React.FC = () => {
  const { conversations, sendMessage, getConversation, markAsRead } = useMessage();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (selectedConversation) {
      const messages = getConversation(selectedConversation);
      messages.forEach(msg => {
        if (!msg.read && msg.senderId === selectedConversation) {
          markAsRead(msg.id);
        }
      });
    }
  }, [selectedConversation, getConversation, markAsRead]);

  const handleSendMessage = () => {
    try {
      if (selectedConversation && newMessage.trim()) {
        sendMessage(selectedConversation, newMessage.trim());
        setNewMessage('');
      }
    } catch (err) {
      setError('Failed to send message. Please try again.');
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const currentMessages = selectedConversation ? getConversation(selectedConversation) : [];

  const formatMessageDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'p');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  const formatConversationDate = (dateString: string) => {
    try {
      const date = parseISO(dateString);
      return format(date, 'PPp');
    } catch (err) {
      console.error('Error formatting date:', err);
      return dateString;
    }
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4">
            Messages
          </Typography>
          <Button
            variant="contained"
            startIcon={<PersonAddIcon />}
            onClick={() => navigate('/find-users')}
          >
            Find Users
          </Button>
        </Box>
        <Grid container spacing={3}>
          {/* Conversations List */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '70vh', overflow: 'auto' }}>
              <List>
                {conversations.length === 0 ? (
                  <ListItem>
                    <ListItemText 
                      primary="No conversations yet"
                      secondary="Start messaging someone to begin a conversation"
                    />
                  </ListItem>
                ) : (
                  conversations.map((conversation) => (
                    <React.Fragment key={conversation.id}>
                      <ListItem
                        button
                        selected={selectedConversation === conversation.participantId}
                        onClick={() => setSelectedConversation(conversation.participantId)}
                      >
                        <ListItemAvatar>
                          <Badge
                            badgeContent={conversation.unreadCount}
                            color="primary"
                            invisible={conversation.unreadCount === 0}
                          >
                            <Avatar>
                              <PersonIcon />
                            </Avatar>
                          </Badge>
                        </ListItemAvatar>
                        <ListItemText
                          primary={conversation.participantName}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.primary"
                                sx={{
                                  display: 'inline',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                  whiteSpace: 'nowrap',
                                  maxWidth: '150px'
                                }}
                              >
                                {conversation.lastMessage}
                              </Typography>
                              <Typography
                                component="span"
                                variant="caption"
                                color="text.secondary"
                                sx={{ display: 'block' }}
                              >
                                {formatConversationDate(conversation.lastMessageTime)}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      <Divider />
                    </React.Fragment>
                  ))
                )}
              </List>
            </Paper>
          </Grid>

          {/* Chat Area */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '70vh', display: 'flex', flexDirection: 'column' }}>
              {selectedConversation ? (
                <>
                  {/* Messages */}
                  <Box sx={{ flexGrow: 1, overflow: 'auto', p: 2 }}>
                    {currentMessages.length === 0 ? (
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          height: '100%'
                        }}
                      >
                        <Typography variant="body1" color="text.secondary">
                          No messages yet. Start the conversation!
                        </Typography>
                      </Box>
                    ) : (
                      currentMessages.map((message) => (
                        <Box
                          key={message.id}
                          sx={{
                            display: 'flex',
                            justifyContent: message.senderId === 'user1' ? 'flex-end' : 'flex-start',
                            mb: 2
                          }}
                        >
                          <Paper
                            sx={{
                              p: 2,
                              backgroundColor: message.senderId === 'user1' ? 'primary.main' : 'grey.100',
                              color: message.senderId === 'user1' ? 'white' : 'inherit',
                              maxWidth: '70%'
                            }}
                          >
                            <Typography variant="body1">
                              {message.content}
                            </Typography>
                            <Typography
                              variant="caption"
                              sx={{
                                display: 'block',
                                textAlign: message.senderId === 'user1' ? 'right' : 'left',
                                mt: 1
                              }}
                            >
                              {formatMessageDate(message.timestamp)}
                            </Typography>
                          </Paper>
                        </Box>
                      ))
                    )}
                  </Box>

                  {/* Message Input */}
                  <Box sx={{ p: 2, backgroundColor: 'background.default' }}>
                    <Grid container spacing={2}>
                      <Grid item xs>
                        <TextField
                          fullWidth
                          multiline
                          maxRows={4}
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item>
                        <IconButton
                          color="primary"
                          onClick={handleSendMessage}
                          disabled={!newMessage.trim()}
                        >
                          <SendIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  </Box>
                </>
              ) : (
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '100%'
                  }}
                >
                  <Typography variant="h6" color="text.secondary">
                    Select a conversation to start messaging
                  </Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Box>

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

export default Messages; 