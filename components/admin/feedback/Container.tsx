'use client'

import { useEffect, useState } from 'react'
import { kunFetchGet } from '~/utils/kunFetch'
import { KunLoading } from '~/components/kun/Loading'
import { useMounted } from '~/hooks/useMounted'
import { FeedbackCard } from './FeedbackCard'
import { KunPagination } from '~/components/kun/Pagination'
import type { AdminFeedback } from '~/types/api/admin'

interface Props {
  initialFeedbacks: AdminFeedback[]
  total: number
}

export const Feedback = ({ initialFeedbacks, total }: Props) => {
  const [feedbacks, setFeedbacks] = useState<AdminFeedback[]>(initialFeedbacks)
  const [page, setPage] = useState(1)
  const isMounted = useMounted()

  const [loading, setLoading] = useState(false)
  const fetchData = async () => {
    setLoading(true)

    const { feedbacks } = await kunFetchGet<{
      feedbacks: AdminFeedback[]
      total: number
    }>('/admin/feedback', {
      page,
      limit: 30
    })

    setLoading(false)
    setFeedbacks(feedbacks)
  }

  useEffect(() => {
    if (!isMounted) {
      return
    }
    fetchData()
  }, [page])

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Gal 反馈管理</h1>

      <div className="space-y-4">
        {loading ? (
          <KunLoading hint="正在获取反馈数据..." />
        ) : (
          <>
            {feedbacks.map((feedback) => (
              <FeedbackCard key={feedback.id} feedback={feedback} />
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
