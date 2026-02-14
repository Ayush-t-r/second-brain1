import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import toast from 'react-hot-toast';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate checking for existing auth token
    const checkAuth = () => {
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user exists in localStorage
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (foundUser) {
        const userData: User = {
          _id: foundUser._id,
          email: foundUser.email,
          name: foundUser.name,
          createdAt: foundUser.createdAt
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Logged in successfully!');
        return true;
      } else {
        toast.error('Invalid email or password');
        return false;
      }
    } catch (error) {
      toast.error('Login failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string, password: string): Promise<boolean> => {
    try {
      setLoading(true);
      
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Check if user already exists
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const existingUser = users.find((u: any) => u.email === email);
      
      if (existingUser) {
        toast.error('User with this email already exists');
        return false;
      }
      
      // Create new user
      const newUser = {
        _id: Date.now().toString(),
        email,
        name,
        password, // In real app, this would be hashed
        createdAt: new Date().toISOString()
      };
      
      users.push(newUser);
      localStorage.setItem('users', JSON.stringify(users));
      
      const userData: User = {
        _id: newUser._id,
        email: newUser.email,
        name: newUser.name,
        createdAt: newUser.createdAt
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      toast.success('Account created successfully!');
      return true;
    } catch (error) {
      toast.error('Signup failed. Please try again.');
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully!');
  };

  const value: AuthContextType = {
    user,
    login,
    signup,
    logout,
    loading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};