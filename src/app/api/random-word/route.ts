import { dbGetRandomWords } from './actions';
import type { ErrorResponse } from '@/types/api';
import { NextRequest } from 'next/server';

/**
 * @swagger
 * /api/random-word:
 *   get:
 *     summary: Get random words
 *     description: Returns an array of random words from the impostor words database
 *     tags: [Words]
 *     parameters:
 *       - in: query
 *         name: count
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 1
 *         description: Number of words to return (1-100)
 *     responses:
 *       200:
 *         description: Successfully retrieved random words
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: string
 *               example: ["elephant", "guitar", "ocean"]
 *       400:
 *         description: Invalid count parameter
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Count must be between 1 and 100
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
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const countParam = searchParams.get('count');

  let count = 1;
  if (countParam) {
    const parsedCount = parseInt(countParam, 10);
    if (isNaN(parsedCount) || parsedCount < 1 || parsedCount > 100) {
      const errorResponse: ErrorResponse = { error: 'Count must be between 1 and 100' };
      return new Response(JSON.stringify(errorResponse), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }
    count = parsedCount;
  }

  const result = await dbGetRandomWords(count);

  if (!result.success) {
    const errorResponse: ErrorResponse = { error: result.error ?? 'Unknown error' };
    return new Response(JSON.stringify(errorResponse), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  return new Response(JSON.stringify(result.data!), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
