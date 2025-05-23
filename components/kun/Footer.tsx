'use client'

import { kunMoyuMoe } from '~/config/moyu-moe'
import Link from 'next/link'
import Image from 'next/image'
import { createUrl } from '~/utils/createUrl'
import { Github } from 'lucide-react'
import { useEffect, useState } from 'react'

export const KunFooter = () => {
  // 使用状态来控制是否已经挂载到客户端
  const [isMounted, setIsMounted] = useState(false)

  // 在客户端挂载后设置状态
  useEffect(() => {
    setIsMounted(true)
  }, [])

  return (
    <footer className="w-full mt-8 text-sm border-t border-divider">
      <div className="px-2 mx-auto sm:px-6 max-w-[1500px]">
        <div className="flex flex-wrap justify-center gap-4 py-6 md:justify-between">
          <Link href={createUrl('/')} className="flex items-center space-x-2">
            <Image
              src="/favicon.webp"
              alt={kunMoyuMoe.titleShort}
              width={30}
              height={30}
            />
            <span>© 2025 {kunMoyuMoe.titleShort}</span>
          </Link>

          {/* 服务端始终渲染，但在客户端通过CSS控制显示 */}
          <div className={isMounted ? "hidden md:flex space-x-8" : "flex space-x-8"}>
            <Link href={createUrl('/doc')} className="flex items-center">
              使用指南
            </Link>
            <Link
              href={kunMoyuMoe.domain.nav}
              target="_blank"
              className="flex items-center"
            >
              导航页面
            </Link>

            <Link href={createUrl('/friend-link')} className="flex items-center">
              友情链接
            </Link>

            <Link
              href="https://github.com/galgamex/galgamex"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              <Github className="size-4" />
              <span>Github</span>
            </Link>
          </div>

          <div className={isMounted ? "hidden md:flex space-x-8" : "flex space-x-8"}>
            <span className="flex items-center">联系我们</span>
            <Link
              href={kunMoyuMoe.domain.telegram_group}
              className="flex items-center"
              target="_blank"
              rel="noopener noreferrer"
            >
              Telegram
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
