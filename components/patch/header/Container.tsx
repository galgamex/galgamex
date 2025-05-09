'use client'

import { useEffect, useState } from 'react'
import { useRewritePatchStore } from '~/store/rewriteStore'
import { PatchHeaderTabs } from './Tabs'
import { PatchHeaderInfo } from './Info'
import { KunAutoImageViewer } from '~/components/kun/image-viewer/AutoImageViewer'
import type { Patch, PatchIntroduction } from '~/types/api/patch'

interface PatchHeaderProps {
  patch: Patch
  intro: PatchIntroduction
}

export const PatchHeaderContainer = ({ patch, intro }: PatchHeaderProps) => {
  const { setData } = useRewritePatchStore()
  const [selected, setSelected] = useState('introduction')

  useEffect(() => {
    setData({
      id: patch.id,
      uniqueId: patch.uniqueId,
      vndbId: patch.vndbId ?? '',
      name: patch.name,
      introduction: patch.introduction,
      alias: patch.alias,
      tag: patch.tags,
      contentLimit: patch.contentLimit,
      released: intro.released
    })
  }, [])

  return (
    <div className="w-full mx-auto ">
      <KunAutoImageViewer />

      <div className="mb-8">
        <PatchHeaderInfo
          patch={patch}
          intro={intro}
          handleClickDownloadNav={() => setSelected('resources')}
        />
      </div>

      <PatchHeaderTabs
        id={patch.id}
        intro={intro}
        selected={selected}
        setSelected={setSelected}
      />
    </div>
  )
}
