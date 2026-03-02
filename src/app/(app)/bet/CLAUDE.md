# Bet Module

**Pertolo Bets** is a prediction market / betting game where users spend points on outcomes, with odds shifting as the pool grows.

## Routes

| Route | File | Purpose |
|---|---|---|
| `/bet` | `page.tsx` | Feed with open/resolved/mine tabs |
| `/bet/[betId]` | `[betId]/page.tsx` | Bet detail: odds, wager placement, resolution |
| `/bet/create` | `create/page.tsx` | Create a new bet |
| `/bet/login` | `login/page.tsx` | Email/password login |
| `/bet/register` | `register/page.tsx` | Registration (+10,000 signup bonus) |
| `/bet/leaderboard` | `leaderboard/page.tsx` | Top 50 users by points |
| `/bet/profile` | `profile/page.tsx` | Balance, transaction history, logout |

## State Management

`bet-provider.tsx` — `BetProvider` wraps the entire module via `layout.tsx`.
- `useBet()` hook exposes `{ balance, refreshBalance }`
- On mount: fetches balance via `getMyBalance()`, checks weekly login bonus via `checkLoginBonus()` (500 pts every 7 days)

Bets are **not phase-based**. Lifecycle is managed by a `status` field:
- `open` → accepting wagers
- `resolved` → winner selected, payouts distributed
- `cancelled` → all wagers refunded

## Authentication

Uses `better-auth` via `@/lib/auth-client` and `@/lib/auth-server`.

- `getSession()` — optional session check (returns null if unauthenticated)
- `requireSession()` — throws if unauthenticated; used in all mutating actions
- `useSession()` — client-side session hook

All UI text and error messages are in **German**.

## Server Actions (`actions.ts`)

All actions return `Result<T>` (`{ success: true, data } | { success: false, error }`).

### Auth
- `registerUser(name, email, password)` — creates user + profile + 10k bonus transaction
- `checkLoginBonus()` — awards 500 pts if 7+ days since last bonus
- `getMyBalance()` — current user's points balance

### Bets
- `createBet(input)` — 2–10 options, public/private with blacklist access control
- `getBets(filter?)` — `'open' | 'resolved' | 'mine'`, respects blacklist
- `getBetDetail(betId)` — full details + user's wagers + access check

### Wagering
- `placeWager(betId, optionId, amount)` — deducts balance, creates wager, updates option total, logs transaction
- `sellWager(wagerId)` — proportional cashout; reduces all option totals by cashout ratio

### Resolution (owner only)
- `resolveBet(betId, winningOptionId)` — distributes pool proportionally to winners
- `cancelBet(betId)` — refunds all wagers

### Analytics
- `getLeaderboard()` — top 50 by points
- `getUserPointHistory(userId)` — transactions with running balance
- `getBetChartData(betId)` — odds evolution timeline (percentage per option over time)
- `searchUsers(query)` — name search for blacklist

## Key Components

| Component | Purpose |
|---|---|
| `navigation.tsx` | Sticky sidebar (desktop) + bottom nav (mobile) |
| `bet-card.tsx` | Feed preview: title, status badge, pool, mini option bars |
| `odds-display.tsx` | Odds bars, percentages, multipliers; highlights winner |
| `wager-form.tsx` | Place/sell wager; quick amounts (100/500/1k/all-in); shows potential payout |
| `create-bet-form.tsx` | Title, description, 2–10 options, public/private toggle |
| `resolve-form.tsx` | Owner-only: pick winner or cancel |
| `bet-chart.tsx` | Recharts line chart: odds % over time |
| `point-history-chart.tsx` | Recharts line chart: running balance from transactions |
| `user-drawer.tsx` | User avatar, rank, balance, point history |

## Database Tables

- `usersTable` — identity (better-auth managed)
- `userProfilesTable` — points balance + last login bonus timestamp
- `betsTable` — bet records (status, owner, resolved option, visibility)
- `betOptionsTable` — options with running `totalPoints`
- `wagersTable` — individual wagers (amount, payout after resolution)
- `pointTransactionsTable` — full audit log (signup/login/wager/payout/refund)
- `betAccessControlTable` — private bet blacklist rules

## Odds & Payout Formulas

```
% odds     = optionTotal / totalPool * 100
multiplier = totalPool / optionTotal
payout     = floor((wagerAmount / winningTotal) * totalPool)
```

**Sell cashout:**
```
cashout       = floor((wagerAmount / optionTotal) * totalPool)
newRatio      = (totalPool - cashout) / totalPool
allOptionTotals *= newRatio  (floor per option)
```

## Conventions

- **Points currency**: displayed as `balance.toLocaleString()` + "Pkte"
- **Form validation**: `react-hook-form` + `zod`
- **Styling**: Tailwind v4, dark theme, amber accent (`#f59e0b` / `amber-500`)
- **Responsive**: `md:hidden` / `hidden md:block` for sidebar vs bottom nav split
- **Loading states**: `animate-pulse` skeleton cards, spinner on submit buttons
- **Toasts**: `sonner` for success/error feedback
