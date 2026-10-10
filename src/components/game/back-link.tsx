import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

import { cn } from '@/lib/utils';

import type { Locale } from './locale';

const BACK_LABEL: Record<Locale, string> = { de: 'Zurück', en: 'Back' };

/** Back link for start and overview pages. Styled like the Quit button, takes the text color. */
export function BackLink({
  href = '/',
  locale,
  label,
  className,
}: {
  href?: string;
  locale: Locale;
  label?: string;
  className?: string;
}) {
  return (
    <Link
      href={href}
      lang={locale}
      className={cn(
        '-ml-2 flex min-h-12 w-fit items-center gap-2 rounded-xl px-2 text-sm font-medium outline-none focus-visible:outline-2 focus-visible:outline-current',
        className,
      )}
    >
      <ArrowLeft size={20} aria-hidden />
      {label ?? BACK_LABEL[locale]}
    </Link>
  );
}
