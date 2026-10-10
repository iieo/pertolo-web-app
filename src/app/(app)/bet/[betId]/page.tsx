import { notFound } from 'next/navigation';
import { BackLink } from '@/components/game/back-link';
import { getBetDetail, getBetChartData } from './actions';
import { getSession } from '@/lib/auth-server';
import { OddsDisplay } from '../components/odds-display';
import { WagerForm } from '../components/wager-form';
import { ResolveForm } from '../components/resolve-form';
import { BetChart } from '../components/bet-chart';
import { STATUS_LABEL, pageClass, sectionTitleClass } from '../components/styles';
import { SellButton } from './sell-button';

export default async function BetDetailPage({ params }: { params: Promise<{ betId: string }> }) {
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

  const chartData = chartResult.success ? chartResult.data : { history: [], lineKeys: [] };

  return (
    <div className={`${pageClass} max-w-3xl`}>
      <BackLink href="/bet" locale="de" label="Zurück zum Feed" />

      <header className="mt-8">
        <p className="text-sm text-white/60">
          {STATUS_LABEL[bet.status]} · von {bet.ownerName}
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight wrap-break-word hyphens-auto md:text-5xl">
          {bet.title}
        </h1>
        {bet.description && (
          <p className="mt-4 text-lg leading-relaxed text-white/70">{bet.description}</p>
        )}
      </header>

      <div className="mt-12 flex flex-col gap-16">
        <BetChart data={chartData.history} lineKeys={chartData.lineKeys} />

        <OddsDisplay
          options={bet.options}
          totalPool={bet.totalPool}
          resolvedOptionId={bet.resolvedOptionId}
        />

        {bet.userWagers.length > 0 && bet.status === 'open' && (
          <section aria-labelledby="my-wagers-heading" className="flex flex-col gap-4">
            <h2 id="my-wagers-heading" className={sectionTitleClass}>
              Deine aktiven Wetten
            </h2>
            <ul className="flex flex-col gap-2">
              {bet.userWagers.map((wager) => {
                const opt = bet.options.find((o) => o.id === wager.optionId);
                if (!opt) return null;
                const value = wager.currentValue - wager.creatorFee;

                return (
                  <li
                    key={wager.id}
                    className="flex flex-col gap-4 rounded-xl border border-white/15 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-6"
                  >
                    <div className="min-w-0">
                      <p className="text-base font-semibold wrap-break-word">{opt.label}</p>
                      <p className="mt-1 text-sm text-white/60 tabular-nums">
                        Eingesetzt: {wager.amount.toLocaleString()} Punkte
                      </p>
                    </div>
                    <div className="flex items-center justify-between gap-6 sm:justify-end">
                      <div className="flex flex-col sm:items-end">
                        <span className="text-sm text-white/60">Aktueller Wert</span>
                        <span className="text-lg font-semibold tabular-nums">
                          {value.toLocaleString()} Punkte
                        </span>
                        {wager.creatorFee > 0 && (
                          <span className="text-sm text-white/60">abzüglich 10% Ersteller-Fee</span>
                        )}
                      </div>
                      <SellButton wagerId={wager.id} cashout={value} />
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>
        )}

        {bet.userWagers.length > 0 && bet.status !== 'open' && (
          <p className="text-lg text-white/70">
            Du hast{' '}
            <span className="font-semibold text-white tabular-nums">
              {userTotalWagered.toLocaleString()}
            </span>{' '}
            Punkte gesetzt
          </p>
        )}

        {bet.status === 'open' && (
          <WagerForm betId={bet.id} totalPool={bet.totalPool} options={bet.options} />
        )}

        {isOwner && bet.status === 'open' && <ResolveForm betId={bet.id} options={bet.options} />}
      </div>
    </div>
  );
}
