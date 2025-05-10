import { Tasks } from '~/components/tasks/Tasks'
import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: '任务中心 - 功德街',
    description: '完成任务，获取萌萌点'
}

export default function TasksPage() {
    return <Tasks />
} 