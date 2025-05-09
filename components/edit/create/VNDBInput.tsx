'use client'

import { Button, Input, Link, Tooltip } from '@nextui-org/react'
import { useCreatePatchStore } from '~/store/editStore'
import toast from 'react-hot-toast'
import { kunFetchGet } from '~/utils/kunFetch'
import { ExternalLink, Search, HelpCircle } from 'lucide-react'
import type { VNDBResponse } from '../VNDB'

interface Props {
  errors: string | undefined
}

export const VNDBInput = ({ errors }: Props) => {
  const { data, setData } = useCreatePatchStore()

  const handleCheckDuplicate = async () => {
    if (!data.vndbId) {
      toast.error('VNDB ID 不可为空')
      return
    }

    const res = await kunFetchGet<KunResponse<{}>>('/edit/duplicate', {
      vndbId: data.vndbId
    })
    if (typeof res === 'string') {
      toast.error('游戏重复, 该游戏已经有人发布过了')
      return
    } else {
      toast.success('检测完成, 该游戏并未重复!')
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
        <Tooltip content="强烈建议填写VNDB ID，可自动获取游戏信息并检查重复">
          <HelpCircle className="text-default-400 size-4" />
        </Tooltip>
      </div>

      <div className="flex gap-2">
        <Input
          variant="bordered"
          labelPlacement="outside"
          placeholder="请输入 VNDB ID, 例如 v19658"
          value={data.vndbId}
          onChange={(e) => setData({ ...data, vndbId: e.target.value })}
          isInvalid={!!errors}
          errorMessage={errors}
          startContent={<Search className="text-default-400 size-4" />}
          className="flex-1"
        />
        {data.vndbId && (
          <Button
            color="primary"
            onPress={handleCheckDuplicate}
            className="min-w-24"
          >
            检查并导入
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

        <p>
          VNDB ID 在游戏页面的 URL 中，形如 https://vndb.org/<b>v19658</b>
        </p>

        <p>
          填写 VNDB ID 将自动生成游戏发售日期与别名，并检查游戏是否重复
        </p>
      </div>
    </div>
  )
}
