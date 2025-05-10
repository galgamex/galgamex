import { MessageNav } from '~/components/message/MessageNav'
import { KunHeader } from '~/components/kun/Header'
import { kunMetadata } from './metadata'
import { Suspense } from 'react'
import type { Metadata } from 'next'

export const metadata: Metadata = kunMetadata

export default function MessageLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <Suspense>
      <div className="container mx-auto my-4">

        <div className="flex flex-col gap-6 lg:flex-row">
          <MessageNav />
          <div className="w-full lg:w-3/4">{children}</div>
        </div>
      </div>
    </Suspense>
  )
}
