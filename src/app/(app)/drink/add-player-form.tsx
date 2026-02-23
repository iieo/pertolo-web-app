'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Plus, Play, X, User } from 'lucide-react';
import { useDrinkGame } from './game-provider';
import { useEffect, useState } from 'react';

const AddPlayerFormSchema = z.object({
  hostName: z
    .string()
    .min(1, { message: 'Spielername darf nicht leer sein' })
    .max(20, 'Spielername max. 20 Zeichen'),
});
type AddPlayerFormData = z.infer<typeof AddPlayerFormSchema>;

function AddPlayerForm() {
  const router = useRouter();
  const { players, setPlayers } = useDrinkGame();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    register,
    handleSubmit,
    setError,
    setFocus,
    formState: { errors: createErrors },
    reset,
  } = useForm<AddPlayerFormData>({
    resolver: zodResolver(AddPlayerFormSchema),
  });

  async function onSubmit(data: AddPlayerFormData) {
    const name = data.hostName.trim();
    if (!name) return;

    if (players.some((p) => p.toLowerCase() === name.toLowerCase())) {
      setError('hostName', {
        type: 'manual',
        message: 'Dieser Spieler ist bereits dabei',
      });
      setTimeout(() => setFocus('hostName'), 0);
      return;
    }

    setPlayers((prev) => [...prev, name]);
    reset();
    setTimeout(() => setFocus('hostName'), 0);
  }

  async function handleStartGame() {
    if (players.length === 0) return;
    setPlayers((prev) => [...new Set(prev)]);
    router.push(`/drink/mode`);
  }

  if (!isMounted) return null;

  return (
    <div className="w-full flex flex-col justify-between items-center h-full animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="flex-1 flex flex-col items-center w-full px-4 overflow-y-auto pt-8 pb-32 no-scrollbar">
        <Card className="w-full max-w-lg bg-white/10 backdrop-blur-xl border border-white/20 shadow-[0_10px_40px_-10px_rgba(45,78,255,0.15)] rounded-3xl overflow-visible relative">
          <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none -z-10" />

          <CardHeader className="pt-8 pb-6">
            <CardTitle className="text-center text-3xl font-black text-transparent bg-clip-text bg-linear-to-r from-purple-200 to-fuchsia-200 pb-1">
              Mitspieler
            </CardTitle>
            <p className="text-center text-purple-200/70 text-sm font-medium">
              Wer trinkt heute mit?
            </p>
          </CardHeader>
          <CardContent className="px-6 pb-8">
            <div className="flex flex-col gap-3">
              {players.length === 0 && (
                <div className="h-32 flex flex-col items-center justify-center gap-3 text-purple-300/50 italic text-center rounded-2xl border-2 border-dashed border-white/10 bg-white/5">
                  <User className="w-8 h-8 opacity-50" />
                  <span>Noch keine Spieler hinzugefügt.</span>
                </div>
              )}
              {players.map((player, idx) => (
                <div
                  key={`${player}-${idx}`}
                  className="group relative flex items-center justify-between gap-3 bg-white/10 hover:bg-white/20 hover:scale-[1.02] ml-0 transition-all duration-300 ease-out rounded-2xl px-4 py-3 shadow-sm border border-white/10 animate-in slide-in-from-left duration-500"
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                >
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-linear-to-br from-purple-500 to-fuchsia-600 text-white font-extrabold text-xl uppercase ring-2 ring-white/20 group-hover:ring-white/40 transition-all shadow-[0_0_15px_rgba(236,72,153,0.3)]">
                      {player[0]}
                    </div>
                    <span className="text-white font-bold tracking-wide text-xl">{player}</span>
                  </div>
                  <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    className="text-white/50 hover:text-red-400 hover:bg-red-500/10 rounded-full h-10 w-10 transition-colors"
                    aria-label="Remove Player"
                    onClick={() => setPlayers((players) => players.filter((_, i) => i !== idx))}
                  >
                    <X className="w-5 h-5" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="fixed bottom-0 left-0 w-full bg-linear-to-t from-gray-950 via-gray-900/95 to-transparent pt-12 pb-6 px-4 flex justify-center backdrop-blur-sm z-10">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="gap-3 max-w-lg w-full flex items-end justify-center animate-in slide-in-from-bottom duration-700 shadow-2xl"
        >
          <div className="flex flex-col w-full relative">
            {createErrors.hostName && (
              <Alert
                variant="destructive"
                className="absolute -top-16 w-full animate-in fade-in slide-in-from-bottom-2 bg-red-500/10 border-red-500/50 text-red-100 py-2 backdrop-blur-md"
              >
                <AlertDescription className="text-center font-medium">
                  {createErrors.hostName.message}
                </AlertDescription>
              </Alert>
            )}
            <Input
              type="text"
              id="hostName"
              placeholder="Name..."
              {...register('hostName')}
              autoFocus
              className={`text-white text-lg font-medium placeholder-white/40 bg-white/10 hover:bg-white/15 border-white/20 focus-visible:ring-2 focus-visible:ring-fuchsia-500 focus-visible:border-transparent transition-all h-16 px-6 rounded-2xl ${createErrors.hostName ? 'border-red-500/80 focus-visible:ring-red-500' : ''}`}
              autoComplete="off"
            />
          </div>
          <div className="flex flex-row gap-2 items-center">
            <Button
              type="submit"
              size="icon"
              className="bg-white/10 hover:bg-white/20 border border-white/20 text-white h-16 w-16 rounded-2xl transition-all shadow-lg active:scale-95 group shrink-0"
              aria-label="Add Player"
            >
              <Plus className="w-8 h-8 group-hover:scale-110 transition-transform text-fuchsia-300" />
            </Button>
            <Button
              type="button"
              variant="secondary"
              size="icon"
              className={`shrink-0 h-16 w-16 rounded-2xl transition-all shadow-lg active:scale-95 group ${
                players.length === 0
                  ? 'bg-white/5 text-white/20 border border-white/10'
                  : 'bg-linear-to-br from-green-400 to-emerald-600 text-white shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] border-none'
              }`}
              onClick={handleStartGame}
              disabled={players.length === 0}
              aria-label="Start Game"
            >
              <Play className="w-8 h-8 group-hover:scale-110 group-hover:translate-x-1 transition-transform ml-1" />
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default AddPlayerForm;
