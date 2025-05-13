'use client'

import toast from 'react-hot-toast'
import { memo, useCallback, useEffect, useState } from 'react'
import { NavbarContent, NavbarItem } from '@nextui-org/navbar'
import Link from 'next/link'
import { Button } from '@nextui-org/button'
import { Skeleton } from '@nextui-org/skeleton'
import { useUserStore } from '~/store/userStore'
import { useRouter } from 'next-nprogress-bar'
import { kunFetchGet } from '~/utils/kunFetch'
import { ThemeSwitcher } from './ThemeSwitcher'
import { useMounted } from '~/hooks/useMounted'
import { UserDropdown } from './UserDropdown'
import { KunSearch } from './Search'
import { UserMessageBell } from './UserMessageBell'
import { Tooltip } from '@nextui-org/tooltip'
import { RandomGalgameButton } from '~/components/home/carousel/RandomGalgameButton'
import type { UserState } from '~/store/userStore'
import type { Message } from '~/types/api/message'

// 使用memo优化登录/注册按钮
const LoginButtons = memo(() => (
  <NavbarContent justify="end">
    <NavbarItem className="hidden lg:flex">
      <Link href="/login">登录</Link>
    </NavbarItem>
    <NavbarItem>
      <Button
        as={Link}
        color="primary"
        href="/register"
        variant="flat"
        className="hidden lg:flex"
      >
        注册
      </Button>
    </NavbarItem>
    <NavbarItem className="flex lg:hidden">
      <Button as={Link} color="primary" href="/login" variant="flat">
        登录
      </Button>
    </NavbarItem>
  </NavbarContent>
))

LoginButtons.displayName = 'LoginButtons'

export const KunTopBarUser = memo(() => {
  const router = useRouter()
  const { user, setUser } = useUserStore((state) => state)
  const [hasUnread, setHasUnread] = useState(false)
  const isMounted = useMounted()

  // 使用useCallback优化状态更新函数
  const markAsRead = useCallback(() => {
    setHasUnread(false)
  }, [])

  useEffect(() => {
    if (!isMounted || !user.uid) {
      return
    }

    let isCancelled = false;

    const getUserStatus = async () => {
      try {
        const res = await kunFetchGet<KunResponse<UserState>>('/user/status')
        if (isCancelled) return;

        if (typeof res === 'string') {
          toast.error(res)
          router.push('/login')
        } else {
          setUser(user)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to get user status:', error)
        }
      }
    }

    const getUserUnreadMessage = async () => {
      try {
        const message = await kunFetchGet<Message | null>('/message/unread')
        if (!isCancelled && message) {
          setHasUnread(true)
        }
      } catch (error) {
        if (!isCancelled) {
          console.error('Failed to get unread messages:', error)
        }
      }
    }

    getUserStatus()
    getUserUnreadMessage()

    return () => {
      isCancelled = true;
    }
  }, [isMounted, user.uid])

  if (!isMounted) {
    return (
      <NavbarContent as="div" className="items-center" justify="end">
        <Skeleton className="rounded-lg">
          <div className="w-32 h-10 rounded-lg bg-default-300" />
        </Skeleton>
      </NavbarContent>
    )
  }

  return (
    <NavbarContent as="div" className="items-center" justify="end">
      {!user.name && <LoginButtons />}

      <KunSearch />

      <Tooltip content="随机一部游戏">
        <RandomGalgameButton isIconOnly variant="light" />
      </Tooltip>

      <ThemeSwitcher />

      {user.name && (
        <>
          <UserMessageBell
            hasUnreadMessages={hasUnread}
            setReadMessage={markAsRead}
          />

          <UserDropdown />
        </>
      )}
    </NavbarContent>
  )
})

KunTopBarUser.displayName = 'KunTopBarUser'
