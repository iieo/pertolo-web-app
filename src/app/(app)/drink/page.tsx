import AddPlayerForm from './add-player-form';

export default async function PlayersScreen() {
  return (
    <main className="flex flex-col items-center h-[calc(100dvh-2rem)] bg-gradient-to-br from-purple-950 via-purple-900 to-gray-900">
      <div className="mt-12 mb-8 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight text-purple-300 drop-shadow-lg mb-2">
          Spieler
        </h1>
      </div>
      <AddPlayerForm />
    </main>
  );
}
