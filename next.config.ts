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
    // Supabase Storage bucket. Host comes from the env so staging and prod
    // can point at different projects without a code change.
    remotePatterns: process.env.NEXT_PUBLIC_MEDIA_HOST
      ? [{ protocol: 'https', hostname: process.env.NEXT_PUBLIC_MEDIA_HOST }]
      : [],
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
