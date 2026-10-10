import type { Viewport } from 'next';
import Link from 'next/link';

export const viewport: Viewport = {
  themeColor: '#000000',
  viewportFit: 'cover',
};

export default function NotFound() {
  return (
    <div className="min-h-dvh w-full bg-black text-white">
      <main className="mx-auto w-full max-w-3xl pt-[max(3rem,env(safe-area-inset-top))] pr-[max(1rem,env(safe-area-inset-right))] pb-16 pl-[max(1rem,env(safe-area-inset-left))] sm:pr-[max(2rem,env(safe-area-inset-right))] sm:pl-[max(2rem,env(safe-area-inset-left))] sm:pt-16 lg:pt-24 lg:pb-24">
        <h1 className="text-5xl font-bold tracking-tight wrap-break-word sm:text-6xl lg:text-8xl">
          Page not found
        </h1>
        <p className="mt-4 text-base text-white/60 sm:text-lg">
          This page doesn’t exist or has moved.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row">
          <Link
            href="/"
            className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-white px-6 py-3 text-base font-semibold text-black outline-none transition-[filter,transform] duration-150 hover:brightness-90 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white motion-reduce:transition-none motion-reduce:active:scale-100 sm:w-auto"
          >
            Back to start
          </Link>
        </div>
      </main>
    </div>
  );
}
