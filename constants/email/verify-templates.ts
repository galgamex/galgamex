import { kunMoyuMoe } from '~/config/moyu-moe'

export const createKunVerificationEmailTemplate = (
  type: 'register' | 'forgot' | 'reset',
  code: string
) => {
  const titles = {
    register: `欢迎注册 ${kunMoyuMoe.titleShort}`,
    forgot: `忘记密码`,
    reset: `更改邮箱验证`
  }

  const messages = {
    register: `感谢您注册 ${kunMoyuMoe.titleShort}, 请使用下面的验证码以完成您的注册`,
    forgot: '我们收到了您重置密码的请求, 请使用下面的验证码以继续',
    reset: '您正在更改您的邮箱地址, 请使用下面的验证码以让我们确认您的新邮箱'
  }

  const iconImage = `${process.env.NEXT_PUBLIC_KUN_PATCH_ADDRESS_DEV}/favicon.webp`

  return `
<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${kunMoyuMoe.titleShort} 邮箱验证码</title>
    <!--[if mso]>
      <style>
        table {
          border-collapse: collapse;
          border-spacing: 0;
          border: none;
          margin: 0;
        }
        div,
        td {
          padding: 0;
        }
        div {
          margin: 0 !important;
        }
      </style>
      <noscript>
        <xml>
          <o:OfficeDocumentSettings>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      </noscript>
    <![endif]-->
    <style>
      body {
        margin: 0;
        padding: 0;
        width: 100% !important;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }

      img {
        max-width: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      h1 {
        padding-left: 10px;
        color: #27272a;
      }

      .container {
        max-width: 600px;
        margin: 0 auto;
      }

      .header {
        background: #e6f1fe;
        color: white;
        padding: 30px;
        display: flex;
        justify-content: center;
        align-items: center;
        border-radius: 14px 14px 0 0;
      }

      .content {
        background: #ffffff;
        padding: 40px 30px;
        text-align: center;
        border-radius: 0 0 14px 14px;
      }

      .code {
        font-size: 32px;
        letter-spacing: 4px;
        color: #006fee;
        background: #e4e4e7;
        padding: 16px 32px;
        border-radius: 8px;
        margin: 24px 0;
        display: inline-block;
      }

      .footer {
        color: #a1a1aa;
        font-size: 14px;
        margin-top: 24px;
        padding-top: 24px;
        border-top: 1px solid #e4e4e7;
      }

      @media only screen and (max-width: 480px) {
        .container {
          width: 100% !important;
        }

        .content {
          padding: 30px 20px !important;
        }

        .code {
          font-size: 24px !important;
          padding: 12px 24px !important;
        }
      }
    </style>
  </head>
  <body style="background-color: #e4e4e7; padding: 40px 0">
    <div class="container">
      <div class="header">
        <img src="${iconImage}" />
        <h1 style="margin: 0; font-size: 24px; font-weight: 600">
          ${titles[type]}
        </h1>
      </div>
      <div class="content">
        <p
          style="
            color: #374151;
            font-size: 16px;
            line-height: 24px;
            margin: 0 0 24px 0;
          "
        >
          ${messages[type]}
        </p>
        <div class="code">${code}</div>
        <p style="color: #374151; font-size: 14px; margin: 0">
          验证码在十分钟之内有效。
        </p>
        <div class="footer">
          <p style="margin: 0"> 如果您没有进行相关操作, 请忽略这封邮件。 </p>
        </div>
      </div>
    </div>
  </body>
</html>
  `
}
