'use client';

import React from 'react';
import type { RouteLanguage } from '@/i18n/locales';
import { AuthUnifiedCard } from './AuthUnifiedCard';

interface SignInClientViewProps {
  lang: RouteLanguage;
}

export const SignInClientView: React.FC<SignInClientViewProps> = ({ lang }) => {
  return (
    <div className="min-h-[80vh] flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 bg-muted/30">
      <div className="w-full max-w-[480px] mx-auto bg-background rounded-card border border-border p-2 sm:p-6 shadow-xs">
        <AuthUnifiedCard lang={lang} isModal={false} initialView="initial" />
      </div>
    </div>
  );
};

export default SignInClientView;
