import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://108870579ecf35102d5b7ef28d971010@o4508919006756864.ingest.de.sentry.io/4508958135484496',
  environment: process.env.NEXT_PUBLIC_SENTRY_ENV,

  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
});
