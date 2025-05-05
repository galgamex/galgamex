
export type BlogPost = {
  locale?: string
  title: string
  description?: string
  image?: string
  slug: string
  tags?: string
  date: Date
  visible?: 'draft' | 'invisible' | 'published'
  pin?: boolean
  content: string
  metadata: {
    [key: string]: any
  },
}
