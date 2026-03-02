import { getBets } from './actions';
import { BetFeedTabs } from './components/bet-feed-tabs';

export default async function BetFeedPage() {
  const [open, resolved, mine] = await Promise.all([
    getBets('open'),
    getBets('resolved'),
    getBets('mine'),
  ]);

  return (
    <BetFeedTabs
      openBets={open.success ? open.data : []}
      resolvedBets={resolved.success ? resolved.data : []}
      mineBets={mine.success ? mine.data : []}
    />
  );
}
