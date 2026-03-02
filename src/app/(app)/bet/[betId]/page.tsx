import { notFound } from 'next/navigation';
import { getBetDetail, getBetChartData } from './actions';
import { getSession } from '@/lib/auth-server';
import { OddsDisplay } from '../components/odds-display';
import { WagerForm } from '../components/wager-form';
import { ResolveForm } from '../components/resolve-form';
import { BetChart } from '../components/bet-chart';
import { SellButton } from './sell-button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Coins } from 'lucide-react';
import Link from 'next/link';

export default async function BetDetailPage({
  params,
}: {
  params: Promise<{ betId: string }>;
}) {
  const { betId } = await params;

  const [betResult, chartResult, session] = await Promise.all([
    getBetDetail(betId),
    getBetChartData(betId),
    getSession(),
  ]);

  if (!betResult.success) {
    notFound();
  }

  const bet = betResult.data;
  const isOwner = session?.user?.id === bet.ownerId;
  const userTotalWagered = bet.userWagers.reduce((sum, w) => sum + w.amount, 0);

  const statusColor = {
    open: 'bg-green-500/20 text-green-400 border-green-500/30',
    resolved: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    cancelled: 'bg-red-500/20 text-red-400 border-red-500/30',
  }[bet.status];

  const statusLabel = {
    open: 'Offen',
    resolved: 'Beendet',
    cancelled: 'Storniert',
  }[bet.status];

  const chartData = chartResult.success ? chartResult.data : { history: [], lineKeys: [] };

  return (
    <div className="mx-auto max-w-3xl space-y-5 px-4 pt-6">
      <Link
        href="/bet"
        className="flex items-center gap-1 text-sm text-white/40 transition-colors hover:text-white/70"
      >
        <ArrowLeft size={16} />
        Zurück zum Feed
      </Link>

      <div>
        <div className="mb-2 flex items-center gap-2">
          <Badge variant="outline" className={statusColor}>
            {statusLabel}
          </Badge>
          <span className="text-xs text-white/40">von {bet.ownerName}</span>
        </div>
        <h1 className="text-2xl font-extrabold text-white">{bet.title}</h1>
        {bet.description && <p className="mt-1 text-sm text-white/50">{bet.description}</p>}
      </div>

      <BetChart data={chartData.history} lineKeys={chartData.lineKeys} />

      <OddsDisplay
        options={bet.options}
        totalPool={bet.totalPool}
        resolvedOptionId={bet.resolvedOptionId}
      />

      {bet.userWagers.length > 0 && bet.status === 'open' && (
        <div className="space-y-2">
          <h3 className="text-sm font-semibold text-white/70">Deine aktiven Wetten</h3>
          <div className="grid gap-2">
            {bet.userWagers.map((wager) => {
              const opt = bet.options.find((o) => o.id === wager.optionId);
              if (!opt) return null;

              return (
                <div
                  key={wager.id}
                  className="flex flex-col gap-3 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="flex flex-row items-center justify-between sm:flex-col sm:items-start sm:justify-center">
                    <span className="max-w-[60%] truncate text-sm font-bold text-white sm:max-w-full">
                      {opt.label}
                    </span>
                    <span className="text-xs text-white/50">
                      Eingesetzt: {wager.amount.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3 rounded-lg border border-amber-500/10 bg-amber-500/10 p-2.5 sm:border-none sm:bg-transparent sm:p-0">
                    <div className="flex flex-col sm:items-end">
                      <span className="text-[11px] uppercase tracking-wider text-white/50 sm:text-xs sm:normal-case sm:tracking-normal">
                        Aktueller Wert
                      </span>
                      <div className="flex items-center gap-1 font-bold text-amber-400">
                        <Coins size={14} />
                        <span>{wager.amount.toLocaleString()}</span>
                      </div>
                    </div>
                    <SellButton wagerId={wager.id} cashout={wager.amount} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {bet.userWagers.length > 0 && bet.status !== 'open' && (
        <div className="flex items-center gap-2 rounded-xl border border-amber-500/20 bg-amber-500/5 p-3">
          <Coins size={16} className="text-amber-400" />
          <span className="text-sm text-white/70">
            Du hast{' '}
            <span className="font-bold text-amber-400">{userTotalWagered.toLocaleString()}</span>{' '}
            Punkte gesetzt
          </span>
        </div>
      )}

      {bet.status === 'open' && (
        <WagerForm betId={bet.id} totalPool={bet.totalPool} options={bet.options} />
      )}

      {isOwner && bet.status === 'open' && <ResolveForm betId={bet.id} options={bet.options} />}
    </div>
  );
}
