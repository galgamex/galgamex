'use client'

import { Button, Card, CardBody, CardFooter, CardHeader } from '@nextui-org/react'
import { AlertTriangle, Home } from 'lucide-react'
import { useRouter } from 'next/navigation'

export default function NotFound() {
    const router = useRouter()

    return (
        <div className="flex items-center justify-center p-8 size-full">
            <Card className="w-full max-w-lg shadow-2xl">
                <CardHeader className="flex gap-3 px-8 pt-8">
                    <div className="flex items-center gap-4">
                        <div className="p-3 rounded-full bg-danger-50">
                            <AlertTriangle className="size-8 text-danger" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-foreground">404 - 页面未找到</h1>
                            <p className="text-default-500">你访问的页面不存在或已被删除</p>
                        </div>
                    </div>
                </CardHeader>
                <CardBody className="px-8">
                    <div className="p-4 mt-4 rounded-lg bg-danger-50">
                        <p className="font-mono text-sm text-danger">你访问的页面不存在或已被删除</p>
                    </div>
                </CardBody>
                <CardFooter className="flex flex-wrap gap-2 px-8 pb-8">
                    <Button
                        startContent={<Home className="size-4" />}
                        color="primary"
                        onPress={() => router.push('/')}
                    >
                        返回首页
                    </Button>
                </CardFooter>
            </Card>
        </div>
    )
} 