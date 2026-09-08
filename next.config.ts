import type { NextConfig } from "next";
import bundleAnalyzer from "@next/bundle-analyzer";
import createNextIntlPlugin from "next-intl/plugin";
import { legacyBlogRedirects } from "./src/lib/site";

const withNextIntl = createNextIntlPlugin({
  requestConfig: "./src/i18n/request.ts",
  experimental: {
    messages: { path: "./messages", format: "json", locales: "infer", precompile: true },
  },
});

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === "true",
});

const legacyMarketingRedirects = [
  { source: "/open-spoke", destination: "/borrow" },
  { source: "/stable-spoke", destination: "/lend" },
  // /credit-lines no longer exists; send the legacy webapp URL home.
  { source: "/webapp", destination: "/" },
  { source: "/credit-lines", destination: "/" },
];

/**
 * Security headers configuration for the application.
 * These headers protect against common web vulnerabilities including:
 * - XSS (Cross-Site Scripting)
 * - Clickjacking
 * - MIME sniffing
 * - Information disclosure
 * 
 * @see https://owasp.org/www-project-secure-headers/
 */
const scriptSrc = ["'self'", "'unsafe-inline'"]

if (process.env.NODE_ENV !== "production") {
  scriptSrc.push("'unsafe-eval'")
}

const securityHeaders = [
  {
    // Enables DNS prefetching for faster external resource loading
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    // Enforces HTTPS for 1 year, including subdomains
    key: 'Strict-Transport-Security',
    value: 'max-age=31536000; includeSubDomains'
  },
  {
    // Prevents clickjacking by disallowing iframe embedding
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    // Prevents MIME type sniffing
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    // Enables browser XSS filtering
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    // Controls referrer information sent with requests
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    // Restricts browser features and APIs
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  },
  {
    key: 'Cross-Origin-Opener-Policy',
    value: 'same-origin'
  },
  {
    key: 'Cross-Origin-Resource-Policy',
    value: 'same-origin'
  },
  {
    key: 'Origin-Agent-Cluster',
    value: '?1'
  },
  {
    key: 'X-Permitted-Cross-Domain-Policies',
    value: 'none'
  },
  {
    // Content Security Policy - controls resource loading
    key: 'Content-Security-Policy',
    value: [
      "default-src 'self'",
      `script-src ${scriptSrc.join(" ")}`,
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: https: blob:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https:",
      "media-src 'self' https://cdn-front.freepik.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'none'",
    ].join('; ')
  }
];

const nextConfig: NextConfig = {
  /**
   * When root layout is a pass-through (html lives under `[locale]`), global 404s
   * need their own document via `app/global-not-found.tsx`.
   * @see https://nextjs.org/docs/app/api-reference/file-conventions/not-found
   */
  experimental: {
    globalNotFound: true,
  },
  /**
   * Image optimization configuration
   * Defines allowed external image domains for Next.js Image component
   */
  images: {
    formats: ["image/avif", "image/webp"],
    qualities: [58, 62, 75, 85],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "studio.uxpincdn.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "www.muravie.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "cdn-front.freepik.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "coin-logos.simplr.sh",
        pathname: "/images/**",
      },
    ],
  },
  async headers() {
    return [
      {
        // Apply security headers to all routes
        source: '/(.*)',
        headers: securityHeaders,
      },
    ];
  },

  async redirects() {
    return [...legacyBlogRedirects, ...legacyMarketingRedirects].map((redirect) => ({
      ...redirect,
      permanent: true,
    }))
  },
};

export default withNextIntl(withBundleAnalyzer(nextConfig));
