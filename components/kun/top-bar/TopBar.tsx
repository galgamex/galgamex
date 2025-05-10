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
      maxWidth="xl"
      isMenuOpen={isMenuOpen}
      onMenuOpenChange={setIsMenuOpen}
      classNames={{
        wrapper: 'px-3 sm:px-6',
        base: 'bg-background/80 backdrop-blur-md border-b border-divider',
      }}
    >
      <NavbarContent className="sm:hidden" justify="start">
        <li className="h-full">
          <NavbarMenuToggle className="text-foreground/80 hover:text-foreground transition-colors" />
        </li>
      </NavbarContent>

      <KunTopBarBrand />

      <NavbarContent className="hidden gap-6 sm:flex">
        {kunNavItem.map((item) => (
          <NavbarItem key={item.href} isActive={pathname === item.href}>
            <Link
              className={`relative px-1 py-2 text-sm font-medium transition-colors hover:text-primary ${pathname === item.href
                ? 'text-primary after:absolute after:bottom-0 after:left-0 after:h-0.5 after:w-full after:bg-primary after:transition-all'
                : 'text-foreground/80'
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
