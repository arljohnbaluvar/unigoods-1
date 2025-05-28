import React, { createContext, useContext, useState, useCallback } from 'react';

interface Contact {
  id: string;
  name: string;
  university: string;
  email: string;
  phone?: string;
  avatarUrl?: string;
  isBlocked: boolean;
}

interface ContactContextType {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'id' | 'isBlocked'>) => void;
  removeContact: (contactId: string) => void;
  blockContact: (contactId: string) => void;
  unblockContact: (contactId: string) => void;
}

const ContactContext = createContext<ContactContextType | undefined>(undefined);

export const ContactProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [contacts, setContacts] = useState<Contact[]>([
    // Mock data - replace with API call later
    {
      id: 'user1',
      name: 'John Doe',
      university: 'State University',
      email: 'john.doe@university.edu',
      phone: '123-456-7890',
      avatarUrl: 'https://via.placeholder.com/40',
      isBlocked: false,
    },
    {
      id: 'user2',
      name: 'Jane Smith',
      university: 'Tech University',
      email: 'jane.smith@techu.edu',
      isBlocked: false,
    },
  ]);

  const addContact = useCallback((newContact: Omit<Contact, 'id' | 'isBlocked'>) => {
    setContacts(prev => [
      ...prev,
      {
        ...newContact,
        id: `contact_${Date.now()}`,
        isBlocked: false,
      }
    ]);
  }, []);

  const removeContact = useCallback((contactId: string) => {
    setContacts(prev => prev.filter(contact => contact.id !== contactId));
  }, []);

  const blockContact = useCallback((contactId: string) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId
        ? { ...contact, isBlocked: true }
        : contact
    ));
  }, []);

  const unblockContact = useCallback((contactId: string) => {
    setContacts(prev => prev.map(contact =>
      contact.id === contactId
        ? { ...contact, isBlocked: false }
        : contact
    ));
  }, []);

  return (
    <ContactContext.Provider value={{
      contacts,
      addContact,
      removeContact,
      blockContact,
      unblockContact,
    }}>
      {children}
    </ContactContext.Provider>
  );
};

export const useContacts = () => {
  const context = useContext(ContactContext);
  if (context === undefined) {
    throw new Error('useContacts must be used within a ContactProvider');
  }
  return context;
}; 