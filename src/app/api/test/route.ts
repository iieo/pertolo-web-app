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
  return forwarded?.split(',')[0]?.trim();
}

export async function GET(req: NextRequest) {
  const ip = getIp(req) || '';
  let location: Location = {};

  if (ip && ip !== '::1' && ip !== '127.0.0.1') {
    const res = await fetch(`https://ipinfo.io/${ip}`, {
      headers: {
        Accept: 'application/json',
        Authorization: 'Bearer 2d21f6f0704249',
      },
      next: { revalidate: 60 },
    });
    const data = await res.json();
    if (data) {
      location = {
        country: data.country,
        region: data.region,
        city: data.city,
      };
    }
  }

  return Response.json({ ip, location });
}
