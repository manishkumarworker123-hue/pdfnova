import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Do NOT use output: 'export' — Firebase Auth, Firestore, and dynamic
  // routes require server-side rendering. Static export breaks these features.
  // Netlify handles this correctly via @netlify/plugin-nextjs.

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Allow cross-origin images from Firebase Storage
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "firebasestorage.googleapis.com"
      },
      {
        protocol: "https",
        hostname: "lh3.googleusercontent.com"
      }
    ]
  }
};

export default nextConfig;
