import { dbGetRandomWord } from './actions';
import type { WordResponse, ErrorResponse } from '@/types/api';

/**
 * @swagger
 * /api/random-word:
 *   get:
 *     summary: Get a random word
 *     description: Returns a random word from the impostor words database
 *     tags: [Words]
 *     responses:
 *       200:
 *         description: Successfully retrieved a random word
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 word:
 *                   type: string
 *                   example: elephant
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: No words found
 */
export async function GET() {
  const result = await dbGetRandomWord();

  if (!result.success) {
    const errorResponse: ErrorResponse = { error: result.error ?? 'Unknown error' };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const successResponse: WordResponse = { word: result.data! };
  return new Response(JSON.stringify(successResponse), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
