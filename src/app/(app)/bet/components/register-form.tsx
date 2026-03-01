'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerUser } from '../actions';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { UserPlus } from 'lucide-react';
import toast from 'react-hot-toast';
import Link from 'next/link';

const registerSchema = z
  .object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(50),
    email: z.string().email('Invalid email'),
    password: z.string().min(8, 'Password must be at least 8 characters'),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
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
        toast.error('Registered but sign in failed. Please log in.');
        router.push('/bet/login');
        return;
      }

      toast.success('Welcome! +10,000 points');
      router.push('/bet');
      router.refresh();
    } catch {
      toast.error('Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-white/70">
          Name
        </Label>
        <Input
          id="name"
          placeholder="Your name"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('name')}
        />
        {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
      </div>

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

      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-white/70">
          Confirm Password
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          className="border-white/10 bg-white/5 text-white placeholder:text-white/30"
          {...register('confirmPassword')}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-red-400">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={loading}
        className="w-full bg-amber-500 text-black font-bold hover:bg-amber-400"
      >
        <UserPlus size={18} className="mr-2" />
        {loading ? 'Creating account...' : 'Create Account'}
      </Button>

      <p className="text-center text-sm text-white/40">
        Already have an account?{' '}
        <Link href="/bet/login" className="text-amber-400 hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
