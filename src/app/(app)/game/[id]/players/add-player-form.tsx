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
      // handle error if needed
      alert('Failed to start game. Please try again.');
    }
  }

  return (
    <Card className="bg-gradient-to-br from-purple-800/80 to-purple-900/80 border-none shadow-2xl">
      <CardHeader>
        <CardTitle className="text-center text-2xl text-purple-100">Add Players</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="mb-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <Label htmlFor="hostName" className="text-purple-200">Player Name</Label>
            <Input
              type="text"
              id="hostName"
              {...register('hostName')}
              className={`uppercase text-white tracking-widest text-lg bg-purple-950/80 border-gray-700 focus-visible:ring-purple-500 ${createErrors.hostName ? 'border-red-500' : ''}`}
              autoComplete="off"
              disabled={isSubmitting}
            />
            {createErrors.hostName && (
              <Alert variant="destructive">
                <AlertDescription>{createErrors.hostName.message}</AlertDescription>
              </Alert>
            )}
          </div>
          <div className="flex gap-2 mt-2">
            <Button type="submit" className="bg-gradient-to-r from-purple-600 to-purple-500 text-lg" disabled={isSubmitting}>
              Add Player
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="bg-green-600 text-white text-lg"
              onClick={handleStartGame}
              disabled={players.length === 0 || isSubmitting}
            >
              {isSubmitting ? 'Starting...' : 'Start Game'}
            </Button>
          </div>
        </form>
        <div>
          <h3 className="font-semibold mb-2 text-purple-100">Added Players:</h3>
          <ul className="list-disc pl-5 text-purple-100">
            {players.map((player, idx) => (
              <li key={idx}>{player}</li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

export default AddPlayerForm;
