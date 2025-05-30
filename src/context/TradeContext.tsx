import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { useSnackbar } from 'notistack';

interface TradeItem {
  id: string;
  title: string;
  condition: string;
  imageUrl: string;
  description: string;
  price: number;
  category: string;
  owner: {
    id: string;
    name: string;
    university: string;
    rating: number;
  };
}

interface TradeMessage {
  id: string;
  senderId: string;
  senderName: string;
  message: string;
  createdAt: Date;
}

interface TradeProposal {
  id: string;
  proposedItemId: string;
  requestedItemId: string;
  proposerId: string;
  proposerName: string;
  receiverId: string;
  receiverName: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  messages: TradeMessage[];
  createdAt: Date;
  proposedItem: TradeItem;
  requestedItem: TradeItem;
}

interface TradeContextType {
  proposals: TradeProposal[];
  userItems: TradeItem[];
  loading: boolean;
  error: string | null;
  addProposal: (proposal: Omit<TradeProposal, 'id' | 'status' | 'createdAt' | 'messages'>) => void;
  updateProposalStatus: (proposalId: string, status: TradeProposal['status']) => void;
  getUserProposals: (userId: string) => TradeProposal[];
  addUserItem: (item: Omit<TradeItem, 'id'>) => void;
  removeUserItem: (itemId: string) => void;
  addMessage: (proposalId: string, message: string, senderId: string, senderName: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

const STORAGE_KEY = 'unigoods_trades';

// Mock data for development
const mockUserItems: TradeItem[] = [
  {
    id: 'item1',
    title: 'Chemistry Textbook',
    condition: 'Good',
    imageUrl: 'https://via.placeholder.com/200x300',
    description: 'General Chemistry 2nd Edition',
    price: 1999.00,
    category: 'Textbooks',
    owner: {
      id: 'user1',
      name: 'John Doe',
      university: 'STI College Tagum',
      rating: 4.5,
    },
  },
];

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proposals, setProposals] = useState<TradeProposal[]>([]);
  const [userItems, setUserItems] = useState<TradeItem[]>(mockUserItems);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { enqueueSnackbar } = useSnackbar();

  // Load trades from localStorage on mount
  useEffect(() => {
    const storedTrades = localStorage.getItem(STORAGE_KEY);
    if (storedTrades) {
      try {
        const parsedTrades = JSON.parse(storedTrades);
        setProposals(parsedTrades.map((trade: any) => ({
          ...trade,
          createdAt: new Date(trade.createdAt),
          messages: trade.messages?.map((msg: any) => ({
            ...msg,
            createdAt: new Date(msg.createdAt),
          })) || [],
        })));
      } catch (err) {
        console.error('Error loading trades:', err);
        setError('Failed to load trade proposals');
      }
    }
  }, []);

  // Save trades to localStorage when updated
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(proposals));
  }, [proposals]);

  const addProposal = useCallback(
    (newProposal: Omit<TradeProposal, 'id' | 'status' | 'createdAt' | 'messages'>) => {
      try {
        setLoading(true);
        const proposal: TradeProposal = {
          ...newProposal,
          id: `proposal-${Date.now()}`,
          status: 'pending',
          createdAt: new Date(),
          messages: [{
            id: `msg-${Date.now()}`,
            senderId: newProposal.proposerId,
            senderName: newProposal.proposerName,
            message: newProposal.message,
            createdAt: new Date(),
          }],
        };
        setProposals((prev) => [...prev, proposal]);
        enqueueSnackbar('Trade proposal sent successfully!', { variant: 'success' });
      } catch (err) {
        console.error('Error adding proposal:', err);
        setError('Failed to send trade proposal');
        enqueueSnackbar('Failed to send trade proposal', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const updateProposalStatus = useCallback(
    (proposalId: string, status: TradeProposal['status']) => {
      try {
        setLoading(true);
        setProposals((prev) =>
          prev.map((proposal) =>
            proposal.id === proposalId ? { ...proposal, status } : proposal
          )
        );
        enqueueSnackbar(`Trade proposal ${status}!`, { 
          variant: status === 'accepted' ? 'success' : 
                  status === 'rejected' ? 'error' : 
                  status === 'completed' ? 'success' : 'info' 
        });
      } catch (err) {
        console.error('Error updating proposal status:', err);
        setError('Failed to update trade proposal status');
        enqueueSnackbar('Failed to update trade proposal status', { variant: 'error' });
      } finally {
        setLoading(false);
      }
    },
    [enqueueSnackbar]
  );

  const getUserProposals = useCallback(
    (userId: string) => {
      return proposals.filter(
        (proposal) =>
          proposal.proposerId === userId || proposal.receiverId === userId
      );
    },
    [proposals]
  );

  const addUserItem = useCallback((newItem: Omit<TradeItem, 'id'>) => {
    try {
      setLoading(true);
      const item: TradeItem = {
        ...newItem,
        id: `item-${Date.now()}`,
      };
      setUserItems((prev) => [...prev, item]);
      enqueueSnackbar('Item added successfully!', { variant: 'success' });
    } catch (err) {
      console.error('Error adding item:', err);
      setError('Failed to add item');
      enqueueSnackbar('Failed to add item', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const removeUserItem = useCallback((itemId: string) => {
    try {
      setLoading(true);
      setUserItems((prev) => prev.filter((item) => item.id !== itemId));
      enqueueSnackbar('Item removed successfully!', { variant: 'success' });
    } catch (err) {
      console.error('Error removing item:', err);
      setError('Failed to remove item');
      enqueueSnackbar('Failed to remove item', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const addMessage = useCallback((
    proposalId: string,
    message: string,
    senderId: string,
    senderName: string
  ) => {
    try {
      setLoading(true);
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.id === proposalId
            ? {
                ...proposal,
                messages: [
                  ...proposal.messages,
                  {
                    id: `msg-${Date.now()}`,
                    senderId,
                    senderName,
                    message,
                    createdAt: new Date(),
                  },
                ],
              }
            : proposal
        )
      );
      enqueueSnackbar('Message sent successfully!', { variant: 'success' });
    } catch (err) {
      console.error('Error adding message:', err);
      setError('Failed to send message');
      enqueueSnackbar('Failed to send message', { variant: 'error' });
    } finally {
      setLoading(false);
    }
  }, [enqueueSnackbar]);

  const value = {
    proposals,
    userItems,
    loading,
    error,
    addProposal,
    updateProposalStatus,
    getUserProposals,
    addUserItem,
    removeUserItem,
    addMessage,
  };

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
};

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
};

export default TradeContext; 