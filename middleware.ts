// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import ignoredDomains from './ignored-domains';

// Initialize Upstash Redis client
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

export async function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  const subdomain = hostname.split('.')[0];

  // Skip processing for local development
  if (hostname === 'localhost' || hostname === '127.0.0.1') {
    return NextResponse.next();
  }

  // Check if the hostname is in the ignored domains list
  if (ignoredDomains.includes(hostname)) {
    return NextResponse.next(); // Ignore processing for specific domains
  }

  // Define the main domain (e.g., oono.store) for production
  const mainDomain = process.env.MAIN_DOMAIN || 'oono.store';

  // Process only if it's a subdomain other than 'www' or the main domain
  if (subdomain && subdomain !== 'www' && subdomain !== mainDomain) {
    const isValidSubdomain = await redis.sismember('valid_subdomains', subdomain);

    if (!isValidSubdomain) {
      // Rewrite to Next.js default 404 page
      return NextResponse.rewrite(new URL('/404', req.url));
    }

    // Redirect to success page if subdomain is valid
    const successUrl = new URL(`/success?subdomain=${subdomain}`, req.url);
    return NextResponse.rewrite(successUrl);
  }

  return NextResponse.next();
}
