'use client'

import { Button, Input, Link, Tooltip } from '@nextui-org/react'
import { useRewritePatchStore } from '~/store/rewriteStore'
import toast from 'react-hot-toast'
import { ExternalLink, Search, HelpCircle } from 'lucide-react'
import type { VNDBResponse } from '../VNDB'

interface Props {
  vndbId: string
  setVNDBId: (vndbId: string) => void
  errors?: string
}

export const VNDBInput = ({ vndbId, setVNDBId, errors }: Props) => {
  const { data, setData } = useRewritePatchStore()

  const handleFetchVNDBData = async () => {
    if (!data.vndbId) {
      toast.error('VNDB ID 不可为空')
      return
    }

    toast('正在从 VNDB 获取数据...')
    const vndbResponse = await fetch(`https://api.vndb.org/kana/vn`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        filters: ['id', '=', data.vndbId],
        fields: 'title, titles.lang, titles.title, aliases, released'
      })
    })

    const vndbData: VNDBResponse = await vndbResponse.json()
    const allTitles = vndbData.results.flatMap((vn) => {
      const jaTitle = vn.titles.find((t) => t.lang === 'ja')?.title
      const titlesArray = [
        ...(jaTitle ? [jaTitle] : []),
        vn.title,
        ...vn.titles.filter((t) => t.lang !== 'ja').map((t) => t.title),
        ...vn.aliases
      ]
      return titlesArray
    })

    setData({
      ...data,
      alias: [...new Set(allTitles)],
      released: vndbData.results[0].released
    })

    toast.success('获取数据成功! 已为您自动添加游戏别名')
  }

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center gap-2">
        <h2 className="text-xl">VNDB ID</h2>
        <Tooltip content="可从VNDB获取游戏信息，但会覆盖现有别名和发售日期">
          <HelpCircle className="text-default-400 size-4" />
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <Input
          variant="bordered"
          labelPlacement="outside"
          placeholder="请输入 VNDB ID, 例如 v19658"
          value={vndbId}
          onChange={(e) => setVNDBId(e.target.value)}
          isInvalid={!!errors}
          errorMessage={errors}
          startContent={<Search className="text-default-400 size-4" />}
          className="flex-1"
        />
        {data.vndbId && (
          <Button
            color="primary"
            onPress={handleFetchVNDBData}
            className="min-w-24"
          >
            获取数据
          </Button>
        )}
      </div>

      <div className="p-3 bg-default-100 rounded-md text-sm space-y-2">
        <div className="flex items-center gap-1 text-primary">
          <ExternalLink className="size-4" />
          <Link
            isExternal
            target="_blank"
            underline="hover"
            href={`https://vndb.org/${data.vndbId ? data.vndbId : ''}`}
            size="sm"
          >
            {data.vndbId ? `浏览 ${data.vndbId} 页面` : '前往 VNDB 网站'}
          </Link>
        </div>

        <p className="text-default-600">
          VNDB ID 在游戏页面的 URL 中，形如 https://vndb.org/<b>v19658</b>
        </p>

        <p className="text-warning">
          <b>注意：</b> 获取数据将覆盖您已填写的别名和发售日期
        </p>
      </div>
    </div>
  )
}
