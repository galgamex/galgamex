import { createUrl } from '~/utils/createUrl'

export interface KunNavItem {
  name: string
  href: string
}

export const kunNavItem: KunNavItem[] = [
  {
    name: '游戏下载',
    href: createUrl('/galgame')
  },
  {
    name: '游戏标签',
    href: createUrl('/tag')
  },
  {
    name: '补丁和存档',
    href: createUrl('/resource')
  },
  {
    name: '帮助文档',
    href: createUrl('/doc')
  },
  {
    name: '评论列表',
    href: createUrl('/comment')
  },
  {
    name: '排行榜',
    href: createUrl('/leaderboard')
  }
]

export const kunMobileNavItem: KunNavItem[] = [
  ...kunNavItem,
  {
    name: '任务中心',
    href: createUrl('/tasks')
  },
  {
    name: '联系我们',
    href: createUrl('/doc/notice/feedback')
  }
]
