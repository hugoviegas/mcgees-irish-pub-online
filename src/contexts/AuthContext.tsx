
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  session: Session | null;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('AuthProvider: Setting up auth state listener...');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        console.log('AuthProvider: Auth state changed:', event, !!session?.user);
        setSession(session);
        setUser(session?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('AuthProvider: Initial session check:', !!session?.user);
      setSession(session);
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      console.log('AuthProvider: Cleaning up auth state listener');
      subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ error?: string }> => {
    try {
      setLoading(true);
      console.log('AuthProvider: Attempting login for:', email);
      
      // Input validation
      if (!email || !password) {
        return { error: 'Email and password are required' };
      }
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      
      if (error) {
        console.error('AuthProvider: Login error:', error);
        
        // Provide user-friendly error messages
        if (error.message.includes('Invalid login credentials')) {
          return { error: 'Invalid email or password' };
        } else if (error.message.includes('Email not confirmed')) {
          return { error: 'Please check your email and confirm your account' };
        } else if (error.message.includes('Too many requests')) {
          return { error: 'Too many login attempts. Please try again later.' };
        }
        
        return { error: error.message };
      }
      
      console.log('AuthProvider: Login successful:', !!data.user);
      // Session will be updated automatically via onAuthStateChange
      return {};
    } catch (err) {
      console.error('AuthProvider: Login error:', err);
      return { error: 'An unexpected error occurred. Please try again.' };
    } finally {
      setLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    try {
      setLoading(true);
      console.log('AuthProvider: Attempting logout...');
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('AuthProvider: Logout error:', error);
      } else {
        console.log('AuthProvider: Logout successful');
      }
    } catch (err) {
      console.error('AuthProvider: Logout error:', err);
    } finally {
      setLoading(false);
    }
  };

  const isAuthenticated = !!session?.user;

  console.log('AuthProvider: Current auth state:', { 
    isAuthenticated, 
    hasUser: !!user, 
    hasSession: !!session, 
    loading 
  });

  return (
    <AuthContext.Provider value={{ 
      isAuthenticated, 
      user, 
      session, 
      login, 
      logout, 
      loading 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
