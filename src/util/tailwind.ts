import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cw(...classNames: Array<string | undefined | null | boolean>) {
  return twMerge(clsx(classNames));
}
