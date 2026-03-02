import { Suspense } from 'react';
import { Coins } from 'lucide-react';
import { LoginForm } from '../components/login-form';

export default function LoginPage() {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 md:py-24">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center gap-3 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/20 border border-amber-500/30">
            <Coins size={32} className="text-amber-400" />
          </div>
          <h1 className="text-3xl font-extrabold text-white">Sign In</h1>
          <p className="text-white/50">Sign in to place bets and compete</p>
        </div>

        <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
          <Suspense>
            <LoginForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
