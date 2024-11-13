// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Redis from 'ioredis';
import ignoredDomains from './ignored-domains';

// Initialize Redis connection
const redis = new Redis(process.env.REDIS_URL!);

export async function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  const subdomain = hostname.split('.')[0];

  // Check if the hostname is in the ignored domains list
  if (ignoredDomains.includes(hostname)) {
    // Allow requests to proceed without further processing
    return NextResponse.next();
  }

  // Define the main domain (e.g., oono.store)
  const mainDomain = process.env.MAIN_DOMAIN || 'oono.store';

  // Process only if it's a subdomain other than 'www' or the main domain
  if (subdomain && subdomain !== 'www' && subdomain !== mainDomain) {
    const isValidSubdomain = await redis.sismember('valid_subdomains', subdomain);

    // Redirect invalid subdomains to the 404 page
    if (!isValidSubdomain) {
      return NextResponse.redirect(new URL('/404', req.url));
    }

    // Rewrite valid subdomains to the custom success page
    const successUrl = new URL(`/success?subdomain=${subdomain}`, req.url);
    return NextResponse.rewrite(successUrl);
  }

  // Continue with main app processing for default and valid subdomains
  return NextResponse.next();
}
