
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Session, User } from '@supabase/supabase-js';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AuthContextType = {
  session: Session | null;
  user: User | null;
  signIn: (email: string, password: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signUp: (email: string, password: string, fullName: string, role?: string) => Promise<{
    error: Error | null;
    data: { user: User | null; session: Session | null } | null;
  }>;
  signOut: () => Promise<{ error: Error | null }>;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Set up auth state listener first
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        setLoading(false);
      }
    );

    // Check for existing session
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    return response;
  };

  const signUp = async (email: string, password: string, fullName: string, role: string = 'user') => {
    setLoading(true);
    console.log('Signing up with role:', role); // Debug log
    
    // First, create the user account
    const response = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          requested_role: role, // Store the requested role in user metadata
        },
      },
    });
    
    // If signup is successful and we have a user, add their role to the user_roles table
    if (response.data.user && !response.error) {
      const userId = response.data.user.id;
      console.log('User created with ID:', userId); // Debug log
      
      // Insert the role into user_roles table
      const { error: roleError } = await supabase
        .from('user_roles')
        .insert([{ 
          user_id: userId, 
          role: role === 'farmer' ? 'farmer' : 'user' // Only allow 'farmer' or 'user' roles
        }]);
      
      if (roleError) {
        console.error('Error setting user role:', roleError);
        toast.error('Account created but role assignment failed. Please contact support.');
        // We don't throw this error because the account was created successfully
        // But we log it for debugging purposes
      } else {
        console.log('User role set successfully to:', role); // Debug log
      }
    }
    
    setLoading(false);
    return response;
  };

  const signOut = async () => {
    setLoading(true);
    const response = await supabase.auth.signOut();
    if (!response.error) {
      navigate('/auth');
    }
    setLoading(false);
    return response;
  };

  return (
    <AuthContext.Provider value={{ session, user, signIn, signUp, signOut, loading }}>
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
