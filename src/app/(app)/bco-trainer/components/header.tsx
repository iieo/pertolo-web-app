import Link from 'next/link';

export function Header() {
  return (
    <header className="flex flex-col items-start gap-8 sm:gap-16">
      <Link
        href="/"
        className="-ml-2 flex min-h-12 items-center rounded-xl px-2 text-base font-medium text-white underline decoration-white/40 underline-offset-4 outline-none hover:decoration-white focus-visible:outline-2 focus-visible:outline-white"
      >
        Back
      </Link>
      <div>
        <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">BCO Trainer</h1>
        <p className="mt-2 text-base leading-relaxed text-white/60 sm:text-lg">
          Train your rhythm reading.
        </p>
      </div>
    </header>
  );
}
