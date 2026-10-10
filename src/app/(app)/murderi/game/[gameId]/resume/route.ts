import { NextRequest, NextResponse } from 'next/server';

import { claimCookieName, claimCookieOptions, getPlayerByToken } from '../../../data';
import { gamePath, isValidCode, normalizeCode, playerPath } from '../../../limits';

const MAX_TOKEN_LENGTH = 64;

// Moves a claim to another browser, e.g. from an in-app browser with its own cookie jar to Safari.
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId: raw } = await params;
  const gameId = normalizeCode(raw);
  if (!isValidCode(gameId)) return NextResponse.redirect(new URL('/murderi', request.url));

  const overview = NextResponse.redirect(new URL(gamePath(gameId), request.url));
  const token = request.nextUrl.searchParams.get('t');
  if (!token || token.length > MAX_TOKEN_LENGTH) return overview;

  try {
    const me = await getPlayerByToken(gameId, token);
    if (!me) return overview;

    const target = me.victim === null ? gamePath(gameId) : playerPath(gameId, me.killer);
    const response = NextResponse.redirect(new URL(target, request.url));
    response.cookies.set(claimCookieName(gameId), token, claimCookieOptions);
    return response;
  } catch (error) {
    console.error('murderi: resume failed', error);
    return overview;
  }
}
