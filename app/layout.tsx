import { Providers } from './providers'
import dynamic from 'next/dynamic'
import { generateKunMetadata, kunViewport } from './metadata'
import type { Metadata, Viewport } from 'next'
import '~/styles/index.scss'
import './actions'
import { ToasterWrapper } from '~/components/toaster/ToasterWrapper'
import Script from 'next/script'

// 动态导入组件以解决生产环境中的类型错误
const KunTopBar = dynamic(() => import('~/components/kun/top-bar/TopBar').then(mod => mod.KunTopBar), {
  ssr: true
})
const KunNavigationBreadcrumb = dynamic(() => import('~/components/kun/NavigationBreadcrumb').then(mod => mod.KunNavigationBreadcrumb), {
  ssr: true
})
const KunBackToTop = dynamic(() => import('~/components/kun/BackToTop').then(mod => mod.KunBackToTop), {
  ssr: true
})
const KunFooter = dynamic(() => import('~/components/kun/Footer').then(mod => mod.KunFooter), {
  ssr: true
})

export const viewport: Viewport = kunViewport

// 定义HTML语言和抑制水合警告
export const metadata: Metadata = {
  ...generateKunMetadata(),
  ...{
    htmlAttributes: {
      lang: 'zh-Hans',
      suppressHydrationWarning: true
    },
    other: {
      'mobile-web-app-capable': 'yes'
    }
  }
}

export default function RootLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="zh-Hans" suppressHydrationWarning>
      <head>
        <Script src="/cloudflare-rum-blocker.js" strategy="beforeInteractive" />
        {process.env.NODE_ENV !== 'production' && (
          <Script src="/network-monitor.js" strategy="beforeInteractive" />
        )}
      </head>
      <body>
        {process.env.KUN_VISUAL_NOVEL_TEST_SITE_LABEL && (
          <head>
            <meta name="robots" content="noindex,nofollow" />
            <meta name="googlebot" content="noindex,nofollow" />
          </head>
        )}

        <Providers>
          <div className="relative flex flex-col items-center justify-center min-h-screen bg-radial">
            <KunTopBar />
            <KunNavigationBreadcrumb />
            <div className="flex min-h-[calc(100dvh-256px)] w-full max-w-[1500px] grow px-1.5 sm:px-6">
              {children}
              <ToasterWrapper />
            </div>
            <KunBackToTop />
            <KunFooter />
          </div>
        </Providers>
      </body>
    </html>
  )
}
