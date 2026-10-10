import { Suspense } from 'react';
import { LoginForm } from '../components/login-form';
import { pageClass, pageTitleClass } from '../components/styles';

export default function LoginPage() {
  return (
    <div className={`${pageClass} max-w-md`}>
      <h1 className={pageTitleClass}>Anmelden</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">
        Melde dich an, um Wetten zu platzieren und dich zu messen.
      </p>
      <div className="mt-12">
        <Suspense>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
