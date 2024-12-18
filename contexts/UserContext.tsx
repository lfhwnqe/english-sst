'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { fetchApi } from '@/utils/fetch';

interface UserInfo {
  email: string;
  sub: string;
}

interface UserContextType {
  user: UserInfo | null;
  loading: boolean;
  error: string | null;
  refreshUserInfo: () => Promise<void>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshUserInfo = async () => {
    try {
      const response = await fetchApi('/auth/user-info');
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch user info');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserInfo();
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, error, refreshUserInfo }}>
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
} 