'use client';
// AuthProviderClient - Wrapper client pour AuthProvider
// Ce fichier est le point d'entrée client qui rend le AuthContext Provider

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';

const AuthContext = createContext(null);

// Détecte si Supabase est disponible
const hasSupabase = typeof supabase !== 'undefined' && supabase !== null;

export function AuthProviderClient({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialisation de l'authentification
  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        // Si Supabase est disponible, utiliser Supabase Auth
        if (hasSupabase) {
          const { data: { session } } = await supabase.auth.getSession();
          if (mounted) {
            setUser(session?.user ?? null);
          }
          // Écouter les changements de session
          const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (mounted) {
              setUser(session?.user ?? null);
            }
          });
          return () => subscription.unsubscribe();
        } else {
          // Fallback vers localStorage pour le mode démo
          const savedUser = localStorage.getItem('lenspro_user');
          if (mounted) {
            setUser(savedUser ? JSON.parse(savedUser) : null);
          }
        }
      } catch (error) {
        console.error('Auth init error:', error);
        if (mounted) {
          setUser(null);
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initAuth();

    return () => { mounted = false; };
  }, []);

  const signIn = useCallback(async (email, password) => {
    if (!hasSupabase) {
      // Fallback localStorage
      const userData = { email, role: 'photographer', name: email.split('@')[0] };
      localStorage.setItem('lenspro_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    }
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    setUser(data.user);
    return { success: true, user: data.user };
  }, []);

  const signUp = useCallback(async (email, password, userData) => {
    if (!hasSupabase) {
      // Fallback localStorage
      const newUser = {
        email,
        ...userData,
        role: 'photographer',
        id: crypto.randomUUID ? crypto.randomUUID() : Date.now().toString()
      };
      localStorage.setItem('lenspro_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    }
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: userData.fullName,
          username: userData.username,
          city: userData.city,
          specialty: userData.specialty
        }
      }
    });
    if (error) return { success: false, error: error.message };
    setUser(data.user);
    return { success: true, user: data.user };
  }, []);

  const signOut = useCallback(async () => {
    if (!hasSupabase) {
      localStorage.removeItem('lenspro_user');
      setUser(null);
      return { success: true };
    }
    const { error } = await supabase.auth.signOut();
    if (error) return { success: false, error: error.message };
    setUser(null);
    return { success: true };
  }, []);

  const value = {
    user,
    loading,
    signIn,
    signUp,
    signOut,
    hasSupabase
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// Export aussi pour compatibilité avec le code existant
export const useUser = () => {
  const { user } = useAuth();
  return user;
};

export default AuthContext;
