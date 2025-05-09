'use client'

import { EmailTemplate } from './EmailTemplate'

export const EmailSetting = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">邮件群发</h1>
      </div>

      <EmailTemplate />
    </div>
  )
}
