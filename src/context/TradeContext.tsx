import React, { createContext, useContext, useState, useCallback } from 'react';

interface TradeItem {
  id: string;
  title: string;
  condition: string;
  imageUrl: string;
  description: string;
  owner: {
    id: string;
    name: string;
    university: string;
  };
}

interface TradeProposal {
  id: string;
  proposedItemId: string;
  requestedItemId: string;
  proposerId: string;
  receiverId: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
  message: string;
  createdAt: Date;
  proposedItem: TradeItem;
  requestedItem: TradeItem;
}

interface TradeContextType {
  proposals: TradeProposal[];
  userItems: TradeItem[];
  addProposal: (proposal: Omit<TradeProposal, 'id' | 'status' | 'createdAt'>) => void;
  updateProposalStatus: (proposalId: string, status: TradeProposal['status']) => void;
  getUserProposals: (userId: string) => TradeProposal[];
  addUserItem: (item: Omit<TradeItem, 'id'>) => void;
  removeUserItem: (itemId: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

// Mock data for development
const mockUserItems: TradeItem[] = [
  {
    id: 'item1',
    title: 'Chemistry Textbook',
    condition: 'Good',
    imageUrl: 'https://via.placeholder.com/200x300',
    description: 'General Chemistry 2nd Edition',
    owner: {
      id: 'user1',
      name: 'John Doe',
      university: 'State University',
    },
  },
];

const mockProposals: TradeProposal[] = [];

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
};

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [proposals, setProposals] = useState<TradeProposal[]>(mockProposals);
  const [userItems, setUserItems] = useState<TradeItem[]>(mockUserItems);

  const addProposal = useCallback(
    (newProposal: Omit<TradeProposal, 'id' | 'status' | 'createdAt'>) => {
      const proposal: TradeProposal = {
        ...newProposal,
        id: `proposal-${Date.now()}`,
        status: 'pending',
        createdAt: new Date(),
      };
      setProposals((prev) => [...prev, proposal]);
    },
    []
  );

  const updateProposalStatus = useCallback(
    (proposalId: string, status: TradeProposal['status']) => {
      setProposals((prev) =>
        prev.map((proposal) =>
          proposal.id === proposalId ? { ...proposal, status } : proposal
        )
      );
    },
    []
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
    const item: TradeItem = {
      ...newItem,
      id: `item-${Date.now()}`,
    };
    setUserItems((prev) => [...prev, item]);
  }, []);

  const removeUserItem = useCallback((itemId: string) => {
    setUserItems((prev) => prev.filter((item) => item.id !== itemId));
  }, []);

  const value = {
    proposals,
    userItems,
    addProposal,
    updateProposalStatus,
    getUserProposals,
    addUserItem,
    removeUserItem,
  };

  return <TradeContext.Provider value={value}>{children}</TradeContext.Provider>;
};

export default TradeContext; 