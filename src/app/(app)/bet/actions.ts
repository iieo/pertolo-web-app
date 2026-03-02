'use server';

import { db } from '@/db';
import {
  usersTable,
  userProfilesTable,
  betsTable,
  betOptionsTable,
  pointTransactionsTable,
  betAccessControlTable,
} from '@/db/schema';
import { eq, desc, sql, and, ne, inArray } from 'drizzle-orm';
import { Result } from '@/util/types';
import { getSession } from '@/lib/auth-server';

export async function checkLoginBonus(): Promise<Result<{ awarded: boolean; amount: number }>> {
  try {
    const session = await getSession();
    if (!session) return { success: true, data: { awarded: false, amount: 0 } };

    const [profile] = await db
      .select()
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, session.user.id));

    if (!profile) return { success: true, data: { awarded: false, amount: 0 } };

    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    if (profile.lastLoginBonusAt && profile.lastLoginBonusAt > sevenDaysAgo) {
      return { success: true, data: { awarded: false, amount: 0 } };
    }

    const bonusAmount = 500;
    await db.transaction(async (tx) => {
      await tx
        .update(userProfilesTable)
        .set({
          pointsBalance: sql`${userProfilesTable.pointsBalance} + ${bonusAmount}`,
          lastLoginBonusAt: new Date(),
        })
        .where(eq(userProfilesTable.userId, session.user.id));
      await tx.insert(pointTransactionsTable).values({
        userId: session.user.id,
        amount: bonusAmount,
        type: 'login_bonus',
        description: 'Wöchentlicher Login-Bonus',
      });
    });

    return { success: true, data: { awarded: true, amount: bonusAmount } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Login-Bonus Prüfung fehlgeschlagen';
    return { success: false, error: message };
  }
}

export async function getMyBalance(): Promise<Result<number>> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Nicht authentifiziert' };

    const [profile] = await db
      .select({ pointsBalance: userProfilesTable.pointsBalance })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, session.user.id));

    return { success: true, data: profile?.pointsBalance ?? 0 };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Kontostand konnte nicht geladen werden';
    return { success: false, error: message };
  }
}

export async function getBets(filter?: 'open' | 'resolved' | 'mine'): Promise<
  Result<
    Array<{
      id: string;
      title: string;
      description: string | null;
      status: 'open' | 'resolved' | 'cancelled';
      ownerName: string;
      totalPool: number;
      options: Array<{ id: string; label: string; totalPoints: number }>;
      createdAt: Date;
    }>
  >
> {
  try {
    const session = await getSession();
    const userId = session?.user.id;

    let whereClause;
    if (filter === 'open') {
      whereClause = eq(betsTable.status, 'open');
    } else if (filter === 'resolved') {
      whereClause = ne(betsTable.status, 'open');
    } else if (filter === 'mine' && userId) {
      whereClause = eq(betsTable.ownerId, userId);
    }

    const bets = await db
      .select({
        id: betsTable.id,
        title: betsTable.title,
        description: betsTable.description,
        status: betsTable.status,
        ownerId: betsTable.ownerId,
        ownerName: usersTable.name,
        visibility: betsTable.visibility,
        createdAt: betsTable.createdAt,
      })
      .from(betsTable)
      .innerJoin(usersTable, eq(betsTable.ownerId, usersTable.id))
      .where(whereClause)
      .orderBy(desc(betsTable.createdAt));

    let filteredBets = bets;
    if (userId) {
      const blacklisted = await db
        .select({ betId: betAccessControlTable.betId })
        .from(betAccessControlTable)
        .where(
          and(
            eq(betAccessControlTable.userId, userId),
            eq(betAccessControlTable.type, 'blacklist'),
          ),
        );
      const blacklistedIds = new Set(blacklisted.map((b) => b.betId));
      filteredBets = bets.filter((b) => !blacklistedIds.has(b.id));
    }

    const betIds = filteredBets.map((b) => b.id);
    const options =
      betIds.length > 0
        ? await db.select().from(betOptionsTable).where(inArray(betOptionsTable.betId, betIds))
        : [];

    const optionsByBet = new Map<
      string,
      Array<{ id: string; label: string; totalPoints: number }>
    >();
    for (const opt of options) {
      if (!optionsByBet.has(opt.betId)) optionsByBet.set(opt.betId, []);
      optionsByBet.get(opt.betId)!.push({
        id: opt.id,
        label: opt.label,
        totalPoints: opt.totalPoints,
      });
    }

    const result = filteredBets.map((b) => {
      const opts = optionsByBet.get(b.id) ?? [];
      return {
        id: b.id,
        title: b.title,
        description: b.description,
        status: b.status,
        ownerName: b.ownerName,
        totalPool: opts.reduce((sum, o) => sum + o.totalPoints, 0),
        options: opts,
        createdAt: b.createdAt,
      };
    });

    return { success: true, data: result };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Wettdetails konnten nicht geladen werden';
    return { success: false, error: message };
  }
}

export async function getUserPointHistory(
  userId: string,
): Promise<Result<Array<{ date: string; balance: number }>>> {
  try {
    const transactions = await db
      .select({
        amount: pointTransactionsTable.amount,
        createdAt: pointTransactionsTable.createdAt,
      })
      .from(pointTransactionsTable)
      .where(eq(pointTransactionsTable.userId, userId))
      .orderBy(pointTransactionsTable.createdAt);

    let runningBalance = 0;
    const history = transactions.map((tx) => {
      runningBalance += tx.amount;
      return {
        date: tx.createdAt.toISOString(),
        balance: runningBalance,
      };
    });

    return { success: true, data: history };
  } catch (e) {
    const message =
      e instanceof Error ? e.message : 'Punktestand-Verlauf konnte nicht geladen werden';
    return { success: false, error: message };
  }
}
