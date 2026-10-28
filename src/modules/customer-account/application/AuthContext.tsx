'use client';

import React, {createContext, useContext, useEffect, useState, useCallback, useRef} from 'react';
import type {
  CustomerProfileData,
  PublicAccountProfile,
  RegistrationRequest,
  RegistrationResponse,
  SignInResponse,
} from '../domain/account.types';
import {CustomerAccountService} from './customerAccountService';
import {AuthModalProvider} from './AuthModalContext';
import {ACCOUNT_UNAUTHORIZED_EVENT} from './account-request';

interface AuthContextType {
  user: PublicAccountProfile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<SignInResponse>;
  register: (payload: RegistrationRequest) => Promise<RegistrationResponse>;
  updateProfile: (
    profile: Partial<CustomerProfileData>,
  ) => Promise<{success: boolean; account?: PublicAccountProfile; error?: string}>;
  signOut: () => Promise<boolean>;
  refreshSession: () => Promise<boolean>;
  setUser: (user: PublicAccountProfile | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({children}: {children: React.ReactNode}) {
  const [user, commitUser] = useState<PublicAccountProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const revision = useRef(0);
  const channel = useRef<BroadcastChannel | null>(null);
  const setUser = useCallback((next: PublicAccountProfile | null) => {
    revision.current += 1;
    commitUser(next);
  }, []);

  const refreshSession = useCallback(async () => {
    const current = ++revision.current;
    try {
      const data = await CustomerAccountService.getSession();
      if (current !== revision.current) return false;
      if (data.authenticated && data.account) {
        commitUser(previous => JSON.stringify(previous) === JSON.stringify(data.account) ? previous : data.account!);
        return true;
      } else {
        commitUser(null);
        return false;
      }
    } catch {
      if (current === revision.current) commitUser(null);
      return false;
    } finally {
      if (current === revision.current) setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refreshSession();
    const expire = () => setUser(null);
    const refresh = () => { if (document.visibilityState === 'visible') void refreshSession(); };
    window.addEventListener(ACCOUNT_UNAUTHORIZED_EVENT, expire);
    window.addEventListener('focus', refresh);
    document.addEventListener('visibilitychange', refresh);
    const timer = setInterval(refresh, 60_000);
    if (typeof BroadcastChannel !== 'undefined') {
      channel.current = new BroadcastChannel('trustgo-account');
      channel.current.onmessage = () => void refreshSession();
    }
    return () => {
      revision.current += 1;
      clearInterval(timer);
      window.removeEventListener(ACCOUNT_UNAUTHORIZED_EVENT, expire);
      window.removeEventListener('focus', refresh);
      document.removeEventListener('visibilitychange', refresh);
      channel.current?.close();
      channel.current = null;
    };
  }, [refreshSession, setUser]);

  const signIn = useCallback(async (email: string, password: string): Promise<SignInResponse> => {
    const current = ++revision.current;
    const res = await CustomerAccountService.signInWithPassword(email, password);
    if (current === revision.current && res.success && res.account) {
      setUser(res.account);
      channel.current?.postMessage('changed');
    }
    setIsLoading(false);
    return res;
  }, [setUser]);

  const register = useCallback(async (payload: RegistrationRequest): Promise<RegistrationResponse> => {
    const current = ++revision.current;
    const res = await CustomerAccountService.register(payload);
    if (current === revision.current && res.success && res.account) {
      setUser(res.account);
      channel.current?.postMessage('changed');
    }
    setIsLoading(false);
    return res;
  }, [setUser]);

  const updateProfile = useCallback(
    async (
      profile: Partial<CustomerProfileData>,
    ): Promise<{success: boolean; account?: PublicAccountProfile; error?: string}> => {
      const res = await CustomerAccountService.updateProfile(profile);
      if (res.success && res.account) {
        setUser(res.account);
      }
      return res;
    },
    [setUser],
  );


  const signOut = useCallback(async () => {
    revision.current += 1;
    const response = await CustomerAccountService.signOut();
    if (!response.success) return false;
    setUser(null);
    channel.current?.postMessage('changed');
    return true;
  }, [setUser]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        signIn,
        register,
        updateProfile,
        signOut,
        refreshSession,
        setUser,
      }}
    >
      <AuthModalProvider>{children}</AuthModalProvider>
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
