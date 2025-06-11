import { dbGetRandomWord } from './actions';

export async function GET() {
  const result = await dbGetRandomWord();

  if (!result.success) {
    return new Response(JSON.stringify({ error: result.error }), { status: 500 });
  }

  return new Response(JSON.stringify({ word: result.data }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
