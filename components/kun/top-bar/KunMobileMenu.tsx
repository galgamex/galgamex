'use client'

import { memo } from 'react'
import { NavbarMenu, NavbarMenuItem } from '@nextui-org/navbar'
import Link from 'next/link'
import Image from 'next/image'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { kunMobileNavItem } from '~/constants/top-bar'
import { Home, Tag, Download, HelpCircle, MessageSquare, Trophy, Award, Mail } from 'lucide-react'
import { ReactNode } from 'react'

// 为菜单项添加图标映射
const iconMap: Record<string, ReactNode> = {
  '/galgame': <Download className="w-5 h-5 mr-2" />,
  '/tag': <Tag className="w-5 h-5 mr-2" />,
  '/resource': <Download className="w-5 h-5 mr-2" />,
  '/doc': <HelpCircle className="w-5 h-5 mr-2" />,
  '/comment': <MessageSquare className="w-5 h-5 mr-2" />,
  '/leaderboard': <Trophy className="w-5 h-5 mr-2" />,
  '/tasks': <Award className="w-5 h-5 mr-2" />,
  '/doc/notice/feedback': <Mail className="w-5 h-5 mr-2" />,
  '/': <Home className="w-5 h-5 mr-2" />
}

// 用memo包装菜单项组件以减少不必要的重渲染
const MenuItem = memo(({ href, name }: { href: string; name: string }) => (
  <NavbarMenuItem className="p-0">
    <Link
      className="w-full flex items-center p-3 rounded-lg hover:bg-default-100 transition-colors duration-200 font-medium text-base"
      href={href}
      prefetch={false}
    >
      {iconMap[href] || <Home className="w-5 h-5 mr-2" />} {name}
    </Link>
  </NavbarMenuItem>
))

MenuItem.displayName = 'MenuItem'

export const KunMobileMenu = memo(() => {
  return (
    <NavbarMenu className="pt-6 pb-8 px-4 overscroll-contain">
      <NavbarMenuItem className="mb-6">
        <Link className="flex items-center" href="/">
          <Image
            src="/favicon.webp"
            alt={kunMoyuMoe.titleShort}
            width={50}
            height={50}
            priority={false}
          />
          <p className="ml-4 mr-2 text-3xl font-bold">
            {kunMoyuMoe.creator.name}
          </p>
        </Link>
      </NavbarMenuItem>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {kunMobileNavItem.map((item) => (
          <MenuItem key={item.href} href={item.href} name={item.name} />
        ))}
      </div>
    </NavbarMenu>
  )
})

KunMobileMenu.displayName = 'KunMobileMenu'
