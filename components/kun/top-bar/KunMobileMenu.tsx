'use client'

import { NavbarMenu, NavbarMenuItem } from '@nextui-org/navbar'
import Link from 'next/link'
import Image from 'next/image'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { kunMobileNavItem } from '~/constants/top-bar'

export const KunMobileMenu = () => {
  return (
    <NavbarMenu className="space-y-6 bg-background/95 backdrop-blur-md">
      <NavbarMenuItem>
        <Link className="flex items-center p-2 rounded-lg hover:bg-default-100 transition-colors" href="/">
          <Image
            src="/favicon.webp"
            alt={kunMoyuMoe.titleShort}
            width={40}
            height={40}
            priority
            className="rounded-lg"
          />
          <p className="ml-3 text-xl font-semibold">
            {kunMoyuMoe.creator.name}
          </p>
        </Link>
      </NavbarMenuItem>

      {kunMobileNavItem.map((item, index) => (
        <NavbarMenuItem key={index}>
          <Link
            className="w-full px-4 py-2 text-base font-medium rounded-lg hover:bg-default-100 transition-colors"
            href={item.href}
          >
            {item.name}
          </Link>
        </NavbarMenuItem>
      ))}
    </NavbarMenu>
  )
}
