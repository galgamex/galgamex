export interface KunNavItem {
  name: string
  href: string
}

export const kunNavItem: KunNavItem[] = [
  {
    name: '游戏下载',
    href: '/galgame'
  },
  {
    name: '游戏标签',
    href: '/tag'
  },
  {
    name: '补丁和存档',
    href: '/resource'
  },
  {
    name: '帮助文档',
    href: '/doc'
  },
  {
    name: '评论列表',
    href: '/comment'
  }

]

export const kunMobileNavItem: KunNavItem[] = [
  ...kunNavItem,
  {
    name: '联系我们',
    href: '/doc/notice/feedback'
  }
]
