import React, { createContext, useContext, useState, useEffect } from 'react';

export interface User {
  id: string;
  email: string;
  name: string;
  password?: string;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  signup: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  error: string | null;
  isLoading: boolean;
}

const AuthContext = createContext<AuthState | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('dashboard_current_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (user) {
      localStorage.setItem('dashboard_current_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('dashboard_current_user');
    }
  }, [user]);

  const getUsers = (): User[] => {
    const saved = localStorage.getItem('dashboard_users');
    return saved ? JSON.parse(saved) : [];
  };

  const saveUser = (newUser: User) => {
    const users = getUsers();
    localStorage.setItem('dashboard_users', JSON.stringify([...users, newUser]));
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        if (users.find(u => u.email === email)) {
          setError('User with this email already exists.');
          setIsLoading(false);
          resolve(false);
          return;
        }

        const newUser: User = {
          id: crypto.randomUUID(),
          email,
          name,
          password // In a real app, this would be hashed
        };

        saveUser(newUser);
        const { password: _, ...userSafe } = newUser;
        setUser(userSafe);
        setIsLoading(false);
        resolve(true);
      }, 800);
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);
    return new Promise((resolve) => {
      setTimeout(() => {
        const users = getUsers();
        const foundUser = users.find(u => u.email === email && u.password === password);

        if (foundUser) {
          const { password: _, ...userSafe } = foundUser;
          setUser(userSafe);
          setIsLoading(false);
          resolve(true);
        } else {
          setError('Invalid email or password.');
          setIsLoading(false);
          resolve(false);
        }
      }, 800);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      login,
      signup,
      logout,
      error,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
