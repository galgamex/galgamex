'use client'

import { Chip } from '@nextui-org/chip'
import Link from 'next/link'
import { KunPatchAttribute } from '~/components/kun/PatchAttribute'
import type { Patch } from '~/types/api/patch'

interface PatchHeaderProps {
  patch: Patch
}

export const Tags = ({ patch }: PatchHeaderProps) => {
  return (
    <>
      <div className="space-y-2">
        <KunPatchAttribute
          types={patch.type}
          languages={patch.language}
          platforms={patch.platform}
          size="sm"
        />
      </div>

      <div className="flex flex-wrap gap-1 mt-2">
        {patch.tags.map((tag) => (
          <Chip
            as={Link}
            href={`/tag/${tag}`}
            key={tag}
            className="transition-colors hover:bg-default-100"
            color="default"
            variant="flat"
            size="sm"
          >
            {tag}
          </Chip>
        ))}
      </div>
    </>
  )
}
