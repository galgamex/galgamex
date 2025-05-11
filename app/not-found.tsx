import { Metadata } from 'next'
import { ErrorComponent } from '~/components/error/ErrorComponent'

export const metadata: Metadata = {
    title: '404 - 页面未找到',
    description: '你访问的页面不存在或已被删除'
}

export default function NotFound() {
    return (
        <ErrorComponent error="404 - 你访问的页面不存在或已被删除" />
    )
} 