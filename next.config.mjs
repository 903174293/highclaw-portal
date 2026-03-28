import bundleAnalyzer from '@next/bundle-analyzer';
import { createMDX } from 'fumadocs-mdx/next';
import createNextIntlPlugin from 'next-intl/plugin';

const withMDX = createMDX();

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
});

const withNextIntl = createNextIntlPlugin({
  requestConfig: './src/core/i18n/request.ts',
});

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.VERCEL ? undefined : 'standalone',
  reactStrictMode: false,
  pageExtensions: ['ts', 'tsx', 'js', 'jsx', 'md', 'mdx'],
  // standalone 文件追踪偶发漏包：@libsql→ws、styled-jsx、Next 运行时 @swc/helpers 子路径等，显式纳入
  outputFileTracingIncludes: {
    '/**': [
      './node_modules/ws/**/*',
      './node_modules/@libsql/**/*',
      './node_modules/styled-jsx/**/*',
      './node_modules/@swc/helpers/**/*',
      './node_modules/acorn-jsx/**/*',
      './node_modules/detect-libc/**/*',
    ],
  },
  images: {
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    qualities: [60, 70, 75],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*',
      },
    ],
  },
  async redirects() {
    return [
      // 旧「单页配置」入口已拆为 /docs/config/*，保留书签与外链
      {
        source: '/docs/configuration',
        destination: '/docs/config',
        permanent: true,
      },
      {
        source: '/en/docs/configuration',
        destination: '/en/docs/config',
        permanent: true,
      },
      {
        source: '/zh/docs/configuration',
        destination: '/zh/docs/config',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/imgs/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
    ];
  },
  turbopack: {
    resolveAlias: {
      // fs: {
      //   browser: './empty.ts', // We recommend to fix code imports before using this method
      // },
    },
  },
  experimental: {
    // turbopackFileSystemCacheForDev: true, // disabled: causes memory overflow with large dynamic import context
    // mdxRs: disabled for stability with fumadocs-mdx
  },
  // reactCompiler: true, // disabled: causes OOM when compiling 37+ dynamically-imported block files
};

export default withBundleAnalyzer(withNextIntl(withMDX(nextConfig)));
