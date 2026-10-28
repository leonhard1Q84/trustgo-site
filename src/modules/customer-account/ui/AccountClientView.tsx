'use client';

import React from 'react';
import type { RouteLanguage } from '@/i18n/locales';
import AccountProfilePage from './AccountProfilePage';

interface AccountClientViewProps {
  lang: RouteLanguage;
}

export const AccountClientView: React.FC<AccountClientViewProps> = ({ lang }) => {
  return (
    <div className="min-h-screen bg-muted/30 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-6xl mx-auto">
        <AccountProfilePage lang={lang} />
      </div>
    </div>
  );
};

export default AccountClientView;
