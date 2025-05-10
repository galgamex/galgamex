import { FileText, MessageSquare, Tags } from 'lucide-react'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { createUrl } from '~/utils/createUrl'

export interface HomeNavItem {
  icon: any
  label: string
  href: string
  color: 'primary' | 'secondary' | 'success' | 'warning' | 'danger'
  isExternal: boolean
}

export const homeNavigationItems: HomeNavItem[] = [
  {
    icon: Tags,
    label: '标签',
    href: createUrl('/tag'),
    color: 'primary',
    isExternal: false
  },
  {
    icon: MessageSquare,
    label: '论坛',
    href: kunMoyuMoe.domain.forum,
    color: 'secondary',
    isExternal: true
  },
  {
    icon: FileText,
    label: '文档',
    href: createUrl('/doc'),
    color: 'success',
    isExternal: false
  }
]
