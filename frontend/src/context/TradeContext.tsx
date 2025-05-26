import React, { createContext, useContext, useState } from 'react';

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
  proposedItemId: string;
  requestedItemId: string;
  proposerId: string;
  receiverId: string;
  message: string;
  proposedItem: TradeItem;
  requestedItem: TradeItem;
}

interface TradeContextType {
  userItems: TradeItem[];
  proposals: TradeProposal[];
  addProposal: (proposal: TradeProposal) => void;
  removeProposal: (proposalId: string) => void;
  acceptProposal: (proposalId: string) => void;
  rejectProposal: (proposalId: string) => void;
}

const TradeContext = createContext<TradeContextType | undefined>(undefined);

// Mock user items (replace with API call later)
const mockUserItems: TradeItem[] = [
  {
    id: 'user-item-1',
    title: 'Physics Textbook',
    condition: 'Good',
    imageUrl: 'https://via.placeholder.com/200x300',
    description: 'University Physics with Modern Physics, 15th Edition',
    owner: {
      id: 'user1',
      name: 'Current User',
      university: 'State University',
    },
  },
  {
    id: 'user-item-2',
    title: 'Scientific Calculator',
    condition: 'Like New',
    imageUrl: 'https://via.placeholder.com/200x300',
    description: 'TI-84 Plus CE Graphing Calculator',
    owner: {
      id: 'user1',
      name: 'Current User',
      university: 'State University',
    },
  },
];

export const TradeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userItems] = useState<TradeItem[]>(mockUserItems);
  const [proposals, setProposals] = useState<TradeProposal[]>([]);

  const addProposal = (proposal: TradeProposal) => {
    setProposals((prev) => [...prev, proposal]);
  };

  const removeProposal = (proposalId: string) => {
    setProposals((prev) =>
      prev.filter(
        (p) =>
          !(p.proposedItemId === proposalId || p.requestedItemId === proposalId)
      )
    );
  };

  const acceptProposal = (proposalId: string) => {
    // TODO: Implement trade acceptance logic
    console.log('Accepting proposal:', proposalId);
  };

  const rejectProposal = (proposalId: string) => {
    // TODO: Implement trade rejection logic
    console.log('Rejecting proposal:', proposalId);
  };

  return (
    <TradeContext.Provider
      value={{
        userItems,
        proposals,
        addProposal,
        removeProposal,
        acceptProposal,
        rejectProposal,
      }}
    >
      {children}
    </TradeContext.Provider>
  );
};

export const useTradeContext = () => {
  const context = useContext(TradeContext);
  if (context === undefined) {
    throw new Error('useTradeContext must be used within a TradeProvider');
  }
  return context;
}; 