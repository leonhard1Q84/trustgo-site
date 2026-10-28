'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';

export type AuthModalInitialView = 'initial' | 'password' | 'register' | 'challenge';

export interface OpenAuthModalOptions {
  defaultEmail?: string;
  initialView?: AuthModalInitialView;
  redirectUrl?: string;
  onSuccess?: () => void;
}

interface AuthModalContextType {
  isOpen: boolean;
  options: OpenAuthModalOptions;
  openAuthModal: (options?: OpenAuthModalOptions) => void;
  closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<OpenAuthModalOptions>({});

  const openAuthModal = useCallback((opts?: OpenAuthModalOptions) => {
    setOptions(opts || {});
    setIsOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsOpen(false);
    setOptions({});
  }, []);

  const value = useMemo(
    () => ({
      isOpen,
      options,
      openAuthModal,
      closeAuthModal,
    }),
    [isOpen, options, openAuthModal, closeAuthModal]
  );

  return (
    <AuthModalContext.Provider value={value}>
      {children}
    </AuthModalContext.Provider>
  );
}

export function useAuthModal() {
  const context = useContext(AuthModalContext);
  if (!context) {
    throw new Error('useAuthModal must be used within an AuthModalProvider');
  }
  return context;
}
