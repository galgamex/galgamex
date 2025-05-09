'use client'

import { Chip } from '@nextui-org/chip'
import {
  SUPPORTED_LANGUAGE_MAP,
  SUPPORTED_PLATFORM_MAP,
  SUPPORTED_TYPE_MAP
} from '~/constants/resource'
import { cn } from '~/utils/cn'

interface Props {
  types: string[]
  languages?: string[]
  platforms?: string[]
  size?: 'lg' | 'md' | 'sm'
  className?: string
}

export const KunPatchAttribute = ({
  types,
  languages = [],
  platforms = [],
  size = 'md',
  className
}: Props) => {
  return (
    <div className={cn("flex flex-wrap gap-1", className)}>
      {types.map((type) => (
        <Chip key={type} variant="flat" color="primary" size={size} classNames={{
          base: "bg-primary/10 border-none"
        }}>
          {SUPPORTED_TYPE_MAP[type]}
        </Chip>
      ))}
      {languages?.map((lang) => (
        <Chip key={lang} variant="flat" color="secondary" size={size} classNames={{
          base: "bg-secondary/10 border-none"
        }}>
          {SUPPORTED_LANGUAGE_MAP[lang]}
        </Chip>
      ))}
      {platforms?.map((platform) => (
        <Chip key={platform} variant="flat" color="success" size={size} classNames={{
          base: "bg-success/10 border-none"
        }}>
          {SUPPORTED_PLATFORM_MAP[platform]}
        </Chip>
      ))}
    </div>
  )
}
