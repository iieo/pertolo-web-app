'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { createGame, joinGame } from './actions';
import { redirect } from 'next/navigation';

const JoinGameFormSchema = z.object({
  gameCode: z
    .string()
    .length(6, { message: 'Game code must be 6 characters' })
    .regex(/^[A-Z0-9]{6}$/, { message: 'Code must be uppercase letters/numbers' })
    .toUpperCase(),
});

type JoinGameFormData = z.infer<typeof JoinGameFormSchema>;

export default function HomePage() {
  const [createError, setCreateError] = useState<string | null>(null);
  const [joinError, setJoinError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  const {
    register: registerJoin,
    handleSubmit: handleJoinSubmit,
    formState: { errors: joinErrors },
    reset: resetJoinForm,
    setValue: setJoinValue, // To handle uppercase transformation
  } = useForm<JoinGameFormData>({
    resolver: zodResolver(JoinGameFormSchema),
  });

  const onCreateSubmit = async () => {
    setIsCreating(true);
    setCreateError(null);
    const result = await createGame();
    if (result.success) {
      redirect(`/game/${result.data.gameCode}/modes`);
    } else {
      console.error('Create game error:', result.error);
      setCreateError(result.error);
    }
    setIsCreating(false);
  };

  const onJoinSubmit = async (data: JoinGameFormData) => {
    setIsJoining(true);
    setJoinError(null);
    const result = await joinGame(data.gameCode);
    // joinGame redirects on success, so we only handle errors here
    if (result.success) {
      redirect(`/game/${data.gameCode}`);
    } else {
      console.error('Create game error:', result.error);
      setCreateError(result.error);
    }
    setIsJoining(false);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-5xl font-bold mb-8 text-purple-400">Pertolo</h1>
      <p className="text-xl mb-12 text-center">The ultimate party drinking game!</p>

      <div className="flex flex-col md:flex-row gap-8 w-full max-w-md md:max-w-2xl">
        {/* Create Game Form */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Create New Game</h2>
          <form onSubmit={onCreateSubmit} className="flex flex-col gap-4">
            {createError && <p className="text-red-500 text-sm mt-1">{createError}</p>}
            <button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isCreating}
            >
              {isCreating ? 'Creating...' : 'Create Game'}
            </button>
          </form>
        </div>

        {/* Join Game Form */}
        <div className="flex-1 bg-gray-800 p-6 rounded-lg shadow-lg">
          <h2 className="text-2xl font-semibold mb-4 text-center">Join Existing Game</h2>
          <form onSubmit={handleJoinSubmit(onJoinSubmit)} className="flex flex-col gap-4">

            <div>
              <label htmlFor="gameCode" className="block text-sm font-medium mb-1">
                Game Code
              </label>
              <input
                type="text"
                id="gameCode"
                {...registerJoin('gameCode', {
                  onChange: (e) => {
                    const upperCaseValue = e.target.value.toUpperCase();
                    e.target.value = upperCaseValue; // Ensure input visually shows uppercase
                    setJoinValue('gameCode', upperCaseValue); // Update form state
                  },
                })}
                maxLength={6}
                minLength={6}
                className={`w-full px-3 py-2 border rounded-md bg-gray-700 uppercase focus:outline-none focus:ring-2 ${joinErrors.gameCode ? 'border-red-500 focus:ring-red-500' : 'border-gray-600 focus:ring-purple-500'}`}
                placeholder="Enter 6-digit code"
                disabled={isJoining}
              />
              {joinErrors.gameCode && (
                <p className="text-red-500 text-xs mt-1">{joinErrors.gameCode.message}</p>
              )}
            </div>
            {joinError && <p className="text-red-500 text-sm mt-1">{joinError}</p>}
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isJoining}
            >
              {isJoining ? 'Joining...' : 'Join Game'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
