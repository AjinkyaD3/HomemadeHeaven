import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface User {
  id: string;
  email: string;
  fullName: string;
  role: string;
  avatarUrl?: string;
  isVerified: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, fullName: string) => Promise<void>;
  logout: () => void;
  verifyEmail: (token: string) => Promise<void>;
  forgotPassword: (email: string) => Promise<void>;
  resetPassword: (token: string, newPassword: string) => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  updatePassword: (currentPassword: string, newPassword: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      api.getCurrentUser()
        .then(userData => {
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const { token, user } = await api.login(email, password);
      localStorage.setItem('token', token);
      setUser(user);
      
      if (user.role === 'admin') {
        navigate('/admin');
        toast.success('Welcome back, Admin!');
      } else {
        navigate('/');
        toast.success('Welcome back!');
      }
    } catch (error) {
      toast.error('Invalid credentials');
      throw error;
    }
  };

  const register = async (email: string, password: string, fullName: string) => {
    try {
      setError(null);
      await api.register(email, password, fullName);
      // After registration, log the user in
      await login(email, password);
      toast.success('Registration successful');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during registration');
      toast.error('Failed to register');
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    navigate('/login');
    toast.success('Logged out successfully');
  };

  const verifyEmail = async (token: string) => {
    try {
      setError(null);
      await api.verifyEmail(token);
      toast.success('Email verified successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during email verification');
      toast.error('Failed to verify email');
      throw err;
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      setError(null);
      await api.forgotPassword(email);
      toast.success('Password reset instructions sent to your email');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during password reset request');
      toast.error('Failed to send password reset instructions');
      throw err;
    }
  };

  const resetPassword = async (token: string, newPassword: string) => {
    try {
      setError(null);
      await api.resetPassword(token, newPassword);
      toast.success('Password reset successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred during password reset');
      toast.error('Failed to reset password');
      throw err;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      setError(null);
      const updatedUser = await api.updateProfile(data);
      setUser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success('Profile updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating profile');
      toast.error('Failed to update profile');
      throw err;
    }
  };

  const updatePassword = async (currentPassword: string, newPassword: string) => {
    try {
      setError(null);
      await api.updatePassword(currentPassword, newPassword);
      toast.success('Password updated successfully');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while updating password');
      toast.error('Failed to update password');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        error,
        login,
        register,
        logout,
        verifyEmail,
        forgotPassword,
        resetPassword,
        updateProfile,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;