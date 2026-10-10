'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../register/actions';
import { authClient } from '@/lib/auth-client';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { errorClass, inputClass, labelClass, primaryButtonClass } from './styles';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name muss mindestens 2 Zeichen lang sein').max(50),
    email: z.string().email('Ungültige E-Mail-Adresse'),
    password: z.string().min(8, 'Passwort muss mindestens 8 Zeichen lang sein'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwörter stimmen nicht überein',
    path: ['confirmPassword'],
  });

type RegisterForm = z.infer<typeof registerSchema>;

export function RegisterForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
  });

  async function onSubmit(data: RegisterForm) {
    setLoading(true);
    try {
      const result = await registerUser(data.name, data.email, data.password);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      // Auto sign in after registration
      const signInResult = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });

      if (signInResult.error) {
        toast.error('Registriert, aber Anmeldung fehlgeschlagen. Bitte melde dich manuell an.');
        router.push('/bet/login');
        return;
      }

      toast.success('Willkommen! +10.000 Punkte');
      router.push('/bet');
      router.refresh();
    } catch {
      toast.error('Registrierung fehlgeschlagen');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-8">
      <div className="flex flex-col gap-2">
        <label htmlFor="name" className={labelClass}>
          Name
        </label>
        <input
          id="name"
          placeholder="Dein Name"
          autoComplete="name"
          className={inputClass}
          {...register('name')}
        />
        {errors.name && <p className={errorClass}>{errors.name.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="email" className={labelClass}>
          E-Mail
        </label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="you@example.com"
          className={inputClass}
          {...register('email')}
        />
        {errors.email && <p className={errorClass}>{errors.email.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="password" className={labelClass}>
          Passwort
        </label>
        <input
          id="password"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputClass}
          {...register('password')}
        />
        {errors.password && <p className={errorClass}>{errors.password.message}</p>}
      </div>

      <div className="flex flex-col gap-2">
        <label htmlFor="confirmPassword" className={labelClass}>
          Passwort bestätigen
        </label>
        <input
          id="confirmPassword"
          type="password"
          autoComplete="new-password"
          placeholder="••••••••"
          className={inputClass}
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && <p className={errorClass}>{errors.confirmPassword.message}</p>}
      </div>

      <button type="submit" disabled={loading} className={primaryButtonClass}>
        {loading ? 'Konto wird erstellt…' : 'Konto erstellen'}
      </button>

      <p className="text-center text-base text-white/60">
        Bereits ein Konto vorhanden?{' '}
        <Link
          href="/bet/login"
          className="inline-flex min-h-12 items-center rounded-xl px-1 font-semibold text-white underline decoration-white/40 underline-offset-4 outline-none hover:decoration-white focus-visible:outline-2 focus-visible:outline-white"
        >
          Anmelden
        </Link>
      </p>
    </form>
  );
}
