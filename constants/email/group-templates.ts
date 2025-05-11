import { kunMoyuMoe } from '~/config/moyu-moe'
import { galgamexTemplate } from './templates/touchgal'
import { announcementTemplate } from './templates/announcement'

export interface EmailTemplate {
  id: string
  name: string
  template: string
}

export const emailTemplates: EmailTemplate[] = [
  {
    id: 'galgamex',
    name: `${kunMoyuMoe.titleShort} 全体消息`,
    template: galgamexTemplate(
      '{{title}}',
      '{{content}}',
      '{{email}}',
      '{{validateEmailCode}}'
    )
  },
  {
    id: 'announcement',
    name: `${kunMoyuMoe.titleShort} 重要公告`,
    template: announcementTemplate(
      '{{title}}',
      '{{content}}',
      '{{email}}',
      '{{validateEmailCode}}'
    )
  }
]
