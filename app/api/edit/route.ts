import { NextRequest, NextResponse } from 'next/server'
import { kunParseFormData, kunParsePutBody } from '~/app/api/utils/parseQuery'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { patchCreateSchema, patchUpdateSchema } from '~/validations/edit'
import { createGalgame } from './create'
import { updateGalgame } from './update'

const checkStringArrayValid = (type: 'alias' | 'tag', aliasString: string) => {
  const label = type === 'alias' ? '别名' : '标签'

  const aliasArray = JSON.parse(aliasString) as string[]
  if (aliasArray.length > 100) {
    return `您最多使用 100 个${label}`
  }
  const maxLength = aliasArray.some((alias) => alias.length > 500)
  if (maxLength) {
    return `单个${label}的长度不可超过 500 个字符`
  }
  const minLength = aliasArray.some((alias) => alias.trim.length)
  if (minLength) {
    return `单个${label}至少一个字符`
  }
  return aliasArray.map((a) => a.trim())
}

export const POST = async (req: NextRequest) => {
  const input = await kunParseFormData(req, patchCreateSchema)
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

  const { alias, banner, tag, ...rest } = input
  const aliasResult = checkStringArrayValid('alias', alias)
  if (typeof aliasResult === 'string') {
    return NextResponse.json(aliasResult)
  }
  const tagResult = checkStringArrayValid('tag', tag)
  if (typeof tagResult === 'string') {
    return NextResponse.json(tagResult)
  }
  const bannerArrayBuffer = await new Response(banner)?.arrayBuffer()

  const response = await createGalgame(
    { alias: aliasResult, tag: tagResult, banner: bannerArrayBuffer, ...rest },
    payload.uid
  )
  return NextResponse.json(response)
}

export const PUT = async (req: NextRequest) => {
  const input = await kunParsePutBody(req, patchUpdateSchema)
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

  const response = await updateGalgame(input, payload.uid)
  return NextResponse.json(response)
}
