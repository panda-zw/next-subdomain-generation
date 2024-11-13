// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import ignoredDomains from './ignored-domains';

// Initialize Upstash Redis with environment variables
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL!,
  token: process.env.UPSTASH_REDIS_TOKEN!,
});

export async function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  const subdomain = hostname.split('.')[0];

  // Skip ignored domains
  if (ignoredDomains.includes(hostname)) {
    return NextResponse.next();
  }

  // Check if subdomain exists in Redis
  const isValidSubdomain = await redis.sismember('valid_subdomains', subdomain);

  if (!isValidSubdomain && subdomain !== 'www') {
    return NextResponse.redirect(new URL('/404', req.url));
  }

  const successUrl = new URL(`/success?subdomain=${subdomain}`, req.url);
  return NextResponse.rewrite(successUrl);
}
