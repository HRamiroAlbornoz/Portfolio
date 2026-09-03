import type { NextConfig } from "next";

const isDevelopment = process.env.NODE_ENV === "development";
const isPreviewDeployment = process.env.VERCEL_ENV === "preview";

const TOOLBAR_ORIGIN = "https://vercel.live";
const TOOLBAR_SOCKET_ORIGIN = "wss://ws-us3.pusher.com";
const TOOLBAR_IMAGE_ORIGIN = "https://vercel.com";
const TOOLBAR_FONT_ORIGIN = "https://assets.vercel.com";

function whenPreview(...origins: readonly string[]): string {
  return isPreviewDeployment ? ` ${origins.join(" ")}` : "";
}

const contentSecurityPolicy = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDevelopment ? " 'unsafe-eval'" : ""}${whenPreview(TOOLBAR_ORIGIN)}`,
  `style-src 'self' 'unsafe-inline'${whenPreview(TOOLBAR_ORIGIN)}`,
  `img-src 'self' blob: data:${whenPreview(TOOLBAR_ORIGIN, TOOLBAR_IMAGE_ORIGIN)}`,
  `font-src 'self'${whenPreview(TOOLBAR_ORIGIN, TOOLBAR_FONT_ORIGIN)}`,
  `connect-src 'self'${whenPreview(TOOLBAR_ORIGIN, TOOLBAR_SOCKET_ORIGIN)}`,
  isPreviewDeployment ? `frame-src ${TOOLBAR_ORIGIN}` : "frame-src 'none'",
  "object-src 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "frame-ancestors 'none'",
  "upgrade-insecure-requests",
].join("; ");

const permissionsPolicy = [
  "camera=()",
  "microphone=()",
  "geolocation=()",
  "browsing-topics=()",
].join(", ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Permissions-Policy", value: permissionsPolicy },
];

const nextConfig: NextConfig = {
  experimental: {
    globalNotFound: true,
  },
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
