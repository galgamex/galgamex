'use client'

import { useEffect, useState } from 'react'
import { kunFetchGet } from '~/utils/kunFetch'
import { KunLoading } from '~/components/kun/Loading'
import { useMounted } from '~/hooks/useMounted'
import { ReportCard } from './ReportCard'
import { KunPagination } from '~/components/kun/Pagination'
import type { AdminReport } from '~/types/api/admin'

interface Props {
  initialReports: AdminReport[]
  total: number
}

export const Report = ({ initialReports, total }: Props) => {
  const [reports, setReports] = useState<AdminReport[]>(initialReports)
  const [page, setPage] = useState(1)
  const isMounted = useMounted()

  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)

    const { reports } = await kunFetchGet<{
      reports: AdminReport[]
      total: number
    }>('/admin/report', {
      page,
      limit: 30
    })

    setLoading(false)
    setReports(reports)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchData()
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">评论举报管理</h1>

      <div className="space-y-4">
        {loading ? (
          <KunLoading hint="正在获取举报数据..." />
        ) : (
          <>
            {reports.map((report) => (
              <ReportCard key={report.id} report={report} />
            ))}
          </>
        )}
      </div>

      <div className="flex justify-center">
        <KunPagination
          total={Math.ceil(total / 30)}
          page={page}
          onPageChange={setPage}
          isLoading={loading}
        />
      </div>
    </div>
  )
}
