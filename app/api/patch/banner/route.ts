import { NextRequest, NextResponse } from 'next/server'
import { kunParseFormData } from '~/app/api/utils/parseQuery'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { updatePatchBannerSchema } from '~/validations/patch'
import { uploadPatchBanner } from '~/app/api/edit/_upload'

export const updatePatchBanner = async (
  image: ArrayBuffer,
  patchId: number
) => {
  const patch = await prisma.patch.findUnique({
    where: { id: patchId }
  })
  if (!patch) {
    return '这个 Galgame 不存在'
  }

  const res = await uploadPatchBanner(image, patchId)
  if (typeof res === 'string') {
    return res
  }

  return {}
}

export const POST = async (req: NextRequest) => {
  const input = await kunParseFormData(req, updatePatchBannerSchema)
  if (typeof input === 'string') {
    return NextResponse.json(input)
  }
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户未登录')
  }
  if (payload.role < 3) {
    return NextResponse.json('本页面仅管理员可访问')
  }

  const image = await new Response(input.image)?.arrayBuffer()

  const response = await updatePatchBanner(image, input.patchId)
  return NextResponse.json(response)
}
