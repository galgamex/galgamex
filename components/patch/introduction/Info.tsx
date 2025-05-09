import { Calendar, Clock, Link, RefreshCw } from 'lucide-react'
import { formatDate } from '~/utils/time'
import type { PatchIntroduction } from '~/types/api/patch'

interface Props {
  intro: PatchIntroduction
}

export const Info = ({ intro }: Props) => {
  return (
    <div className="space-y-4">
      <div className="grid gap-3 grid-cols-1 sm:grid-cols-2">
        <div className="flex items-center gap-2 text-sm text-default-500">
          <Clock className="size-4" />
          <span>发布时间: {formatDate(intro.created, { isShowYear: true })}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-default-500">
          <RefreshCw className="size-4" />
          <span>更新时间: {formatDate(intro.updated, { isShowYear: true })}</span>
        </div>
        {intro.released && (
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Calendar className="size-4" />
            <span>发售时间: {intro.released}</span>
          </div>
        )}
        {intro.vndbId && (
          <div className="flex items-center gap-2 text-sm text-default-500">
            <Link className="size-4" />
            <span>VNDB ID: {intro.vndbId}</span>
          </div>
        )}
      </div>

      {intro.alias.length > 0 && (
        <div className="pt-2">
          <h3 className="text-sm font-medium mb-2">游戏别名</h3>
          <ul className="text-sm list-disc list-inside text-default-500 space-y-1">
            {intro.alias.map((alias) => (
              <li key={Math.random()}>{alias}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
