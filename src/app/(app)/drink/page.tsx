import AddPlayerForm from './add-player-form';

export default async function PlayersScreen() {
  return (
    <main className="relative flex flex-col items-center min-h-[calc(100dvh-2rem)] bg-gradient-to-br from-gray-950 via-blue-950/80 to-purple-950 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 mix-blend-overlay pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-fuchsia-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <div className="z-10 w-full h-full flex flex-col items-center">
        <AddPlayerForm />
      </div>
    </main>
  );
}
