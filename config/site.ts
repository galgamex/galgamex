import { SiteConfig } from "@/types/siteConfig";

export const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://nextforge.dev";

export const SOURCE_CODE_URL = "https://github.com/weijunext/nextjs-15-starter";

const TWITTER_URL = 'https://x.com/weijunext'
const BSKY_URL = 'https://bsky.app/profile/judewei.bsky.social'
const EMAIL_URL = 'mailto:weijunext@gmail.com'
const GITHUB_URL = 'https://github.com/weijunext'

export const siteConfig: SiteConfig = {
  name: "Next Forge",
  tagLine: 'Multilingual Next.js 15 Starter',
  description:
    "A multilingual Next.js 15 starter with built-in i18n support. Launch your global-ready web application with a clean, efficient, and SEO-friendly foundation.",
  url: BASE_URL,
  authors: [
    {
      name: "weijunext",
      url: "https://weijunext.com",
    }
  ],
  creator: '@weijunext',
  socialLinks: {
    bluesky: BSKY_URL,
    twitter: TWITTER_URL,
    email: EMAIL_URL,
    github: GITHUB_URL,
  },
  themeColors: [
    { media: '(prefers-color-scheme: light)', color: 'white' },
    { media: '(prefers-color-scheme: dark)', color: 'black' },
  ],
  defaultNextTheme: 'system', // next-theme option: system | dark | light
  icons: {
    icon: "/favicon.ico",
    shortcut: "/logo.png",
    apple: "/logo.png", // apple-touch-icon.png
  },
}
