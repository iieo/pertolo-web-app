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
      <main className="flex flex-col items-center justify-center h-[calc(100dvh-2rem)] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
        <div className="text-2xl text-purple-300 font-bold text-center">
          Aufgaben werden geladen...
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex flex-col items-center justify-center h-[calc(100dvh-2rem)] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900 px-4">
        <div className="text-2xl text-red-400 font-bold text-center">{error}</div>
        <div className="text-purple-300 mt-4">Bitte wähle eine andere Kategorie</div>
      </main>
    );
  }

  return <GenericTaskViewer />;
}
