import React, { createContext, useContext, useState, useCallback } from 'react';

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string;
  read: boolean;
  senderName: string;
}

interface Conversation {
  id: string;
  participantId: string;
  participantName: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

interface MessageContextType {
  messages: Message[];
  conversations: Conversation[];
  sendMessage: (receiverId: string, content: string) => void;
  markAsRead: (messageId: string) => void;
  getConversation: (participantId: string) => Message[];
  getUnreadCount: () => number;
}

const MessageContext = createContext<MessageContextType | undefined>(undefined);

export const MessageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);

  // Mock current user - replace with actual auth user
  const currentUser = {
    id: 'user1',
    name: 'Current User'
  };

  const sendMessage = useCallback((receiverId: string, content: string) => {
    const now = new Date().toISOString();
    const newMessage: Message = {
      id: `msg_${Date.now()}`,
      senderId: currentUser.id,
      receiverId,
      content,
      timestamp: now,
      read: false,
      senderName: currentUser.name
    };

    setMessages(prev => [...prev, newMessage]);
    updateConversations(newMessage);
  }, []);

  const updateConversations = (message: Message) => {
    const otherParticipant = message.senderId === currentUser.id ? message.receiverId : message.senderId;
    const otherParticipantName = message.senderId === currentUser.id ? "Recipient" : message.senderName;

    setConversations(prev => {
      const existingConversation = prev.find(c => c.participantId === otherParticipant);
      
      if (existingConversation) {
        return prev.map(c => 
          c.participantId === otherParticipant
            ? {
                ...c,
                lastMessage: message.content,
                lastMessageTime: message.timestamp,
                unreadCount: c.unreadCount + (message.senderId !== currentUser.id && !message.read ? 1 : 0)
              }
            : c
        );
      }

      return [...prev, {
        id: `conv_${Date.now()}`,
        participantId: otherParticipant,
        participantName: otherParticipantName,
        lastMessage: message.content,
        lastMessageTime: message.timestamp,
        unreadCount: message.senderId !== currentUser.id ? 1 : 0
      }];
    });
  };

  const markAsRead = useCallback((messageId: string) => {
    setMessages(prev => 
      prev.map(msg => 
        msg.id === messageId ? { ...msg, read: true } : msg
      )
    );

    // Update conversation unread count
    setConversations(prev =>
      prev.map(conv => ({
        ...conv,
        unreadCount: messages
          .filter(msg => 
            msg.senderId === conv.participantId && 
            !msg.read
          ).length
      }))
    );
  }, [messages]);

  const getConversation = useCallback((participantId: string) => {
    return messages.filter(msg => 
      msg.senderId === participantId || msg.receiverId === participantId
    ).sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  }, [messages]);

  const getUnreadCount = useCallback(() => {
    return messages.filter(msg => !msg.read && msg.senderId !== currentUser.id).length;
  }, [messages]);

  return (
    <MessageContext.Provider value={{
      messages,
      conversations,
      sendMessage,
      markAsRead,
      getConversation,
      getUnreadCount
    }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error('useMessage must be used within a MessageProvider');
  }
  return context;
}; 