import { CreateBetForm } from '../components/create-bet-form';

export default function CreateBetPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 pt-6">
      <h1 className="mb-6 text-2xl font-extrabold text-white">Create a Bet</h1>
      <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
        <CreateBetForm />
      </div>
    </div>
  );
}
