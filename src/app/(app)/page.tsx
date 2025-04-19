'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';
import { createGame, joinGame } from './actions';
import { redirect } from 'next/navigation';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription } from '@/components/ui/alert';

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
    setValue: setJoinValue,
  } = useForm<JoinGameFormData>({
    resolver: zodResolver(JoinGameFormSchema),
  });

  const onCreateSubmit = async () => {
    setIsCreating(true);
    setCreateError(null);
    const result = await createGame();
    if (result.success) {
      redirect(`/game/${result.data.gameCode}/mode`);
    } else {
      setCreateError(result.error);
    }
    setIsCreating(false);
  };

  const onJoinSubmit = async (data: JoinGameFormData) => {
    setIsJoining(true);
    setJoinError(null);
    const result = await joinGame(data.gameCode);
    if (result.success) {
      redirect(`/game/${data.gameCode}`);
    } else {
      setJoinError(result.error);
    }
    setIsJoining(false);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
      <div className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
          Pertolo
        </h1>
        <p className="text-xl text-purple-100/80 font-medium">
          The ultimate party drinking game!
        </p>
      </div>
      <div className="flex flex-col md:flex-row gap-8 w-full max-w-2xl">
        {/* Create Game Card */}
        <Card className="flex-1 bg-gradient-to-br from-purple-800/80 to-purple-900/80 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-100">
              Create New Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            {createError && (
              <Alert variant="destructive" className="mb-4">
                <AlertDescription>{createError}</AlertDescription>
              </Alert>
            )}
            <form
              onSubmit={e => {
                e.preventDefault();
                onCreateSubmit();
              }}
              className="flex flex-col gap-4"
            >
              <Button
                type="submit"
                variant="default"
                className="w-full bg-gradient-to-r from-purple-600 to-purple-500 text-lg"
                disabled={isCreating}
                size="lg"
              >
                {isCreating ? 'Creating...' : 'Create Game'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Separator for mobile */}
        <div className="md:hidden flex items-center justify-center my-2">
          <Separator className="w-1/2" />
        </div>

        {/* Join Game Card */}
        <Card className="flex-1 bg-gradient-to-br from-gray-800/80 to-gray-900/80 border-none shadow-2xl">
          <CardHeader>
            <CardTitle className="text-center text-2xl text-purple-100">
              Join Existing Game
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form
              onSubmit={handleJoinSubmit(onJoinSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex flex-col gap-2">
                <Label htmlFor="gameCode" className="text-purple-200">
                  Game Code
                </Label>
                <Input
                  id="gameCode"
                  type="text"
                  maxLength={6}
                  minLength={6}
                  autoComplete="off"
                  placeholder="ABC123"
                  className={`uppercase tracking-widest text-lg bg-gray-900/80 border-gray-700 focus-visible:ring-purple-500 ${joinErrors.gameCode ? 'border-red-500' : ''
                    }`}
                  disabled={isJoining}
                  {...registerJoin('gameCode', {
                    onChange: (e) => {
                      const upperCaseValue = e.target.value.toUpperCase();
                      e.target.value = upperCaseValue;
                      setJoinValue('gameCode', upperCaseValue);
                    },
                  })}
                />
                {joinErrors.gameCode && (
                  <span className="text-red-400 text-xs mt-1">
                    {joinErrors.gameCode.message}
                  </span>
                )}
              </div>
              {joinError && (
                <Alert variant="destructive">
                  <AlertDescription>{joinError}</AlertDescription>
                </Alert>
              )}
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-green-600 to-green-500 text-lg"
                disabled={isJoining}
                size="lg"
              >
                {isJoining ? 'Joining...' : 'Join Game'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
      <footer className="mt-16 text-xs text-purple-200/60 text-center">
        &copy; {new Date().getFullYear()} Pertolo. Have fun and drink responsibly!
      </footer>
    </main>
  );
}
