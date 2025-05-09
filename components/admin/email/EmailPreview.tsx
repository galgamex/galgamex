'use client'

import { Card, CardBody, Tabs, Tab } from '@nextui-org/react'
import { Mail, Code, Eye } from 'lucide-react'

interface Props {
  content: string
  previewOnly?: boolean
}

export const EmailPreview = ({ content, previewOnly = false }: Props) => {
  if (previewOnly) {
    return (
      <iframe
        srcDoc={content}
        style={{ width: '100%', height: '500px', border: 'none' }}
        title="Email preview"
      />
    )
  }

  return (
    <Card>
      <CardBody className="space-y-4">
        <div className="flex items-center gap-2 text-default-500">
          <Mail className="w-4 h-4" />
          <h3 className="text-sm font-medium">邮件预览</h3>
        </div>

        <Tabs aria-label="预览选项">
          <Tab
            key="preview"
            title={
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4" />
                <span>实时预览</span>
              </div>
            }
          >
            <div className="mt-4">
              <iframe
                srcDoc={content}
                style={{ width: '100%', height: '500px', border: 'none' }}
                title="Email preview"
              />
            </div>
          </Tab>
          <Tab
            key="source"
            title={
              <div className="flex items-center gap-2">
                <Code className="w-4 h-4" />
                <span>源代码</span>
              </div>
            }
          >
            <pre className="p-4 mt-4 overflow-auto text-sm rounded-lg bg-default-50">
              {content}
            </pre>
          </Tab>
        </Tabs>
      </CardBody>
    </Card>
  )
}
