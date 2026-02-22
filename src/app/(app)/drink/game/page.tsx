'use client';
import { useEffect, useState } from 'react';
import { dbGetRandomTasksByCategory } from './actions';
import { useDrinkGame } from '../game-provider';
import GenericTaskViewer from '@/components/tasks/generic-task-view';
import { useRouter } from 'next/navigation';

export default function GamePage() {
  const { category, setTasks } = useDrinkGame();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!category) {
      router.push('/drink/mode');
      return;
    }

    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksResult = await dbGetRandomTasksByCategory(category.id, 50);

        if (!tasksResult.success) {
          setError('Keine Aufgaben für diese Kategorie gefunden');
          return;
        }

        setTasks(tasksResult.data);
        setError(null);
      } catch {
        setError('Fehler beim Laden der Aufgaben');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [category, setTasks, router]);

  if (!category) {
    return null; // Will redirect in useEffect
  }

  if (loading) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] bg-gray-950 overflow-hidden px-4">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/20 blur-[120px] rounded-full pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none" />

        <div className="z-10 flex flex-col items-center gap-6 animate-in fade-in zoom-in duration-500">
          <div className="w-16 h-16 rounded-full border-4 border-fuchsia-500/30 border-t-fuchsia-400 animate-spin" />
          <div className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-200 to-fuchsia-200 drop-shadow-sm animate-pulse">
            Aufgaben werden geladen...
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="relative flex flex-col items-center justify-center min-h-[calc(100dvh-2rem)] bg-gray-950 overflow-hidden px-4 text-center">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
        <div className="absolute inset-0 bg-red-950/20" />

        <div className="z-10 flex flex-col items-center gap-4 animate-in fade-in zoom-in slide-in-from-bottom-8 duration-500 backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl shadow-2xl">
          <div className="text-3xl text-red-400 font-extrabold">{error}</div>
          <div className="text-purple-200/80 text-lg font-medium">Bitte wähle eine andere Kategorie</div>
          <button
            onClick={() => router.push('/drink/mode')}
            className="mt-4 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-2xl transition-all shadow-lg active:scale-95 text-white font-bold"
          >
            Zurück zur Auswahl
          </button>
        </div>
      </main>
    );
  }

  return <GenericTaskViewer />;
}
