'use client'

import { AppProgressBar } from 'next-nprogress-bar'
import { NextUIProvider } from '@nextui-org/react'
import { ThemeProvider } from 'next-themes'
import { useRouter } from 'next/navigation'
import { SessionProvider } from 'next-auth/react'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter()

  return (
    <SessionProvider>
      <NextUIProvider navigate={router.push}>
        <ThemeProvider attribute="class">{children}</ThemeProvider>
        <AppProgressBar
          height="4px"
          color="#006fee"
          options={{ showSpinner: false }}
        />
      </NextUIProvider>
    </SessionProvider>
  )
}
