import React, { createContext, useContext, useState, useEffect } from 'react';
import { Profile, UserRole } from '../types';
import { dataStore } from '../lib/dataStore';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
  currentUser: Profile | null;
  currentRole: UserRole;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signUp: (data: { full_name: string; email: string; phone?: string; password: string }) => Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }>;
  logout: () => void;
  updateUserRole: (userId: string, newRole: UserRole, specialty?: string) => Promise<{ success: boolean; error?: string }>;
  updateCurrentUserProfile: (updates: Partial<Profile>) => Promise<{ success: boolean; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

async function loadAuthenticatedProfile(userId: string, email?: string): Promise<Profile | null> {
  const { data: profileById } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .maybeSingle();
  if (profileById) return profileById as Profile;

  if (email) {
    const { data: profileByEmail } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email)
      .maybeSingle();
    if (profileByEmail) return profileByEmail as Profile;
  }

  return null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    let active = true;
    supabase.auth.getSession().then(async ({ data }) => {
      const user = data.session?.user;
      const profile = user ? await loadAuthenticatedProfile(user.id, user.email) : null;
      if (active) {
        setCurrentUser(profile);
        setIsLoading(false);
      }
    }).catch(() => {
      if (active) setIsLoading(false);
    });

    const { data: authListener } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const user = session?.user;
      if (!user) {
        if (active) setCurrentUser(null);
        return;
      }
      Promise.resolve().then(() => loadAuthenticatedProfile(user.id, user.email)).then(profile => {
        if (active) setCurrentUser(profile);
      });
    });

    return () => {
      active = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password,
      });
      if (error) throw error;
      if (!data.user) throw new Error('No se pudo validar la cuenta.');

      let profile = await loadAuthenticatedProfile(data.user.id, data.user.email);
      if (!profile && data.user.email) {
        const newClientProfile: Profile = {
          id: data.user.id,
          full_name: data.user.user_metadata?.full_name || data.user.email.split('@')[0],
          email: data.user.email,
          role: 'CLIENT',
          is_active: true,
        };
        const { error: profileError } = await supabase.from('profiles').insert(newClientProfile);
        if (!profileError) profile = newClientProfile;
      }
      if (!profile || !profile.is_active) {
        await supabase.auth.signOut();
        throw new Error('La cuenta no tiene un perfil activo en SalonGlitt.');
      }

      setCurrentUser(profile);
      setIsLoading(false);
      return { success: true };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Error al iniciar sesión' };
    }
  };

  const signUp = async (data: { full_name: string; email: string; phone?: string; password: string }): Promise<{ success: boolean; error?: string; needsEmailConfirmation?: boolean }> => {
    setIsLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email.trim().toLowerCase(),
        password: data.password,
        options: { data: { full_name: data.full_name.trim() } },
      });
      if (authError) throw authError;
      if (!authData.user) throw new Error('No se pudo crear la cuenta.');

      const newProfile: Profile = {
        id: authData.user.id,
        full_name: data.full_name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone,
        role: 'CLIENT',
        is_active: true,
      };
      if (authData.session) {
        const { error: profileError } = await supabase.from('profiles').insert(newProfile);
        if (profileError) throw profileError;
      }
      setCurrentUser(authData.session ? newProfile : null);
      setIsLoading(false);
      return { success: true, needsEmailConfirmation: !authData.session };
    } catch (e: any) {
      setIsLoading(false);
      return { success: false, error: e.message || 'Error al registrar usuario' };
    }
  };

  const logout = () => {
    setCurrentUser(null);
    supabase.auth.signOut().catch(() => {});
  };

  const updateUserRole = async (userId: string, newRole: UserRole, specialty?: string): Promise<{ success: boolean; error?: string }> => {
    if (currentUser?.role !== 'ADMIN') {
      return { success: false, error: 'Solo un administrador puede modificar roles.' };
    }
    try {
      const updated = await dataStore.updateProfileRole(userId, newRole, specialty);
      if (!updated) {
        return { success: false, error: 'Usuario no encontrado' };
      }
      if (currentUser && currentUser.id === userId) {
        setCurrentUser({ ...updated });
      }
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error al actualizar rol' };
    }
  };

  const updateCurrentUserProfile = async (updates: Partial<Profile>): Promise<{ success: boolean; error?: string }> => {
    if (!currentUser) return { success: false, error: 'No hay usuario autenticado' };
    try {
      const updated = dataStore.updateProfile(currentUser.id, updates);
      if (updated) {
        setCurrentUser({ ...updated });
        return { success: true };
      }
      return { success: false, error: 'No se pudo actualizar el perfil' };
    } catch (e: any) {
      return { success: false, error: e.message || 'Error al actualizar perfil' };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        currentRole: currentUser?.role || 'CLIENT',
        isAuthenticated: !!currentUser,
        isLoading,
        login,
        signUp,
        logout,
        updateUserRole,
        updateCurrentUserProfile,
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
