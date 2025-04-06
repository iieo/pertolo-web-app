import { getUserOrRedirect } from '@/auth/utils';
import AuthenticatedNavbar from '@/components/navigation/authenticated-navbar';
import React from 'react';

export default async function Layout({ children }: { children: React.ReactNode }) {
  const user = await getUserOrRedirect();

  return (
    <div className="h-[100dvh] w-full">
      <AuthenticatedNavbar user={user} />
      <div>{children}</div>
    </div>
  );
}
