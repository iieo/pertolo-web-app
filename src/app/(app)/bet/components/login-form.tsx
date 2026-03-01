'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LogIn } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(1, 'Password is required'),
});

type LoginForm = z.infer<typeof loginSchema>;

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') ?? '/bet';
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
  });

  async function onSubmit(data: LoginForm) {
    setLoading(true);
    try {
      const result = await authClient.signIn.email({
        email: data.email,
        password: data.password,
      });
      if (result.error) {
        toast.error(result.error.message ?? 'Login failed');
        return;
      }
      router.push(callbackUrl);
      router.refresh();
    } catch {
      toast.error('Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white/70">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="you@example.com"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('email')}
        />
        {errors.email && <p className="text-sm text-red-400">{errors.email.message}</p>}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password" className="text-white/70">
          Password
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('password')}
        />
        {errors.password && <p className="text-sm text-red-400">{errors.password.message}</p>}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-bold hover:bg-amber-400"
      >
        <LogIn size={18} className="mr-2" />
        {loading ? 'Signing in...' : 'Sign In'}
      </Button>

      <p className="text-center text-sm text-white/40">
        Don&apos;t have an account?{' '}
        <Link href="/bet/register" className="text-amber-400 hover:underline">
          Register
        </Link>
      </p>
    </form>
  );
}
