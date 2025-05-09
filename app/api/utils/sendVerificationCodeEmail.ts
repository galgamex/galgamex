import { createTransport } from 'nodemailer'
import SMPTransport from 'nodemailer-smtp-transport'
import { getRemoteIp } from './getRemoteIp'
import { getKv, setKv } from '~/lib/redis'
import { generateRandomCode } from './generateRandomCode'
import { kunMoyuMoe } from '~/config/moyu-moe'
import { createKunVerificationEmailTemplate } from '~/constants/email/verify-templates'

export const sendVerificationCodeEmail = async (
  headers: Headers,
  email: string,
  type: 'register' | 'forgot' | 'reset'
) => {
  const ip = getRemoteIp(headers)

  const limitEmail = await getKv(`limit:email:${email}`)
  const limitIP = await getKv(`limit:ip:${ip}`)
  if (limitEmail || limitIP) {
    return '您发送邮件的频率太快了, 请 60 秒后重试'
  }

  const code = generateRandomCode(7)
  await setKv(email, code, 10 * 60)
  await setKv(`limit:email:${email}`, code, 60)
  await setKv(`limit:ip:${ip}`, code, 60)

  const transporter = createTransport(
    SMPTransport({
      pool: {
        pool: true
      },
      host: process.env.KUN_VISUAL_NOVEL_EMAIL_HOST,
      port: Number(process.env.KUN_VISUAL_NOVEL_EMAIL_PORT) || 587,
      secure: false,
      requireTLS: true,
      auth: {
        user: process.env.KUN_VISUAL_NOVEL_EMAIL_ACCOUNT,
        pass: process.env.KUN_VISUAL_NOVEL_EMAIL_PASSWORD
      }
    })
  )

  const mailOptions = {
    from: `${process.env.KUN_VISUAL_NOVEL_EMAIL_FROM}<${process.env.KUN_VISUAL_NOVEL_EMAIL_ACCOUNT}>`,
    sender: process.env.KUN_VISUAL_NOVEL_EMAIL_ACCOUNT,
    to: email,
    subject: `${kunMoyuMoe.titleShort} - 验证码`,
    html: createKunVerificationEmailTemplate(type, code)
  }

  await transporter.sendMail(mailOptions)
}
