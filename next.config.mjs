import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: '**',
      }
    ],
    unoptimized: true
  },
  compiler: {
    removeConsole:
      process.env.NODE_ENV === "production"
        ? {
          exclude: ["error"],
        }
        : false,
  },
};

export default withNextIntl(nextConfig);
