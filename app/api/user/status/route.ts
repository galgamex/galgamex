import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '~/prisma/index'
import { verifyHeaderCookie } from '~/middleware/_verifyHeaderCookie'
import { getRedirectConfig } from '~/app/api/admin/setting/redirect/getRedirectConfig'
import type { UserState } from '~/store/userStore'

export const getStatus = async (uid: number | undefined) => {
  const user = await prisma.user.findUnique({
    where: { id: uid }
  })
  if (!user) {
    return '用户未找到'
  }

  await prisma.user.update({
    where: { id: uid },
    data: { last_login_time: { set: Date.now().toString() } }
  })

  // 使用类型断言处理claimed_tasks字段
  const userWithClaims = user as any;

  const redirectConfig = await getRedirectConfig()
  const responseData: UserState = {
    uid: user.id,
    name: user.name,
    avatar: user.avatar,
    bio: user.bio,
    moemoepoint: user.moemoepoint,
    role: user.role,
    dailyCheckIn: user.daily_check_in,
    dailyImageLimit: user.daily_image_count,
    dailyUploadLimit: user.daily_upload_size,
    enableEmailNotice: user.enable_email_notice,
    claimed_tasks: Array.isArray(userWithClaims.claimed_tasks) ? userWithClaims.claimed_tasks : [],
    ...redirectConfig
  }

  return responseData
}

export async function GET(req: NextRequest) {
  const payload = await verifyHeaderCookie(req)
  if (!payload) {
    return NextResponse.json('用户登陆失效')
  }

  const status = await getStatus(payload?.uid)
  return NextResponse.json(status)
}
