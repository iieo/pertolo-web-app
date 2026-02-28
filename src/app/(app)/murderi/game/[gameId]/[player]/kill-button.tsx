'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { dbUpdateVictim } from '../../../actions';
import { Loader2, Skull } from 'lucide-react';

export default function KillButton({ gameId, player }: { gameId: string; player: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleKilled = async () => {
    setLoading(true);
    await dbUpdateVictim(gameId, player);
    router.push('/murderi/killed');
  };

  return (
    <Button
      onClick={handleKilled}
      disabled={loading}
      className="w-full h-14 text-base font-bold rounded-2xl bg-[#1a1a1a] hover:bg-[#222] border border-[#333] text-white disabled:opacity-40"
    >
      {loading ? (
        <Loader2 className="w-5 h-5 animate-spin mr-2" />
      ) : (
        <Skull className="w-5 h-5 mr-2 text-[#dc2626]" />
      )}
      {loading ? 'Updating...' : 'I have been killed'}
    </Button>
  );
}
