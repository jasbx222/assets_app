'use client';

import React, { PropsWithChildren, useState, useEffect } from 'react';
import { isWindowAvailable } from 'utils/navigation';
import FixedPlugin from 'components/fixedPlugin/FixedPlugin';
import SignInDefault from './sign-in/page';
import { getDecryptedToken } from 'hooks/getDecryptedToken';

interface AuthProps extends PropsWithChildren {}

export default function AuthLayout({ children }: AuthProps) {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    if (isWindowAvailable()) {
      document.documentElement.dir = 'ltr';
      const t =getDecryptedToken()
      setToken(t);
    }
    setChecked(true);
  }, []);

  // قبل التأكد من قراءة الـ token، لا نعرض أي شيء
  if (!checked) {
    return null;
  }

  return (
    <div className="relative float-right h-full min-h-screen w-full dark:!bg-navy-900" dir='rtl'>
      <main className="mx-auto min-h-screen">
        <FixedPlugin />

        {token ? (
          <div className="flex h-full w-full items-center justify-center">
            {children}
          </div>
        ) : (
          <SignInDefault />
        )}
      </main>
    </div>
  );
}
