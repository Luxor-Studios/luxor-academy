import type { NextConfig } from "next";

/**
 * LUXOR Academy shell — static export.
 * Honors ARCHITECTURE-v2.md invariant: no runtime SSR.
 * Produces plain HTML + JS assets deployable to any CDN.
 */
const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  // turbopack.root omitted: the multi-lockfile warning is benign for this repo
  // layout (root lockfile for the outer validator/tests, web/ lockfile for the shell).
};

export default nextConfig;
