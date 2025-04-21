'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { GameSettings } from '@/db/schema';
import { dbUpdateGameSettings } from '../actions';

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
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="mb-4">
        <div>
          <label htmlFor="hostName">Player Name:</label>
          <input
            type="text"
            id="hostName"
            {...register('hostName')}
            className={`border ${createErrors.hostName ? 'border-red-500' : 'border-gray-300'} rounded p-2`}
          />
          {createErrors.hostName && <p className="text-red-500">{createErrors.hostName.message}</p>}
        </div>
        <div className="flex gap-2 mt-2">
          <button type="submit" className="bg-blue-500 text-white p-2 rounded">
            Add Player
          </button>
          <button
            type="button"
            className="bg-green-600 text-white p-2 rounded"
            onClick={handleStartGame}
            disabled={players.length === 0 || isSubmitting}
          >
            {isSubmitting ? 'Starting...' : 'Start Game'}
          </button>
        </div>
      </form>
      <div>
        <h3 className="font-semibold mb-2">Added Players:</h3>
        <ul className="list-disc pl-5">
          {players.map((player, idx) => (
            <li key={idx}>{player}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default AddPlayerForm;
