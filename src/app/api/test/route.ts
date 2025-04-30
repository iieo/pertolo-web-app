// src/app/api/test/route.ts
import type { NextRequest } from 'next/server';

export const dynamic = 'force-dynamic';

type Location = {
  country?: string;
  region?: string;
  city?: string;
  [key: string]: unknown;
};

function getIp(req: NextRequest): string | undefined {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    return forwarded.split(',')[0]?.trim();
  }
  // @ts-ignore
  return req.ip || undefined;
}

export async function GET(req: NextRequest) {
  const ip = getIp(req) || '';
  let location: Location = {};

  if (ip && ip !== '::1' && ip !== '127.0.0.1') {
    try {
      const res = await fetch(
        `https://ip-api.com/json/${ip}?fields=status,country,regionName,city,message`,
        { next: { revalidate: 60 } },
      );
      const data = await res.json();
      if (data.status === 'success') {
        location = {
          country: data.country,
          region: data.regionName,
          city: data.city,
        };
      }
    } catch {
      // ignore errors, location stays empty
    }
  }

  return Response.json({ ip, location });
}
