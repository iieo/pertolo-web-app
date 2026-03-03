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
import { eq, sql, and, ne } from 'drizzle-orm';
import { Result } from '@/util/types';
import { getSession, requireSession } from '@/lib/auth-server';

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
    userWagers: Array<{
      id: string;
      optionId: string;
      amount: number;
      currentValue: number;
      creatorFee: number;
    }>;
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

    if (!bet) return { success: false, error: 'Wette nicht gefunden' };

    if (userId && bet.visibility === 'private') {
      const [blocked] = await db
        .select()
        .from(betAccessControlTable)
        .where(
          and(
            eq(betAccessControlTable.betId, betId),
            eq(betAccessControlTable.userId, userId),
            eq(betAccessControlTable.type, 'blacklist'),
          ),
        );
      if (blocked) return { success: false, error: 'Zugriff verweigert' };
    }

    const options = await db.select().from(betOptionsTable).where(eq(betOptionsTable.betId, betId));

    const userWagersRaw = userId
      ? await db
          .select({
            id: wagersTable.id,
            optionId: wagersTable.optionId,
            amount: wagersTable.amount,
            purchaseOdds: wagersTable.purchaseOdds,
          })
          .from(wagersTable)
          .where(and(eq(wagersTable.betId, betId), eq(wagersTable.userId, userId)))
      : [];

    const totalPool = options.reduce((sum, o) => sum + o.totalPoints, 0);

    const userWagers = userWagersRaw.map((wager) => {
      const targetOption = options.find((o) => o.id === wager.optionId);
      const currentOdds = targetOption && totalPool > 0 ? targetOption.totalPoints / totalPool : 0;

      let kurswert = wager.amount;
      if (wager.purchaseOdds && wager.purchaseOdds > 0 && currentOdds > 0) {
        kurswert = Math.floor(wager.amount * (currentOdds / wager.purchaseOdds));
      }

      const creatorFee = bet.ownerId === userId ? 0 : Math.floor(kurswert * 0.1);

      return {
        id: wager.id,
        optionId: wager.optionId,
        amount: wager.amount,
        currentValue: kurswert,
        creatorFee,
      };
    });

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
  amount: number,
): Promise<Result<{ wagerId: string }>> {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    if (amount <= 0) return { success: false, error: 'Betrag muss positiv sein' };

    let wagerId = '';
    await db.transaction(async (tx) => {
      const [bet] = await tx
        .select({ status: betsTable.status })
        .from(betsTable)
        .where(eq(betsTable.id, betId));
      if (!bet || bet.status !== 'open') throw new Error('Wette ist nicht offen');

      const [option] = await tx
        .select()
        .from(betOptionsTable)
        .where(and(eq(betOptionsTable.id, optionId), eq(betOptionsTable.betId, betId)));
      if (!option) throw new Error('Ungültige Option');

      const options = await tx
        .select()
        .from(betOptionsTable)
        .where(eq(betOptionsTable.betId, betId));

      const totalPoolBefore = options.reduce((sum, o) => sum + o.totalPoints, 0);
      const totalPoolAfter = totalPoolBefore + amount;
      const optionTotalAfter = option.totalPoints + amount;
      const purchaseOdds = totalPoolAfter > 0 ? optionTotalAfter / totalPoolAfter : 1;

      const [profile] = await tx
        .select()
        .from(userProfilesTable)
        .where(eq(userProfilesTable.userId, userId));
      if (!profile || profile.pointsBalance < amount) throw new Error('Nicht genügend Guthaben');

      await tx
        .update(userProfilesTable)
        .set({ pointsBalance: sql`${userProfilesTable.pointsBalance} - ${amount}` })
        .where(eq(userProfilesTable.userId, userId));

      const [wager] = await tx
        .insert(wagersTable)
        .values({ betId, optionId, userId, amount, purchaseOdds })
        .returning({ id: wagersTable.id });
      if (!wager) throw new Error('Einsatz fehlgeschlagen');
      wagerId = wager.id;

      await tx
        .update(betOptionsTable)
        .set({ totalPoints: sql`${betOptionsTable.totalPoints} + ${amount}` })
        .where(eq(betOptionsTable.id, optionId));

      await tx.insert(pointTransactionsTable).values({
        userId,
        amount: -amount,
        type: 'wager',
        description: `Einsatz auf Wette`,
      });
    });

    return { success: true, data: { wagerId } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Einsatz fehlgeschlagen';
    return { success: false, error: message };
  }
}

export async function sellWager(wagerId: string): Promise<Result<{ cashout: number }>> {
  try {
    const session = await requireSession();
    const userId = session.user.id;

    let cashout = 0;
    await db.transaction(async (tx) => {
      const [wager] = await tx
        .select()
        .from(wagersTable)
        .where(and(eq(wagersTable.id, wagerId), eq(wagersTable.userId, userId)));

      if (!wager) throw new Error('Einsatz nicht gefunden');

      const [bet] = await tx.select().from(betsTable).where(eq(betsTable.id, wager.betId));
      if (!bet || bet.status !== 'open') throw new Error('Wette ist nicht offen');

      const options = await tx
        .select()
        .from(betOptionsTable)
        .where(eq(betOptionsTable.betId, wager.betId));

      const targetOption = options.find((o) => o.id === wager.optionId);
      if (!targetOption) throw new Error('Option nicht gefunden');
      if (targetOption.totalPoints === 0) throw new Error('Ungültiger Options-Gesamtwert');

      const totalPool = options.reduce((sum, o) => sum + o.totalPoints, 0);
      const currentOdds = totalPool > 0 ? targetOption.totalPoints / totalPool : 0;

      let kurswert = wager.amount;
      if (wager.purchaseOdds && wager.purchaseOdds > 0 && currentOdds > 0) {
        kurswert = Math.floor(wager.amount * (currentOdds / wager.purchaseOdds));
      }

      const creatorFee = bet.ownerId === userId ? 0 : Math.floor(kurswert * 0.1);
      cashout = kurswert - creatorFee;

      await tx
        .update(betOptionsTable)
        .set({ totalPoints: sql`${betOptionsTable.totalPoints} - ${wager.amount}` })
        .where(eq(betOptionsTable.id, wager.optionId));

      await tx.delete(wagersTable).where(eq(wagersTable.id, wagerId));

      await tx
        .update(userProfilesTable)
        .set({ pointsBalance: sql`${userProfilesTable.pointsBalance} + ${cashout}` })
        .where(eq(userProfilesTable.userId, userId));

      await tx.insert(pointTransactionsTable).values({
        userId,
        amount: cashout,
        type: 'payout',
        description: 'Einsatz zu aktuellen Quoten verkauft',
      });

      if (creatorFee > 0) {
        await tx
          .update(userProfilesTable)
          .set({ pointsBalance: sql`${userProfilesTable.pointsBalance} + ${creatorFee}` })
          .where(eq(userProfilesTable.userId, bet.ownerId));

        await tx.insert(pointTransactionsTable).values({
          userId: bet.ownerId,
          amount: creatorFee,
          type: 'payout',
          description: 'Provision aus verkauftem Einsatz',
        });
      }
    });

    return { success: true, data: { cashout } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Verkauf des Einsatzes fehlgeschlagen';
    return { success: false, error: message };
  }
}

export async function resolveBet(
  betId: string,
  winningOptionId: string,
): Promise<Result<{ payouts: number }>> {
  try {
    const session = await requireSession();

    let totalPayouts = 0;
    await db.transaction(async (tx) => {
      const [bet] = await tx.select().from(betsTable).where(eq(betsTable.id, betId));
      if (!bet) throw new Error('Wette nicht gefunden');
      if (bet.ownerId !== session.user.id)
        throw new Error('Nur der Ersteller kann die Wette auswerten');
      if (bet.status !== 'open') throw new Error('Wette ist nicht offen');

      const [option] = await tx
        .select()
        .from(betOptionsTable)
        .where(and(eq(betOptionsTable.id, winningOptionId), eq(betOptionsTable.betId, betId)));
      if (!option) throw new Error('Ungültige gewinnende Option');

      const options = await tx
        .select()
        .from(betOptionsTable)
        .where(eq(betOptionsTable.betId, betId));
      const totalPool = options.reduce((sum, o) => sum + o.totalPoints, 0);
      const winningTotal = option.totalPoints;

      await tx
        .update(betsTable)
        .set({ status: 'resolved', resolvedOptionId: winningOptionId })
        .where(eq(betsTable.id, betId));

      if (winningTotal > 0 && totalPool > 0) {
        const winningWagers = await tx
          .select()
          .from(wagersTable)
          .where(and(eq(wagersTable.betId, betId), eq(wagersTable.optionId, winningOptionId)));

        for (const wager of winningWagers) {
          const payout = Math.floor((wager.amount / winningTotal) * totalPool);
          totalPayouts += payout;

          await tx.update(wagersTable).set({ payout }).where(eq(wagersTable.id, wager.id));

          await tx
            .update(userProfilesTable)
            .set({ pointsBalance: sql`${userProfilesTable.pointsBalance} + ${payout}` })
            .where(eq(userProfilesTable.userId, wager.userId));

          await tx.insert(pointTransactionsTable).values({
            userId: wager.userId,
            amount: payout,
            type: 'payout',
            description: `Auszahlung von Wette`,
          });
        }
      }

      await tx
        .update(wagersTable)
        .set({ payout: 0 })
        .where(and(eq(wagersTable.betId, betId), ne(wagersTable.optionId, winningOptionId)));
    });

    return { success: true, data: { payouts: totalPayouts } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Auswertung fehlgeschlagen';
    return { success: false, error: message };
  }
}

export async function cancelBet(betId: string): Promise<Result<{ refunded: number }>> {
  try {
    const session = await requireSession();

    let totalRefunded = 0;
    await db.transaction(async (tx) => {
      const [bet] = await tx.select().from(betsTable).where(eq(betsTable.id, betId));
      if (!bet) throw new Error('Wette nicht gefunden');
      if (bet.ownerId !== session.user.id)
        throw new Error('Nur der Ersteller kann die Wette stornieren');
      if (bet.status !== 'open') throw new Error('Wette ist nicht offen');

      const allWagers = await tx.select().from(wagersTable).where(eq(wagersTable.betId, betId));

      for (const wager of allWagers) {
        totalRefunded += wager.amount;

        await tx
          .update(userProfilesTable)
          .set({ pointsBalance: sql`${userProfilesTable.pointsBalance} + ${wager.amount}` })
          .where(eq(userProfilesTable.userId, wager.userId));

        await tx
          .update(wagersTable)
          .set({ payout: wager.amount })
          .where(eq(wagersTable.id, wager.id));

        await tx.insert(pointTransactionsTable).values({
          userId: wager.userId,
          amount: wager.amount,
          type: 'refund',
          description: `Erstattung von stornierter Wette`,
        });
      }

      await tx.update(betsTable).set({ status: 'cancelled' }).where(eq(betsTable.id, betId));
    });

    return { success: true, data: { refunded: totalRefunded } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Stornierung fehlgeschlagen';
    return { success: false, error: message };
  }
}

export async function getBetChartData(
  betId: string,
): Promise<Result<{ history: Array<{ date: string; [key: string]: any }>; lineKeys: string[] }>> {
  try {
    const wagers = await db
      .select({
        amount: wagersTable.amount,
        optionId: wagersTable.optionId,
        createdAt: wagersTable.createdAt,
      })
      .from(wagersTable)
      .where(eq(wagersTable.betId, betId))
      .orderBy(wagersTable.createdAt);

    const options = await db
      .select({ id: betOptionsTable.id, label: betOptionsTable.label })
      .from(betOptionsTable)
      .where(eq(betOptionsTable.betId, betId));

    const history: Array<{ date: string; [key: string]: any }> = [];
    const totals: Record<string, number> = {};
    const lineKeys = options.map((o) => o.label);
    lineKeys.forEach((key) => {
      totals[key] = 0;
    });

    let globalTotal = 0;

    for (const wager of wagers) {
      const option = options.find((o) => o.id === wager.optionId);
      if (!option) continue;

      totals[option.label] = (totals[option.label] || 0) + wager.amount;
      globalTotal += wager.amount;

      const dataPoint: { date: string; [key: string]: any } = {
        date:
          new Date(wager.createdAt).toLocaleDateString() +
          ' ' +
          new Date(wager.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };

      lineKeys.forEach((key) => {
        dataPoint[key] = globalTotal > 0 ? Math.round(((totals[key] || 0) / globalTotal) * 100) : 0;
      });

      history.push(dataPoint);
    }

    return { success: true, data: { history, lineKeys } };
  } catch (e) {
    const message = e instanceof Error ? e.message : 'Diagrammdaten konnten nicht geladen werden';
    return { success: false, error: message };
  }
}
