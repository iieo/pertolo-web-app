'use client';

import Link from 'next/link';
import { getErrorMessage } from '@/util/error';

const primaryClass =
  'inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-black outline-none transition-[filter,transform] duration-150 hover:brightness-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto';
const secondaryClass =
  'inline-flex min-h-11 w-full items-center justify-center rounded-xl px-6 py-3 text-base font-semibold text-white outline-none transition-colors duration-150 hover:bg-white/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none sm:w-auto';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const message =
    getErrorMessage(error).trim() || 'An unexpected error occurred. Please try again.';

  return (
    <div className="min-h-dvh w-full bg-black text-white">
      <main className="mx-auto w-full max-w-3xl pt-[max(3rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-16 pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pt-16 lg:pt-24 lg:pb-24">
        <h1 className="text-5xl font-bold tracking-tight wrap-break-word sm:text-6xl lg:text-8xl">
          Something went wrong
        </h1>
        <p className="mt-4 text-base text-white/60 wrap-break-word sm:text-lg">{message}</p>
        {error.digest && (
          <p className="mt-2 text-sm text-white/40 wrap-break-word">Error ID: {error.digest}</p>
        )}
        <div className="mt-12 flex flex-col gap-2 sm:flex-row sm:gap-4">
          <button type="button" onClick={() => reset()} className={primaryClass}>
            Try again
          </button>
          <Link href="/" className={secondaryClass}>
            Back to start
          </Link>
        </div>
      </main>
    </div>
  );
}
