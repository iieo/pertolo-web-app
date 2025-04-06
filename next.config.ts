import type { NextConfig } from 'next';
import { withSentryConfig } from '@sentry/nextjs';

const nextConfig = {
  typescript: {
    // should be checked in the pipeline anyway and takes a lot of time during build
    ignoreBuildErrors: true,
  },
  eslint: {
    // should be checked in the pipeline anyway and takes a lot of time during build
    ignoreDuringBuilds: true,
  },
  // if you do not host it on vercel for serverless environment enable this option
  // if you want to host it on vercel, remove this option
  // https://nextjs.org/docs/app/api-reference/config/next-config-js/output#automatically-copying-traced-files
  output: 'standalone',
} satisfies NextConfig;

export default withSentryConfig(nextConfig, {
  org: 'titanom-solutions-gmbh',
  project: 'nextjs-template',
  silent: true,
  disableLogger: true,
});
