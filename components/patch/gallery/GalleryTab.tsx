'use client'

import { useEffect, useState } from 'react'
import { Card, CardBody, CardHeader } from '@nextui-org/card'
import { KunImageViewer } from '~/components/kun/image-viewer/ImageViewer'
import { KunLoading } from '~/components/kun/Loading'
import { parsedMarkdownToImages } from '~/utils/parsedMarkdownToImages'
import type { PatchIntroduction } from '~/types/api/patch'

interface Props {
    intro: PatchIntroduction
}

export const GalleryTab = ({ intro }: Props) => {
    const [images, setImages] = useState<{ src: string; alt: string }[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        // 从介绍内容中提取所有图片
        const extractImages = async () => {
            if (!intro.introduction) {
                setLoading(false)
                return
            }

            try {
                const extractedImages = await parsedMarkdownToImages(intro.introduction)
                setImages(extractedImages)
            } catch (error) {
                console.error('提取图片失败:', error)
            } finally {
                setLoading(false)
            }
        }

        extractImages()
    }, [intro.introduction])

    return (
        <Card className="border-none shadow-sm min-h-[450px]">
            <CardHeader className="px-5 pt-4 pb-0 flex justify-between items-center">
                <h2 className="text-xl font-semibold">游戏画廊</h2>
                <div className="text-sm text-default-500">
                    共 {images.length} 张图片
                </div>
            </CardHeader>
            <CardBody className="p-4">
                {loading ? (
                    <KunLoading hint="正在加载图片..." />
                ) : images.length === 0 ? (
                    <div className="text-center py-16 text-default-500">
                        <p className="text-xl">暂无图片</p>
                        <p className="text-sm mt-2">该游戏介绍中没有添加任何图片</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                        {images.map((image, index) => (
                            <div
                                key={index}
                                className="overflow-hidden rounded-lg cursor-pointer group"
                                style={{ aspectRatio: '16/9', maxHeight: '180px' }}
                            >
                                <KunImageViewer images={images} initialIndex={index}>
                                    {(openLightbox) => (
                                        <div
                                            onClick={openLightbox}
                                            className="relative w-full h-full"
                                        >
                                            <img
                                                src={image.src}
                                                alt={image.alt || '游戏图片'}
                                                className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                                            />
                                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                                                <span className="text-white text-sm">点击查看</span>
                                            </div>
                                        </div>
                                    )}
                                </KunImageViewer>
                            </div>
                        ))}
                    </div>
                )}
            </CardBody>
        </Card>
    )
} 