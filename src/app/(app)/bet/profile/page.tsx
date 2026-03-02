import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth-server';
import { getMyBalance, getUserPointHistory } from '../actions';
import { ProfileContent } from './profile-content';

export default async function ProfilePage() {
  const session = await getSession();
  if (!session) redirect('/bet/login');

  const [balanceResult, historyResult] = await Promise.all([
    getMyBalance(),
    getUserPointHistory(session.user.id),
  ]);

  return (
    <ProfileContent
      user={{ id: session.user.id, name: session.user.name, email: session.user.email }}
      balance={balanceResult.success ? balanceResult.data : null}
      pointHistory={historyResult.success ? historyResult.data : []}
    />
  );
}
