import { UserCharacter } from '~/components/user/character/Container'

export default function Page({
    params
}: {
    params: Promise<{ id: string }>
}) {
    return <UserCharacter params={params} />
} 