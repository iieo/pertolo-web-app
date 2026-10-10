import { RegisterForm } from '../components/register-form';
import { pageClass, pageTitleClass } from '../components/styles';

export default function RegisterPage() {
  return (
    <div className={`${pageClass} max-w-md`}>
      <h1 className={pageTitleClass}>Konto erstellen</h1>
      <p className="mt-4 text-lg leading-relaxed text-white/60">
        Starte mit 10.000 Punkten, um mit Freunden zu wetten.
      </p>
      <div className="mt-12">
        <RegisterForm />
      </div>
    </div>
  );
}
