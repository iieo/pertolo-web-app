'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GameSettings } from '@/db/schema';
import { dbUpdateGameSettings } from '../actions';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Play, X } from 'lucide-react';

const AddPlayerFormSchema = z.object({
  hostName: z
    .string()
    .min(1, { message: 'Players name cannot be empty' })
    .max(50, 'Players name max 50 chars'),
});
type AddPlayerFormData = z.infer<typeof AddPlayerFormSchema>;

function AddPlayerForm({ gameId, gameSettings }: { gameId: string, gameSettings: GameSettings }) {
  const router = useRouter();
  const [players, setPlayers] = useState<string[]>(gameSettings.players || []);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors: createErrors },
    reset,
  } = useForm<AddPlayerFormData>({
    resolver: zodResolver(AddPlayerFormSchema),
  });

  async function onSubmit(data: AddPlayerFormData) {
    const name = data.hostName.trim();
    if (!name) return;
    setPlayers((prev) => [...prev, name]);
    reset();
  }

  async function handleStartGame() {
    if (players.length === 0) return;
    setIsSubmitting(true);
    const result = await dbUpdateGameSettings({
      gameId,
      gameSettings: {
        ...gameSettings,
        players,
      }
    })
    setIsSubmitting(false);
    if (result?.success) {
      router.push(`/game/${result.data.gameCode}/mode`);
    } else {
      alert('Failed to start game. Please try again.');
    }
  }

  return (
    <div className="w-full flex flex-col justify-center items-center h-full">
      <div className="h-full flex flex-col justify-center items-center px-4 py-8 max-w-lg w-full">
        <Card className="w-full bg-gradient-to-br from-purple-800/80 to-purple-900/80 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-100">Added Players</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2 min-h-[96px]">
              {players.length === 0 && (
                <div className="col-span-2 text-purple-300/60 italic text-sm text-center">No players added yet.</div>
              )}
              {players.map((player, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 bg-purple-950/60 rounded-lg px-3 py-2 shadow-sm border border-purple-900/40"
                >
                  <div className="flex items-center justify-center w-8 h-8 rounded-full bg-purple-800 text-purple-200 font-bold text-lg uppercase">
                    {player.slice(0, 2)}
                  </div>
                  <span className="text-purple-100 font-medium text-lg flex-1">{player}</span>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-purple-300 hover:text-red-500"
                    aria-label="Remove Player"
                    onClick={() => setPlayers(players => players.filter((_, i) => i !== idx))}
                  >
                    <X size={20} />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="w-full bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 border-t border-purple-900/60 flex items-end justify-center ">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='gap-2 max-w-lg w-full flex items-end justify-center px-4 py-3'
          style={{ boxShadow: '0 -2px 16px 0 rgba(80,0,120,0.12)' }}
        >
          <div className="flex flex-col w-full">
            {createErrors.hostName && (
              <Alert variant="destructive" className="mb-2">
                <AlertDescription>{createErrors.hostName.message}</AlertDescription>
              </Alert>
            )}
            <Input
              type="text"
              id="hostName"
              placeholder="Add player..."
              {...register('hostName')}
              className={`text-white placeholder-white tracking-widest bg-purple-950/80 border-purple-400 focus-visible:ring-purple-500 h-14 px-5 py-3 rounded-xl ${createErrors.hostName ? 'border-red-500' : ''}`}
              autoComplete="off"
              disabled={isSubmitting}
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              type="submit"
              size="icon"
              className="bg-gradient-to-r from-purple-600 to-purple-500 text-white h-14 w-14 rounded-xl"
              disabled={isSubmitting}
              aria-label="Add Player"
            >
              <Plus size={28} />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className="bg-green-600 text-white h-14 w-14 rounded-xl"
              onClick={handleStartGame}
              disabled={players.length === 0 || isSubmitting}
              aria-label="Start Game"
            >
              <Play size={28} />
            </Button>
          </div>
        </form></div>
    </div>
  );
}

export default AddPlayerForm;
