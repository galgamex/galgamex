import { kunMoyuMoe } from '~/config/moyu-moe'
import type { Metadata } from 'next'

export const kunMetadata: Metadata = {
  title: '退订邮件通知',
  description: `您可以在此处退订网站的邮件通知`,
  openGraph: {
    title: '退订邮件通知',
    description: `您可以在此处退订网站的邮件通知`,
    type: 'website',
    images: kunMoyuMoe.images
  },
  twitter: {
    card: 'summary_large_image',
    title: '退订邮件通知',
    description: `您可以在此处退订网站的邮件通知`
  },
  alternates: {
    canonical: `${kunMoyuMoe.domain.main}/auth/email-notice`
  }
}
