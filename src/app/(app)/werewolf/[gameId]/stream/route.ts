import { NextRequest } from 'next/server';
import postgres from 'postgres';

export const dynamic = 'force-dynamic';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> },
) {
  const { gameId } = await params;

  // We need a dedicated Postgres connection for LISTEN
  const connectionString = process.env.DATABASE_URL!;
  const sql = postgres(connectionString);

  const stream = new ReadableStream({
    async start(controller) {
      // Send initial connection successful message
      controller.enqueue(`data: {"type": "connected"}\n\n`);

      try {
        await sql.listen('werewolf_updates', (payload) => {
          // payload is the gameId from NOTIFY werewolf_updates, 'GAME_ID'
          if (payload === gameId || payload === '') {
            controller.enqueue(`data: {"type": "update", "gameId": "${gameId}"}\n\n`);
          }
        });

        // Keep connection alive with pings
        const intervalId = setInterval(() => {
          controller.enqueue(`: ping\n\n`);
        }, 15000);

        // Handle client disconnect
        request.signal.addEventListener('abort', () => {
          clearInterval(intervalId);
          sql.end(); // Close the dedicated connection
          controller.close();
        });
      } catch (err) {
        console.error('SSE Error:', err);
        controller.error(err);
      }
    },
    cancel() {
      sql.end();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache, no-transform',
      Connection: 'keep-alive',
    },
  });
}
