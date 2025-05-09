'use client'

import { NavbarContent, NavbarItem } from '@nextui-org/navbar'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { kunNavItem } from '~/constants/top-bar'

export const NavItem = () => {
  const pathname = usePathname()

  return (
    <NavbarContent className="hidden gap-3 sm:flex">
      {kunNavItem.map((item) => (
        <NavbarItem key={item.href} isActive={pathname === item.href}>
          <Link
            className={
              pathname === item.href ? 'text-primary' : 'text-foreground'
            }
            href={item.href}
          >
            {item.name}
          </Link>
        </NavbarItem>
      ))}
    </NavbarContent>
  )
}
