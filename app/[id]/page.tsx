import { PatchHeaderContainer } from '~/components/patch/header/Container'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import { generateKunMetadataTemplate } from './metadata'
import { kunGetPatchActions, kunGetPatchIntroductionActions } from './actions'
import type { Metadata } from 'next'

export const revalidate = 3

interface Props {
  params: Promise<{ id: string }>
}

export const generateMetadata = async ({
  params
}: Props): Promise<Metadata> => {
  const { id } = await params
  const patch = await kunGetPatchActions({
    uniqueId: id
  })
  const intro = await kunGetPatchIntroductionActions({ uniqueId: id })
  if (typeof patch === 'string' || typeof intro === 'string') {
    return {}
  }

  return generateKunMetadataTemplate(patch, intro)
}

export default async function Kun({ params }: Props) {
  const { id } = await params
  if (!id) {
    return <ErrorComponent error={'提取页面参数错误'} />
  }

  const patch = await kunGetPatchActions({
    uniqueId: id
  })
  if (typeof patch === 'string') {
    return <ErrorComponent error={patch} />
  }

  const intro = await kunGetPatchIntroductionActions({ uniqueId: id })
  if (typeof intro === 'string') {
    return <ErrorComponent error={intro} />
  }

  return (
    <div className="container  mx-auto ">
      <PatchHeaderContainer patch={patch} intro={intro} />
    </div>
  )
}
