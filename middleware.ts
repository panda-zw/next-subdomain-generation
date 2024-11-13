// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import Redis from 'ioredis';

// Initialize Redis with your connection URL
const redis = new Redis(process.env.REDIS_URL!);

export async function middleware(req: NextRequest) {
  const hostname = req.nextUrl.hostname;
  const subdomain = hostname.split('.')[0];

  // Define your main domain (e.g., oono.store)
  const mainDomain = process.env.NEXT_PUBLIC_DOMAIN || 'oono.store';

  // If subdomain is not the main domain
  if (subdomain && subdomain !== 'www' && subdomain !== mainDomain) {
    // Check if the subdomain is valid
    const isValidSubdomain = await redis.sismember('valid_subdomains', subdomain);

    if (isValidSubdomain) {
      // Redirect to the custom success page with the subdomain as a query parameter
      const successUrl = new URL(`/success?subdomain=${subdomain}`, req.url);
      return NextResponse.rewrite(successUrl);
    } else {
      // Redirect invalid subdomains to a 404 page
      return NextResponse.redirect(new URL('/404', req.url));
    }
  }

  // Allow the main domain and any other valid routes
  return NextResponse.next();
}
