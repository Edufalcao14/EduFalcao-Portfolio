import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import path from 'path'
import { fileURLToPath } from 'url'

const dirname = path.dirname(fileURLToPath(import.meta.url))

const nextConfig: NextConfig = {
  output: 'standalone',
  // Silences the cross-origin warning when the dev server is opened on 127.0.0.1
  // instead of localhost.
  allowedDevOrigins: ['127.0.0.1'],
  images: {
    // Declaring localPatterns at all blocks every local path not listed here, so
    // /images/** has to be explicit or the static assets in /public stop loading.
    localPatterns: [{ pathname: '/api/media/file/**' }, { pathname: '/images/**' }],
    // Supabase Storage bucket. `NEXT_PUBLIC_MEDIA_HOST` narrows this to one
    // project when it is set, but it cannot be the only source: this file is
    // evaluated during `next build`, so a host supplied only to the container's
    // runtime env leaves the list empty and every bucket image comes back as a
    // 400 with `"url" parameter is not allowed`. The wildcard is the floor, so
    // a deploy that forgets the build arg still renders its images.
    remotePatterns: [
      ...(process.env.NEXT_PUBLIC_MEDIA_HOST
        ? [{ protocol: 'https' as const, hostname: process.env.NEXT_PUBLIC_MEDIA_HOST }]
        : []),
      { protocol: 'https' as const, hostname: '*.storage.supabase.co' },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  webpack: (webpackConfig) => {
    webpackConfig.resolve.extensionAlias = {
      '.cjs': ['.cts', '.cjs'],
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.mjs': ['.mts', '.mjs'],
    }
    return webpackConfig
  },
  turbopack: {
    root: path.resolve(dirname),
  },
}

export default withPayload(nextConfig, { devBundleServerPackages: false })
