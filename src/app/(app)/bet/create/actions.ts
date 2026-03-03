'use server';

import { db } from '@/db';
import { usersTable, betsTable, betOptionsTable, betAccessControlTable } from '@/db/schema';
import { ilike, or } from 'drizzle-orm';
import { Result } from '@/util/types';
import { requireSession } from '@/lib/auth-server';

interface CreateBetInput {
  title: string;
  description?: string;
  options: string[];
  visibility: 'public' | 'private';
  blacklistedUserIds?: string[];
  allowedUserIds?: string[];
}

export async function createBet(input: CreateBetInput): Promise<Result<{ betId: string }>> {
  try {
    const session = await requireSession();

    if (input.options.length < 2) {
      return { success: false, error: 'Mindestens 2 Optionen erforderlich' };
    }

    let betId = '';
    await db.transaction(async (tx) => {
      const [bet] = await tx
        .insert(betsTable)
        .values({
          title: input.title,
          description: input.description,
          ownerId: session.user.id,
          visibility: input.visibility,
        })
        .returning({ id: betsTable.id });

      if (!bet) throw new Error('Wette konnte nicht erstellt werden');
      betId = bet.id;

      await tx.insert(betOptionsTable).values(input.options.map((label) => ({ betId, label })));

      if (input.visibility === 'private' && input.allowedUserIds?.length) {
        await tx.insert(betAccessControlTable).values(
          input.allowedUserIds.map((userId) => ({
            betId,
            userId,
            type: 'whitelist' as const,
          })),
        );
      } else if (input.visibility === 'public' && input.blacklistedUserIds?.length) {
        await tx.insert(betAccessControlTable).values(
          input.blacklistedUserIds.map((userId) => ({
            betId,
            userId,
            type: 'blacklist' as const,
          })),
        );
      }
    });

    return { success: true, data: { betId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Wette konnte nicht erstellt werden';
    return { success: false, error: message };
  }
}

export async function searchUsers(
  query: string,
): Promise<Result<Array<{ id: string; name: string; email: string }>>> {
  try {
    if (!query || query.length < 2) return { success: true, data: [] };

    const users = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(or(ilike(usersTable.name, `%${query}%`), ilike(usersTable.email, `%${query}%`)))
      .limit(20);

    return { success: true, data: users };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Benutzersuche fehlgeschlagen';
    return { success: false, error: message };
  }
}
