import { randomBytes } from 'node:crypto';
import { cookies } from 'next/headers';

const MAX_AGE = 60 * 60 * 12;

function cookieName(gameId: string) {
  return `ww_${gameId}`;
}

export function newToken() {
  return randomBytes(24).toString('base64url');
}

export async function readToken(gameId: string): Promise<string | null> {
  const store = await cookies();
  return store.get(cookieName(gameId))?.value ?? null;
}

export async function writeToken(gameId: string, token: string) {
  const store = await cookies();
  store.set(cookieName(gameId), token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: MAX_AGE,
  });
}

export async function clearToken(gameId: string) {
  const store = await cookies();
  store.delete(cookieName(gameId));
}

export function normalizeCode(raw: unknown): string | null {
  if (typeof raw !== 'string') return null;
  const code = raw.trim().toUpperCase();
  return /^[A-Z]{4}$/.test(code) ? code : null;
}

export function generateCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const bytes = randomBytes(4);
  return Array.from(bytes, (b) => chars[b % chars.length]).join('');
}
