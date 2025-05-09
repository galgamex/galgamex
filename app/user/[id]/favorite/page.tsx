import { UserFavorite } from '~/components/user/favorite/Container'
import { kunGetActions } from './actions'
import { ErrorComponent } from '~/components/error/ErrorComponent'

export const revalidate = 3

interface Props {
  params: Promise<{ id: string }>
}

export default async function Kun({ params }: Props) {
  const { id } = await params

  const response = await kunGetActions(Number(id))
  if (typeof response === 'string') {
    return <ErrorComponent error={response} />
  }

  return (
    <UserFavorite
      initialFolders={response.folders}
      pageUid={Number(id)}
      currentUserUid={response.currentUserUid}
    />
  )
}
