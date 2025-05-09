import { CardContainer } from '~/components/galgame/Container'
import { kunMetadata } from './metadata'
import { Suspense } from 'react'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'
import type { Metadata } from 'next'
import type { SortField, SortOrder } from '~/components/galgame/_sort'

export const revalidate = 3

export const metadata: Metadata = kunMetadata

interface QueryParams {
  page?: number
  sortOrder: SortOrder
  sortField: SortField
  type: string
  language: string
  platform: string
}

interface Props {
  searchParams?: Promise<QueryParams>
}

export default async function Kun({ searchParams }: Props) {
  const res = await searchParams
  const currentPage = res?.page ? res.page : 1
  const sortField = res?.sortField ? res.sortField : 'resource_update_time'
  const sortOrder = res?.sortOrder ? res.sortOrder : 'desc'

  const selectedType = res?.type ? res.type : 'all'
  const selectedLanguage = res?.language ? res.language : 'all'
  const selectedPlatform = res?.platform ? res.platform : 'all'

  const response = await kunGetActions({
    selectedType,
    selectedLanguage,
    selectedPlatform,
    sortField,
    sortOrder,
    page: currentPage,
    limit: 24,
    yearString: JSON.stringify(['all']),
    monthString: JSON.stringify(['all'])
  })
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <Suspense>
      <CardContainer
        initialGalgames={response.galgames}
        initialTotal={response.total}
      />
    </Suspense>
  )
}
