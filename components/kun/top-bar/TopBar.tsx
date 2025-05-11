'use client'

import { useEffect, useState } from 'react'
import {
  Navbar,
  NavbarContent,
  NavbarItem,
  NavbarMenuToggle
} from '@nextui-org/navbar'
import Link from 'next/link'
import { KunTopBarBrand } from './Brand'
import { KunTopBarUser } from './User'
import { usePathname } from 'next/navigation'
import { kunNavItem } from '~/constants/top-bar'
import { KunMobileMenu } from './KunMobileMenu'

export const KunTopBar = () => {
  const pathname = usePathname()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  useEffect(() => {
    setIsMenuOpen(false)
  }, [pathname])

  return (
    <Navbar
      maxWidth="full"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: 'px-3 sm:px-6 max-w-[1500px] mx-auto',
        base: 'bg-background/80 backdrop-blur-md border-b border-divider',
        content: 'gap-6',
        menu: 'bg-background/80 backdrop-blur-md'
      }}
    >
      <NavbarContent className="lg:hidden" justify="start">
        <NavbarMenuToggle className="text-foreground/80 hover:text-foreground" />
      </NavbarContent>

      <KunTopBarBrand />

      <NavbarContent className="hidden gap-6 lg:flex">
        {kunNavItem.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              className={`text-sm font-medium transition-colors duration-200 ${pathname === item.href
                ? 'text-primary'
                : 'text-foreground/80 hover:text-foreground'
                }`}
              href={item.href}
            >
              {item.name}
            </Link>
          </NavbarItem>
        ))}
      </NavbarContent>

      <KunTopBarUser />

      <KunMobileMenu />
    </Navbar>
  )
}
