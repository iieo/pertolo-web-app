'use server';

import { db } from '@/db';
import {
  usersTable,
  userProfilesTable,
  betsTable,
  betOptionsTable,
  wagersTable,
  pointTransactionsTable,
  betAccessControlTable,
} from '@/db/schema';
import { eq, desc, sql, and, ne, ilike, inArray } from 'drizzle-orm';
import { Result } from '@/util/types';
import { getSession, requireSession } from '@/lib/auth-server';
import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

// ─── Auth Actions ─────────────────────────────────────────────────────────────

export async function registerUser(
  name: string,
  email: string,
  password: string
): Promise<Result<{ userId: string }>> {
  try {
    const result = await auth.api.signUpEmail({
      body: { name, email, password },
      headers: await headers(),
    });

    if (!result?.user?.id) {
      return { success: false, error: 'Registration failed' };
    }

    const userId = result.user.id;

    // Create profile + signup bonus in a transaction
    await db.transaction(async (tx) => {
      await tx.insert(userProfilesTable).values({
        userId,
        pointsBalance: 10000,
      });
      await tx.insert(pointTransactionsTable).values({
        userId,
        amount: 10000,
        type: 'signup_bonus',
        description: 'Welcome bonus',
      });
    });

    return { success: true, data: { userId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Registration failed';
    return { success: false, error: message };
  }
}

export async function checkLoginBonus(): Promise<
  Result<{ awarded: boolean; amount: number }>
> {
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
        description: 'Weekly login bonus',
      });
    });

    return { success: true, data: { awarded: true, amount: bonusAmount } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to check login bonus';
    return { success: false, error: message };
  }
}

export async function getMyBalance(): Promise<Result<number>> {
  try {
    const session = await getSession();
    if (!session) return { success: false, error: 'Not authenticated' };

    const [profile] = await db
      .select({ pointsBalance: userProfilesTable.pointsBalance })
      .from(userProfilesTable)
      .where(eq(userProfilesTable.userId, session.user.id));

    return { success: true, data: profile?.pointsBalance ?? 0 };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get balance';
    return { success: false, error: message };
  }
}

// ─── Bet Actions ──────────────────────────────────────────────────────────────

interface CreateBetInput {
  title: string;
  description?: string;
  options: string[];
  visibility: 'public' | 'private';
  blacklistedUserIds?: string[];
}

export async function createBet(input: CreateBetInput): Promise<Result<{ betId: string }>> {
  try {
    const session = await requireSession();

    if (input.options.length < 2) {
      return { success: false, error: 'At least 2 options required' };
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

      if (!bet) throw new Error('Failed to create bet');
      betId = bet.id;

      await tx.insert(betOptionsTable).values(
        input.options.map((label) => ({
          betId: betId,
          label,
        }))
      );

      if (input.visibility === 'private' && input.blacklistedUserIds?.length) {
        await tx.insert(betAccessControlTable).values(
          input.blacklistedUserIds.map((userId) => ({
            betId: betId,
            userId,
            type: 'blacklist' as const,
          }))
        );
      }
    });

    return { success: true, data: { betId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to create bet';
    return { success: false, error: message };
  }
}

export async function getBets(
  filter?: 'open' | 'resolved' | 'mine'
): Promise<
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

    // Filter out blacklisted bets
    let filteredBets = bets;
    if (userId) {
      const blacklisted = await db
        .select({ betId: betAccessControlTable.betId })
        .from(betAccessControlTable)
        .where(
          and(
            eq(betAccessControlTable.userId, userId),
            eq(betAccessControlTable.type, 'blacklist')
          )
        );
      const blacklistedIds = new Set(blacklisted.map((b) => b.betId));
      filteredBets = bets.filter((b) => !blacklistedIds.has(b.id));
    }

    // Get options for all bets
    const betIds = filteredBets.map((b) => b.id);
    const options =
      betIds.length > 0
        ? await db
            .select()
            .from(betOptionsTable)
            .where(inArray(betOptionsTable.betId, betIds))
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
    const message = e instanceof Error ? e.message : 'Failed to get bets';
    return { success: false, error: message };
  }
}

export async function getBetDetail(betId: string): Promise<
  Result<{
    id: string;
    title: string;
    description: string | null;
    status: 'open' | 'resolved' | 'cancelled';
    visibility: 'public' | 'private';
    ownerName: string;
    ownerId: string;
    resolvedOptionId: string | null;
    totalPool: number;
    options: Array<{ id: string; label: string; totalPoints: number }>;
    userWagers: Array<{ optionId: string; amount: number }>;
    createdAt: Date;
  }>
> {
  try {
    const session = await getSession();
    const userId = session?.user.id;

    const [bet] = await db
      .select({
        id: betsTable.id,
        title: betsTable.title,
        description: betsTable.description,
        status: betsTable.status,
        visibility: betsTable.visibility,
        ownerId: betsTable.ownerId,
        ownerName: usersTable.name,
        resolvedOptionId: betsTable.resolvedOptionId,
        createdAt: betsTable.createdAt,
      })
      .from(betsTable)
      .innerJoin(usersTable, eq(betsTable.ownerId, usersTable.id))
      .where(eq(betsTable.id, betId));

    if (!bet) return { success: false, error: 'Bet not found' };

    // Check access control
    if (userId && bet.visibility === 'private') {
      const [blocked] = await db
        .select()
        .from(betAccessControlTable)
        .where(
          and(
            eq(betAccessControlTable.betId, betId),
            eq(betAccessControlTable.userId, userId),
            eq(betAccessControlTable.type, 'blacklist')
          )
        );
      if (blocked) return { success: false, error: 'Access denied' };
    }

    const options = await db
      .select()
      .from(betOptionsTable)
      .where(eq(betOptionsTable.betId, betId));

    const userWagers = userId
      ? await db
          .select({ optionId: wagersTable.optionId, amount: wagersTable.amount })
          .from(wagersTable)
          .where(and(eq(wagersTable.betId, betId), eq(wagersTable.userId, userId)))
      : [];

    const totalPool = options.reduce((sum, o) => sum + o.totalPoints, 0);

    return {
      success: true,
      data: {
        id: bet.id,
        title: bet.title,
        description: bet.description,
        status: bet.status,
        visibility: bet.visibility,
        ownerName: bet.ownerName,
        ownerId: bet.ownerId,
        resolvedOptionId: bet.resolvedOptionId,
        totalPool,
        options: options.map((o) => ({
          id: o.id,
          label: o.label,
          totalPoints: o.totalPoints,
        })),
        userWagers,
        createdAt: bet.createdAt,
      },
    };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get bet detail';
    return { success: false, error: message };
  }
}

export async function placeWager(
  betId: string,
  optionId: string,
  amount: number
): Promise<Result<{ wagerId: string }>> {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    if (amount <= 0) return { success: false, error: 'Amount must be positive' };

    let wagerId = '';
    await db.transaction(async (tx) => {
      // Check bet is open
      const [bet] = await tx
        .select({ status: betsTable.status })
        .from(betsTable)
        .where(eq(betsTable.id, betId));
      if (!bet || bet.status !== 'open') throw new Error('Bet is not open');

      // Check option belongs to bet
      const [option] = await tx
        .select()
        .from(betOptionsTable)
        .where(and(eq(betOptionsTable.id, optionId), eq(betOptionsTable.betId, betId)));
      if (!option) throw new Error('Invalid option');

      // Check balance
      const [profile] = await tx
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.userId, userId));
      if (!profile || profile.pointsBalance < amount) throw new Error('Insufficient balance');

      // Deduct balance
      await tx
        .update(userProfilesTable)
        .set({
          pointsBalance: sql`${userProfilesTable.pointsBalance} - ${amount}`,
        })
        .where(eq(userProfilesTable.userId, userId));

      // Insert wager
      const [wager] = await tx
        .insert(wagersTable)
        .values({ betId, optionId, userId, amount })
        .returning({ id: wagersTable.id });
      if (!wager) throw new Error('Failed to create wager');
      wagerId = wager.id;

      // Update option total
      await tx
        .update(betOptionsTable)
        .set({
          totalPoints: sql`${betOptionsTable.totalPoints} + ${amount}`,
        })
        .where(eq(betOptionsTable.id, optionId));

      // Record transaction
      await tx.insert(pointTransactionsTable).values({
        userId,
        amount: -amount,
        type: 'wager',
        description: `Wager on bet`,
      });
    });

    return { success: true, data: { wagerId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to place wager';
    return { success: false, error: message };
  }
}

export async function resolveBet(
  betId: string,
  winningOptionId: string
): Promise<Result<{ payouts: number }>> {
  try {
    const session = await requireSession();

    let totalPayouts = 0;
    await db.transaction(async (tx) => {
      const [bet] = await tx
        .select()
        .from(betsTable)
        .where(eq(betsTable.id, betId));
      if (!bet) throw new Error('Bet not found');
      if (bet.ownerId !== session.user.id) throw new Error('Only the owner can resolve');
      if (bet.status !== 'open') throw new Error('Bet is not open');

      // Verify option belongs to bet
      const [option] = await tx
        .select()
        .from(betOptionsTable)
        .where(and(eq(betOptionsTable.id, winningOptionId), eq(betOptionsTable.betId, betId)));
      if (!option) throw new Error('Invalid winning option');

      // Get all options to calculate pool
      const options = await tx
        .select()
        .from(betOptionsTable)
        .where(eq(betOptionsTable.betId, betId));
      const totalPool = options.reduce((sum, o) => sum + o.totalPoints, 0);
      const winningTotal = option.totalPoints;

      // Mark bet as resolved
      await tx
        .update(betsTable)
        .set({ status: 'resolved', resolvedOptionId: winningOptionId })
        .where(eq(betsTable.id, betId));

      if (winningTotal > 0 && totalPool > 0) {
        // Get winning wagers
        const winningWagers = await tx
          .select()
          .from(wagersTable)
          .where(
            and(eq(wagersTable.betId, betId), eq(wagersTable.optionId, winningOptionId))
          );

        for (const wager of winningWagers) {
          const payout = Math.floor((wager.amount / winningTotal) * totalPool);
          totalPayouts += payout;

          // Update wager payout
          await tx
            .update(wagersTable)
            .set({ payout })
            .where(eq(wagersTable.id, wager.id));

          // Credit user
          await tx
            .update(userProfilesTable)
            .set({
              pointsBalance: sql`${userProfilesTable.pointsBalance} + ${payout}`,
            })
            .where(eq(userProfilesTable.userId, wager.userId));

          // Record payout transaction
          await tx.insert(pointTransactionsTable).values({
            userId: wager.userId,
            amount: payout,
            type: 'payout',
            description: `Payout from bet`,
          });
        }
      }

      // Mark losing wagers with 0 payout
      await tx
        .update(wagersTable)
        .set({ payout: 0 })
        .where(
          and(
            eq(wagersTable.betId, betId),
            ne(wagersTable.optionId, winningOptionId)
          )
        );
    });

    return { success: true, data: { payouts: totalPayouts } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to resolve bet';
    return { success: false, error: message };
  }
}

export async function cancelBet(betId: string): Promise<Result<{ refunded: number }>> {
  try {
    const session = await requireSession();

    let totalRefunded = 0;
    await db.transaction(async (tx) => {
      const [bet] = await tx
        .select()
        .from(betsTable)
        .where(eq(betsTable.id, betId));
      if (!bet) throw new Error('Bet not found');
      if (bet.ownerId !== session.user.id) throw new Error('Only the owner can cancel');
      if (bet.status !== 'open') throw new Error('Bet is not open');

      // Get all wagers
      const allWagers = await tx
        .select()
        .from(wagersTable)
        .where(eq(wagersTable.betId, betId));

      // Refund each wager
      for (const wager of allWagers) {
        totalRefunded += wager.amount;

        await tx
          .update(userProfilesTable)
          .set({
            pointsBalance: sql`${userProfilesTable.pointsBalance} + ${wager.amount}`,
          })
          .where(eq(userProfilesTable.userId, wager.userId));

        await tx
          .update(wagersTable)
          .set({ payout: wager.amount })
          .where(eq(wagersTable.id, wager.id));

        await tx.insert(pointTransactionsTable).values({
          userId: wager.userId,
          amount: wager.amount,
          type: 'refund',
          description: `Refund from cancelled bet`,
        });
      }

      await tx
        .update(betsTable)
        .set({ status: 'cancelled' })
        .where(eq(betsTable.id, betId));
    });

    return { success: true, data: { refunded: totalRefunded } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to cancel bet';
    return { success: false, error: message };
  }
}

export async function getLeaderboard(): Promise<
  Result<Array<{ userId: string; name: string; pointsBalance: number }>>
> {
  try {
    const rows = await db
      .select({
        userId: userProfilesTable.userId,
        name: usersTable.name,
        pointsBalance: userProfilesTable.pointsBalance,
      })
      .from(userProfilesTable)
      .innerJoin(usersTable, eq(userProfilesTable.userId, usersTable.id))
      .orderBy(desc(userProfilesTable.pointsBalance))
      .limit(50);

    return { success: true, data: rows };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to get leaderboard';
    return { success: false, error: message };
  }
}

export async function getUserPointHistory(
  userId: string
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
    const message = e instanceof Error ? e.message : 'Failed to get point history';
    return { success: false, error: message };
  }
}

export async function searchUsers(
  query: string
): Promise<Result<Array<{ id: string; name: string; email: string }>>> {
  try {
    if (!query || query.length < 2)
      return { success: true, data: [] };

    const users = await db
      .select({ id: usersTable.id, name: usersTable.name, email: usersTable.email })
      .from(usersTable)
      .where(ilike(usersTable.name, `%${query}%`))
      .limit(20);

    return { success: true, data: users };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Failed to search users';
    return { success: false, error: message };
  }
}
