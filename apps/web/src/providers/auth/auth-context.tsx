import React, { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { IStore } from '@repo/shared';

interface AuthContextType {
  currentStore?: IStore;
  setCurrentStore: (store: IStore) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: PropsWithChildren) => {
  const [currentStore, setCurrentStore] = useState<IStore>();

  // Load user's last selected store from localStorage on mount
  useEffect(() => {
    const savedStore = localStorage.getItem('currentStore');
    if (savedStore) {
      setCurrentStore(JSON.parse(savedStore));
    }
  }, []);

  const handleSetCurrentStore = (store: IStore) => {
    setCurrentStore(store);
    localStorage.setItem('currentStore', JSON.stringify(store));
  };

  return (
    <AuthContext.Provider
      value={{
        currentStore,
        setCurrentStore: handleSetCurrentStore,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
