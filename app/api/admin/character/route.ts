import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import {
    kunParseGetQuery,
    kunParsePutBody
} from '~/app/api/utils/parseQuery'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { adminPaginationSchema } from '~/validations/admin'
import { getCharacters } from './get'
import { reviewCharacter } from './review'

// 获取角色列表
export const GET = async (req: NextRequest) => {
    const input = kunParseGetQuery(req, adminPaginationSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return NextResponse.json('用户未登录')
    }
    if (payload.role < 3) {
        return NextResponse.json('杂鱼~本页面仅管理员可访问')
    }

    const response = await getCharacters(input)
    return NextResponse.json(response)
}

// 审核角色
const reviewSchema = z.object({
    characterId: z.coerce.number().min(1),
    approve: z.boolean(),
    adminUid: z.coerce.number().min(1)
})

export const PUT = async (req: NextRequest) => {
    const input = await kunParsePutBody(req, reviewSchema)
    if (typeof input === 'string') {
        return NextResponse.json(input)
    }

    const payload = await verifyHeaderCookie(req)
    if (!payload) {
        return NextResponse.json('用户未登录')
    }
    if (payload.role < 3) {
        return NextResponse.json('杂鱼~本页面仅管理员可访问')
    }

    const { characterId, approve, adminUid } = input
    const response = await reviewCharacter(characterId, approve, adminUid)
    return NextResponse.json(response)
}